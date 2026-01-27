"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { fetchTop100Stocks } from '@/components/utils/fcsApi';

const StockContext = createContext();

export function StockProvider({ children }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch stocks function exposed to components
  const loadStocks = React.useCallback(async () => {
    // If we already have data and it's fresh (optional logic), we could skip
    // But for now, simple check if we have data to avoid re-fetching on simple navigations if desired
    if (stocks.length > 0) return; 

    setLoading(true);
    const data = await fetchTop100Stocks();
    if (data) {
      setStocks(data);
    }
    setLoading(false);
  }, [stocks.length]);

  const value = useMemo(() => ({
    stocks,
    loading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    loadStocks, // Exporting this so StocksPage can call it
    // Helper to find a specific stock easily
    getStockBySymbol: (symbol) => stocks.find(s => s.symbol === symbol)
  }), [stocks, loading, searchQuery, currentPage, loadStocks]);

  return (
    <StockContext.Provider value={value}>
      {children}
    </StockContext.Provider>
  );
}

export function useStock() {
  return useContext(StockContext);
}
