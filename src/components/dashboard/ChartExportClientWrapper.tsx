"use client";
import React, { useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import { useChartExportContext } from "./ChartExportProvider";

interface ChartExportClientWrapperProps {
  id: string;
  children: React.ReactNode;
}

const ChartExportClientWrapper: React.FC<ChartExportClientWrapperProps> = ({
  id,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { register, unregister } = useChartExportContext();

  useEffect(() => {
    const handle = {
      id,
      getPng: async () => {
        if (!ref.current) throw new Error(`No ref for chart ${id}`);
        return await toPng(ref.current, { cacheBust: true, skipFonts: true });
      },
    };
    register(handle);
    return () => unregister(id);
  }, [id, register, unregister]);

  return (
    <div ref={ref} data-chart-export-id={id}>
      {children}
    </div>
  );
};

export default ChartExportClientWrapper;
