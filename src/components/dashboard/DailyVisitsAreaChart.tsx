"use client";

import React, { forwardRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DailyVisitsAreaChartProps {
  data: {
    categories: string[];
    series: Array<{
      name: string;
      data: number[];
      color: string;
    }>;
  };
}

const DailyVisitsAreaChart = forwardRef<
  HTMLDivElement,
  DailyVisitsAreaChartProps
>(({ data }, ref) => {
  // Convert the data to the format expected by Recharts
  const chartData = data.categories.map((category, index) => {
    const dataPoint: Record<string, number | string> = { name: category };
    data.series.forEach((series) => {
      dataPoint[series.name] = series.data[index];
    });
    return dataPoint;
  });

  return (
    <div className="h-64" ref={ref}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Legend />
          {data.series.map((series, index) => (
            <Area
              key={index}
              type="monotone"
              dataKey={series.name}
              fill={`theme(${series.color})`}
              stroke={`theme(${series.color})`}
              fillOpacity={0.3}
              stackId={index === 1 ? "1" : undefined}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

DailyVisitsAreaChart.displayName = "DailyVisitsAreaChart";

export default DailyVisitsAreaChart;
