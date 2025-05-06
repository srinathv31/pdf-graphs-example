"use client";
import React, { createContext, useContext, useRef, useCallback } from "react";

export interface ChartExportHandle {
  id: string;
  getPng: () => Promise<string>;
}

interface ChartExportContextType {
  register: (handle: ChartExportHandle) => void;
  unregister: (id: string) => void;
  getHandles: () => ChartExportHandle[];
}

const ChartExportContext = createContext<ChartExportContextType | undefined>(
  undefined
);

export const useChartExportContext = () => {
  const ctx = useContext(ChartExportContext);
  if (!ctx)
    throw new Error(
      "useChartExportContext must be used within ChartExportProvider"
    );
  return ctx;
};

export const ChartExportProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const handlesRef = useRef<Map<string, ChartExportHandle>>(new Map());

  const register = useCallback((handle: ChartExportHandle) => {
    handlesRef.current.set(handle.id, handle);
  }, []);

  const unregister = useCallback((id: string) => {
    handlesRef.current.delete(id);
  }, []);

  const getHandles = useCallback(
    () => Array.from(handlesRef.current.values()),
    []
  );

  return (
    <ChartExportContext.Provider value={{ register, unregister, getHandles }}>
      {children}
    </ChartExportContext.Provider>
  );
};
