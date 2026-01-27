"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { fetchTopEtfs } from '@/components/utils/etfApi';

const EtfContext = createContext();

export function EtfProvider({ children }) {
  const [etfs, setEtfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadEtfs = React.useCallback(async () => {
    if (etfs.length > 0) return; 

    setLoading(true);
    const data = await fetchTopEtfs();
    if (data) {
      setEtfs(data);
    }
    setLoading(false);
  }, [etfs.length]);

  const value = useMemo(() => ({
    etfs,
    loading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    loadEtfs,
    getEtfBySymbol: (symbol) => etfs.find(e => e.symbol === symbol)
  }), [etfs, loading, searchQuery, currentPage, loadEtfs]);

  return (
    <EtfContext.Provider value={value}>
      {children}
    </EtfContext.Provider>
  );
}

export function useEtf() {
  return useContext(EtfContext);
}
