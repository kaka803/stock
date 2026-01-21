"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { fetchTopForex } from '@/components/utils/fcsForexApi';

const ForexContext = createContext();

export function ForexProvider({ children }) {
  const [forex, setForex] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadForex = async () => {
    if (forex.length > 0) return;

    setLoading(true);
    const data = await fetchTopForex();
    if (Array.isArray(data)) {
      setForex(data);
    }
    setLoading(false);
  };

  const value = useMemo(() => ({
    forex,
    loading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    loadForex,
    getForexBySymbol: (symbol) => forex.find(f => f.symbol === symbol)
  }), [forex, loading, searchQuery, currentPage]);

  return (
    <ForexContext.Provider value={value}>
      {children}
    </ForexContext.Provider>
  );
}

export function useForex() {
  const context = useContext(ForexContext);
  if (context === undefined) {
    throw new Error('useForex must be used within a ForexProvider');
  }
  return context;
}
