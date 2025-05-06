"use client";

import { useState, useRef } from "react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import PDFDocument from "./PDFDocument";
import { toast } from "sonner";
import domtoimage from "dom-to-image";
import MonthlyBarChart from "../dashboard/MonthlyBarChart";

interface PDFExportButtonProps {
  title: string;
  description: string;
  data: any;
}

const PDFExportButton = ({
  title,
  description,
  data,
}: PDFExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    setIsExporting(true);

    toast.promise(
      (async () => {
        // Add a slight delay to ensure charts have rendered in the DOM
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Capture the chart as an image
        let monthlyBarImage = undefined;
        if (chartRef.current) {
          monthlyBarImage = await domtoimage.toPng(chartRef.current);
          console.log("Captured chart image:", monthlyBarImage);
        }

        // Create the PDF document, passing the chart image(s)
        const doc = (
          <PDFDocument
            title={title}
            description={description}
            data={data}
            chartImages={{ monthlyBar: monthlyBarImage }}
          />
        );
        const blob = await pdf(doc).toBlob();

        // Create a URL for the blob
        const url = URL.createObjectURL(blob);

        // Create a link and trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title.replace(/\s+/g, "-").toLowerCase()}-${
          new Date().toISOString().split("T")[0]
        }.pdf`;
        link.click();

        // Clean up
        URL.revokeObjectURL(url);
      })(),
      {
        loading: "Preparing PDF...",
        success:
          "PDF exported successfully! Your dashboard has been exported to PDF.",
        error: "There was an error exporting your PDF. Please try again.",
      }
    );
    setIsExporting(false);
  };

  // Render the chart off-screen for image capture
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 400,
          height: 320,
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      >
        <MonthlyBarChart ref={chartRef} data={data.monthlySales} />
      </div>
      <Button onClick={handleExport} disabled={isExporting}>
        <Download className="mr-2 h-4 w-4" />
        {isExporting ? "Exporting..." : "Export PDF"}
      </Button>
    </>
  );
};

export default PDFExportButton;
