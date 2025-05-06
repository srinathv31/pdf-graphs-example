"use client";

import { useState, useRef } from "react";
import { pdf } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import PDFDocument from "./PDFDocument";
import { toast } from "sonner";
import domtoimage from "dom-to-image";
import MonthlyBarChart from "../dashboard/MonthlyBarChart";
import DepartmentPieChart from "../dashboard/DepartmentPieChart";
import DailyVisitsAreaChart from "../dashboard/DailyVisitsAreaChart";
import CustomersAreaChart from "../dashboard/CustomersLineChart";

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
  const monthlyBarRef = useRef<HTMLDivElement>(null);
  const departmentPieRef = useRef<HTMLDivElement>(null);
  const dailyVisitsRef = useRef<HTMLDivElement>(null);
  const customersRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    setIsExporting(true);

    // Helper to get image size from data URL
    const getImageSize = (
      dataUrl: string
    ): Promise<{ width: number; height: number }> => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () =>
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.src = dataUrl;
      });
    };

    toast.promise(
      (async () => {
        // Add a slight delay to ensure charts have rendered in the DOM
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Capture the charts as images
        let monthlyBarImage, monthlyBarImageSize;
        let departmentPieImage, departmentPieImageSize;
        let dailyVisitsImage, dailyVisitsImageSize;
        let customersImage, customersImageSize;
        if (monthlyBarRef.current) {
          monthlyBarImage = await domtoimage.toPng(monthlyBarRef.current);
          monthlyBarImageSize = await getImageSize(monthlyBarImage);
        }
        if (departmentPieRef.current) {
          departmentPieImage = await domtoimage.toPng(departmentPieRef.current);
          departmentPieImageSize = await getImageSize(departmentPieImage);
        }
        if (dailyVisitsRef.current) {
          dailyVisitsImage = await domtoimage.toPng(dailyVisitsRef.current);
          dailyVisitsImageSize = await getImageSize(dailyVisitsImage);
        }
        if (customersRef.current) {
          customersImage = await domtoimage.toPng(customersRef.current);
          customersImageSize = await getImageSize(customersImage);
        }

        // Create the PDF document, passing the chart images and sizes
        const doc = (
          <PDFDocument
            title={title}
            description={description}
            data={data}
            chartImages={{
              monthlyBar: monthlyBarImage,
              monthlyBarSize: monthlyBarImageSize,
              departmentPie: departmentPieImage,
              departmentPieSize: departmentPieImageSize,
              dailyVisits: dailyVisitsImage,
              dailyVisitsSize: dailyVisitsImageSize,
              customers: customersImage,
              customersSize: customersImageSize,
            }}
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

  // Render the charts off-screen for image capture
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
        <MonthlyBarChart ref={monthlyBarRef} data={data.monthlySales} />
        <DepartmentPieChart
          ref={departmentPieRef}
          data={data.departmentSales}
        />
        <DailyVisitsAreaChart ref={dailyVisitsRef} data={data.dailyVisits} />
        <CustomersAreaChart ref={customersRef} data={data.customers} />
      </div>
      <Button onClick={handleExport} disabled={isExporting}>
        <Download className="mr-2 h-4 w-4" />
        {isExporting ? "Exporting..." : "Export PDF"}
      </Button>
    </>
  );
};

export default PDFExportButton;
