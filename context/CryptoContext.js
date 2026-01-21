"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { fetchTopCryptos } from '@/components/utils/fcsCryptoApi';

const CryptoContext = createContext();

export function CryptoProvider({ children }) {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const loadCryptos = async () => {
    // Basic caching/check if already loaded
    if (cryptos.length > 0) return;

    setLoading(true);
    const data = await fetchTopCryptos();
    if (Array.isArray(data)) {
      setCryptos(data);
    }
    setLoading(false);
  };

  const value = useMemo(() => ({
    cryptos,
    loading,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    loadCryptos,
    getCryptoBySymbol: (symbol) => cryptos.find(c => c.symbol === symbol)
  }), [cryptos, loading, searchQuery, currentPage]);

  return (
    <CryptoContext.Provider value={value}>
      {children}
    </CryptoContext.Provider>
  );
}

export function useCrypto() {
  return useContext(CryptoContext);
}
