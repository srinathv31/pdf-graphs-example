"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import PDFDocument from "./PDFDocument";
import { toast } from "sonner";

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

  const handleExport = async () => {
    setIsExporting(true);

    toast.promise(
      (async () => {
        // Add a slight delay to ensure charts have rendered in the DOM
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Create the PDF document
        const doc = (
          <PDFDocument title={title} description={description} data={data} />
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

  return (
    <Button onClick={handleExport} disabled={isExporting}>
      <Download className="mr-2 h-4 w-4" />
      {isExporting ? "Exporting..." : "Export PDF"}
    </Button>
  );
};

export default PDFExportButton;
