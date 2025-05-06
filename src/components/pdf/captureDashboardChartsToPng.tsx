import React from "react";
import { createRoot } from "react-dom/client";
import ChartToPng from "./ChartToPng";
import CustomersLineChart from "../dashboard/CustomersLineChart";
import DepartmentPieChart from "../dashboard/DepartmentPieChart";
import DailyVisitsAreaChart from "../dashboard/DailyVisitsAreaChart";
import MonthlyBarChart from "../dashboard/MonthlyBarChart";
import SummaryCard from "../dashboard/SummaryCard";

interface DashboardData {
  summaryCards: Array<{
    title: string;
    description: string;
    data: number[];
    color: string;
  }>;
  monthlySales: unknown;
  departmentSales: unknown;
  dailyVisits: unknown;
  customers: unknown;
}

export interface DashboardChartsPngs {
  summaryCards: string[];
  monthlySales: string;
  departmentSales: string;
  dailyVisits: string;
  customers: string;
}

/**
 * Captures all dashboard charts as PNGs and resolves with their data URLs.
 * @param data Dashboard data
 * @returns Promise<DashboardChartsPngs>
 */
export function captureDashboardChartsToPng(
  data: DashboardData
): Promise<DashboardChartsPngs> {
  return new Promise((resolve, reject) => {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.width = "0";
    container.style.height = "0";
    document.body.appendChild(container);

    const results: Partial<DashboardChartsPngs> = {
      summaryCards: [],
    };
    let finished = false;

    // Timeout fallback
    const timeout = setTimeout(() => {
      if (!finished) {
        console.error("PNG generation timed out", results);
        root.unmount();
        document.body.removeChild(container);
        reject(new Error("PNG generation timed out"));
      }
    }, 10000); // 10 seconds

    function checkDone() {
      if (
        results.summaryCards!.length === data.summaryCards.length &&
        results.monthlySales &&
        results.departmentSales &&
        results.dailyVisits &&
        results.customers
      ) {
        finished = true;
        clearTimeout(timeout);
        console.log("All PNGs generated", results);
        setTimeout(() => {
          root.unmount();
          document.body.removeChild(container);
          resolve(results as DashboardChartsPngs);
        }, 10);
      }
    }

    const root = createRoot(container);
    root.render(
      <>
        {/* Summary Cards */}
        {data.summaryCards.map((card, idx) => (
          <ChartToPng
            key={idx}
            width={120}
            height={70}
            onPngReady={(dataUrl) => {
              console.log(
                `SummaryCard[${idx}] PNG generated`,
                dataUrl.slice(0, 100)
              );
              results.summaryCards![idx] = dataUrl;
              checkDone();
            }}
          >
            <SummaryCard {...card} />
          </ChartToPng>
        ))}
        {/* Monthly Sales Bar Chart */}
        <ChartToPng
          width={340}
          height={180}
          onPngReady={(dataUrl) => {
            console.log("MonthlyBarChart PNG generated", dataUrl.slice(0, 100));
            results.monthlySales = dataUrl;
            checkDone();
          }}
        >
          <MonthlyBarChart
            data={
              data.monthlySales as Parameters<typeof MonthlyBarChart>[0]["data"]
            }
          />
        </ChartToPng>
        {/* Department Pie Chart */}
        <ChartToPng
          width={340}
          height={180}
          onPngReady={(dataUrl) => {
            console.log(
              "DepartmentPieChart PNG generated",
              dataUrl.slice(0, 100)
            );
            results.departmentSales = dataUrl;
            checkDone();
          }}
        >
          <DepartmentPieChart
            data={
              data.departmentSales as Parameters<
                typeof DepartmentPieChart
              >[0]["data"]
            }
          />
        </ChartToPng>
        {/* Daily Visits Area Chart */}
        <ChartToPng
          width={340}
          height={180}
          onPngReady={(dataUrl) => {
            console.log(
              "DailyVisitsAreaChart PNG generated",
              dataUrl.slice(0, 100)
            );
            results.dailyVisits = dataUrl;
            checkDone();
          }}
        >
          <DailyVisitsAreaChart
            data={
              data.dailyVisits as Parameters<
                typeof DailyVisitsAreaChart
              >[0]["data"]
            }
          />
        </ChartToPng>
        {/* Customers Line Chart */}
        <ChartToPng
          width={340}
          height={180}
          onPngReady={(dataUrl) => {
            console.log(
              "CustomersLineChart PNG generated",
              dataUrl.slice(0, 100)
            );
            results.customers = dataUrl;
            checkDone();
          }}
        >
          <CustomersLineChart
            data={
              data.customers as Parameters<typeof CustomersLineChart>[0]["data"]
            }
          />
        </ChartToPng>
      </>
    );
  });
}
