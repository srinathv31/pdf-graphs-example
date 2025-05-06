"use client";
import { ChartExportProvider } from "./ChartExportProvider";
import DashboardView from "./DashboardView";
import PDFExportButton from "../pdf/PDFExportButton";
import React from "react";

interface DashboardPageClientProps {
  title: string;
  description: string;
  data: any;
}

const DashboardPageClient: React.FC<DashboardPageClientProps> = ({
  title,
  description,
  data,
}) => {
  return (
    <ChartExportProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <PDFExportButton
              title={title}
              description={description}
              data={data}
            />
          </div>
          <div className="w-full">
            <DashboardView data={data} />
          </div>
        </div>
      </div>
    </ChartExportProvider>
  );
};

export default DashboardPageClient;
