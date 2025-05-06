import DashboardView from "@/components/dashboard/DashboardView";
import PDFExportButton from "@/components/pdf/PDFExportButton";
import { dashboardData } from "@/data/dashboardData";

export default function Home() {
  const dashboardTitle = "Dashboard";
  const dashboardDescription = "This is a dashboard";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {dashboardTitle}
            </h1>
            <p className="text-muted-foreground">{dashboardDescription}</p>
          </div>
          <PDFExportButton
            title={dashboardTitle}
            description={dashboardDescription}
            data={dashboardData}
          />
        </div>

        <div className="w-full">
          <DashboardView data={dashboardData} />
        </div>
      </div>
    </div>
  );
}
