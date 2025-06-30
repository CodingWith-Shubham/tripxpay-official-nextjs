"use client";
import { createContext, useContext, useState, useEffect } from "react";

export const ConsumerOrMerchantContext = createContext(null);

export function ConsumerOrMerchantProvider({ children }) {
  const [consumer, setConsumer] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const storedValue = localStorage.getItem("isConsumer");
        return storedValue === "true";
      } catch (error) {
        console.error("Failed to read 'isConsumer' from localStorage:", error);
      }
    }
    return false;
  });

  useEffect(() => {
    try {
      localStorage.setItem("isConsumer", consumer);
    } catch (error) {
      console.error("Failed to save 'isConsumer' to localStorage:", error);
    }
  }, [consumer]);

  const toggleAzenda = (val) => {
    if (typeof val === "boolean") {
      setConsumer(val);
    } else {
      setConsumer((prev) => !prev);
    }
  };

  return (
    <ConsumerOrMerchantContext.Provider value={{ consumer, toggleAzenda }}>
      {children}
    </ConsumerOrMerchantContext.Provider>
  );
}

export function useConsumerOrMerchant() {
  const context = useContext(ConsumerOrMerchantContext);
  if (!context) {
    throw new Error(
      "useConsumerOrMerchant must be used within a ConsumerOrMerchantProvider"
    );
  }
  return context;
} 