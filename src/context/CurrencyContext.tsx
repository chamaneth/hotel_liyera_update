"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "LKR";

export interface CurrencyDetails {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // Conversion rate from base USD
}

export const supportedCurrencies: Record<CurrencyCode, CurrencyDetails> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", rate: 1.0 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", rate: 0.92 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79 },
  LKR: { code: "LKR", symbol: "Rs.", name: "Sri Lankan Rupee", rate: 305.0 },
};

interface CurrencyContextType {
  currency: CurrencyDetails;
  setCurrencyCode: (code: CurrencyCode) => void;
  convertPrice: (usdAmount: number) => number;
  formatPrice: (usdAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currencyCode, setCurrencyCodeState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("preferred_currency") as CurrencyCode;
      if (saved && supportedCurrencies[saved]) {
        setCurrencyCodeState(saved);
      }
    } catch {
      // Ignore localStorage errors in SSR or restricted environments
    }
  }, []);

  const setCurrencyCode = (code: CurrencyCode) => {
    if (supportedCurrencies[code]) {
      setCurrencyCodeState(code);
      try {
        localStorage.setItem("preferred_currency", code);
      } catch {
        // Ignore
      }
    }
  };

  const currency = supportedCurrencies[currencyCode];

  const convertPrice = (usdAmount: number): number => {
    return Math.round(usdAmount * currency.rate);
  };

  const formatPrice = (usdAmount: number): string => {
    const converted = convertPrice(usdAmount);
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrencyCode,
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
