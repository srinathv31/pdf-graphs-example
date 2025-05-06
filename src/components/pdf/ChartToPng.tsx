import React, { useRef, useEffect } from "react";
import { toPng } from "html-to-image";

interface ChartToPngProps {
  children: React.ReactNode;
  width: number;
  height: number;
  onPngReady: (dataUrl: string) => void;
  fontFamily?: string;
}

const ChartToPng: React.FC<ChartToPngProps> = ({
  children,
  width,
  height,
  onPngReady,
  fontFamily,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      toPng(ref.current, { width, height, cacheBust: true })
        .then(onPngReady)
        .catch(() => {
          // Optionally handle error
        });
    }
    // eslint-disable-next-line
  }, [children, width, height]);

  return (
    <div
      ref={ref}
      style={{
        width,
        height,
        position: "absolute",
        left: -9999,
        top: 0,
        pointerEvents: "none",
        opacity: 0,
        ...(fontFamily ? { fontFamily } : {}),
      }}
      aria-hidden
    >
      {children}
    </div>
  );
};

export default ChartToPng;
