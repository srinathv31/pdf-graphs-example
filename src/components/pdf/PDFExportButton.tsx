"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import PDFDocument from "./PDFDocument";
import { toast } from "sonner";
import { useChartExportContext } from "../dashboard/ChartExportProvider";

interface PDFExportButtonProps {
  title: string;
  description: string;
  data: any;
}

interface DashboardChartsPngs {
  summaryCards: string[];
  monthlySales: string;
  departmentSales: string;
  dailyVisits: string;
  customers: string;
}

const PDFExportButton = ({
  title,
  description,
  data,
}: PDFExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [debugPngs, setDebugPngs] = useState<DashboardChartsPngs | null>(null);
  const { getHandles } = useChartExportContext();

  const handleExport = async () => {
    setIsExporting(true);

    toast.promise(
      (async () => {
        // Add a slight delay to ensure charts have rendered in the DOM
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get all chart handles and sort by id for deterministic order
        const handles = getHandles().sort((a, b) => a.id.localeCompare(b.id));
        const pngs: Record<string, string> = {};
        for (const handle of handles) {
          pngs[handle.id] = await handle.getPng();
        }

        // Map PNGs to the expected structure
        const summaryCards: string[] = [];
        let monthlySales = "";
        let departmentSales = "";
        let dailyVisits = "";
        let customers = "";
        for (const [id, png] of Object.entries(pngs)) {
          if (id.startsWith("summary-card-")) {
            const idx = parseInt(id.replace("summary-card-", ""), 10);
            summaryCards[idx] = png;
          } else if (id === "monthly-sales") {
            monthlySales = png;
          } else if (id === "department-sales") {
            departmentSales = png;
          } else if (id === "daily-visits") {
            dailyVisits = png;
          } else if (id === "customers") {
            customers = png;
          }
        }
        const chartPngs: DashboardChartsPngs = {
          summaryCards,
          monthlySales,
          departmentSales,
          dailyVisits,
          customers,
        };
        setDebugPngs(chartPngs); // For debug: show PNGs in DOM

        // Create the PDF document with PNGs
        const doc = (
          <PDFDocument
            title={title}
            description={description}
            data={data}
            chartPngs={chartPngs}
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
        error: (e) => {
          console.error(e);
          return "There was an error exporting your PDF. Please try again.";
        },
      }
    );
    setIsExporting(false);
  };

  return (
    <div>
      <Button onClick={handleExport} disabled={isExporting}>
        <Download className="mr-2 h-4 w-4" />
        {isExporting ? "Exporting..." : "Export PDF"}
      </Button>
      {/* Debug: Render PNGs in DOM for inspection */}
      {debugPngs && (
        <div className="mt-6 space-y-4">
          <div className="font-bold">Debug: Chart PNGs Preview</div>
          <div className="flex flex-wrap gap-4">
            {debugPngs.summaryCards.map((src, idx) => (
              <img
                key={"summary-" + idx}
                src={src}
                alt={`Summary Card ${idx}`}
                style={{ width: 110, height: 60, border: "1px solid #ccc" }}
              />
            ))}
            <img
              src={debugPngs.monthlySales}
              alt="Monthly Sales"
              style={{ width: 160, height: 90, border: "1px solid #ccc" }}
            />
            <img
              src={debugPngs.departmentSales}
              alt="Department Sales"
              style={{ width: 160, height: 90, border: "1px solid #ccc" }}
            />
            <img
              src={debugPngs.dailyVisits}
              alt="Daily Visits"
              style={{ width: 160, height: 90, border: "1px solid #ccc" }}
            />
            <img
              src={debugPngs.customers}
              alt="Customers"
              style={{ width: 160, height: 90, border: "1px solid #ccc" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFExportButton;
