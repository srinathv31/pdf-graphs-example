import React from "react";
import {
  View,
  Text,
  Svg,
  Path,
  Circle,
  G,
  Rect,
  Line as SVGLine,
} from "@react-pdf/renderer";
import { getChartColors } from "../charts/chartUtils";

// Dashboard-style chart data structure
export interface DashboardChartSeries {
  name: string;
  data: number[];
  color: string;
}
export interface DashboardChartData {
  categories: string[];
  series: DashboardChartSeries[];
}
interface PDFChartImageProps {
  type: "line" | "bar" | "pie" | "area";
  data: DashboardChartData;
  width: number;
  height: number;
  showGrid?: boolean;
  showAxis?: boolean;
  showLegend?: boolean;
}

// Type alias for chart data objects (numbers, strings, or undefined)
type ChartDataObject = Record<string, number | string | undefined>;

// Utility to convert dashboard chart data to flat array for internal use
function convertDashboardDataToFlat(
  data: DashboardChartData
): ChartDataObject[] {
  return data.categories.map((category, index) => {
    const dataPoint: ChartDataObject = { name: category };
    data.series.forEach((series) => {
      dataPoint[series.name] = series.data[index];
    });
    return dataPoint;
  });
}

const PDFChartImage = ({
  type,
  data,
  width,
  height,
  showGrid = false,
  showAxis = false,
  showLegend = false,
}: PDFChartImageProps) => {
  // Use the first series' color for single-series charts, or all series' colors for multi-series
  const chartColors = data.series.map((s) => getChartColors(s.color)[0]);
  const processedData: ChartDataObject[] = convertDashboardDataToFlat(data);
  // For multi-series, use series names as dataKeys
  const dataKeys = data.series.map((s) => s.name);

  // Calculate dimensions
  const padding = {
    top: 15,
    right: 15,
    bottom: showLegend ? 40 : 25,
    left: showAxis ? 30 : 15,
  };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Find min and max values for scaling
  let maxValue = 0;
  let minValue = Number.MAX_SAFE_INTEGER;

  if (processedData.length > 0) {
    processedData.forEach((item) => {
      Object.values(item).forEach((valueRaw) => {
        const value =
          typeof valueRaw === "number" ? valueRaw : Number(valueRaw) || 0;
        maxValue = Math.max(maxValue, value);
        minValue = Math.min(minValue, value);
      });
    });
  }

  // Ensure we have reasonable min/max values
  if (minValue === Number.MAX_SAFE_INTEGER) minValue = 0;
  if (maxValue === 0) maxValue = 100;

  // Give some padding to min/max for aesthetics
  const valueRange = maxValue - minValue;
  minValue = Math.max(0, minValue - valueRange * 0.1);
  maxValue = maxValue + valueRange * 0.1;

  // Scale a value to fit in the graph height
  const scaleY = (value: number) => {
    return (
      graphHeight -
      ((value - minValue) / (maxValue - minValue || 1)) * graphHeight
    );
  };

  // Render grid lines if requested
  const renderGridLines = () => {
    if (!showGrid) return null;

    const gridLines = [];
    // Horizontal grid lines only, with strokeDasharray to match dashboard
    const gridLineCount = 5;
    for (let i = 0; i <= gridLineCount; i++) {
      const y = padding.top + (graphHeight / gridLineCount) * i;
      gridLines.push(
        <SVGLine
          key={`h-grid-${i}`}
          x1={padding.left}
          y1={y}
          x2={width - padding.right}
          y2={y}
          stroke="#e2e8f0"
          strokeWidth={0.5}
          strokeDasharray="3 3"
        />
      );
      // Add y-axis value labels if showing axes
      if (showAxis && i < gridLineCount) {
        const value = maxValue - (i / gridLineCount) * (maxValue - minValue);
        gridLines.push(
          <Text
            key={`y-label-${i}`}
            x={padding.left - 25}
            y={y + 2}
            style={{ fontSize: 8, textAlign: "right", color: "#666666" }}
          >
            {Math.round(value).toString()}
          </Text>
        );
      }
    }
    // X-axis labels (no vertical grid lines)
    if (type !== "pie" && processedData.length > 1 && showAxis) {
      const step = graphWidth / (processedData.length - 1);
      for (let i = 0; i < processedData.length; i++) {
        const x = padding.left + i * step;
        if (i % Math.max(1, Math.floor(processedData.length / 10)) === 0) {
          gridLines.push(
            <Text
              key={`x-label-${i}`}
              x={x - 10}
              y={padding.top + graphHeight + 10}
              style={{ fontSize: 8, color: "#666666" }}
            >
              {processedData[i]?.name?.toString().substring(0, 4)}
            </Text>
          );
        }
      }
    }

    return gridLines;
  };

  // Render legend
  const renderLegend = () => {
    if (!showLegend) return null;

    const keys = dataKeys;
    const legendItems: React.ReactNode[] = [];
    const itemWidth = 90;
    const startX = width / 2 - (keys.length * itemWidth) / 2;

    keys.forEach((key, index) => {
      legendItems.push(
        <G key={`legend-${index}`}>
          <Rect
            x={startX + index * itemWidth}
            y={height - 18}
            width={12}
            height={12}
            fill={chartColors[index % chartColors.length]}
            rx={3}
            ry={3}
          />
          <Text
            x={startX + index * itemWidth + 18}
            y={height - 8}
            style={{ fontSize: 10, color: "#666666", fontWeight: 600 }}
          >
            {data.series[index]?.name || `Series ${index + 1}`}
          </Text>
        </G>
      );
    });

    return legendItems;
  };

  // Render appropriate chart based on type
  const renderChart = () => {
    switch (type) {
      case "line":
        return renderLineChart();
      case "bar":
        return renderBarChart();
      case "pie":
        return renderPieChart();
      case "area":
        return renderAreaChart();
      default:
        return null;
    }
  };

  // Line chart rendering
  const renderLineChart = () => {
    const keys = dataKeys;
    if (processedData.length < 2) return null;

    const segmentWidth = graphWidth / (processedData.length - 1);

    return keys.map((key, seriesIndex) => {
      let pathData = "";
      const points: { x: number; y: number; value: number }[] = [];

      processedData.forEach((item, index) => {
        const x = padding.left + index * segmentWidth;
        const valueRaw = item[key];
        const value =
          typeof valueRaw === "number" ? valueRaw : Number(valueRaw) || 0;
        const y = padding.top + scaleY(value);

        if (index === 0) {
          pathData += `M${x},${y}`;
        } else {
          pathData += ` L${x},${y}`;
        }

        points.push({ x, y, value });
      });

      return (
        <G key={`line-series-${seriesIndex}`}>
          <Path
            d={pathData}
            stroke={chartColors[seriesIndex % chartColors.length]}
            strokeWidth={1.5}
            fill="none"
          />

          {/* Add data points */}
          {points.map((point, pointIndex) => (
            <Circle
              key={`point-${seriesIndex}-${pointIndex}`}
              cx={point.x}
              cy={point.y}
              r={1.5}
              fill={chartColors[seriesIndex % chartColors.length]}
              stroke="white"
              strokeWidth={0.5}
            />
          ))}
        </G>
      );
    });
  };

  // Bar chart rendering
  const renderBarChart = () => {
    if (processedData.length === 0) return null;

    const keys = dataKeys;
    // Match dashboard bar size and spacing
    const barSize = 30;
    const groupWidth = barSize * keys.length;
    const barSpacing =
      (graphWidth - processedData.length * groupWidth) /
      (processedData.length + 1);
    const bars: React.ReactNode[] = [];

    processedData.forEach((item, itemIndex) => {
      keys.forEach((key, keyIndex) => {
        const valueRaw = item[key];
        const value =
          typeof valueRaw === "number" ? valueRaw : Number(valueRaw) || 0;
        const barHeight =
          ((value - minValue) / (maxValue - minValue || 1)) * graphHeight;

        // Calculate x position: left padding + spacing + group offset + bar offset
        const x =
          padding.left +
          barSpacing * (itemIndex + 1) +
          itemIndex * groupWidth +
          keyIndex * barSize;
        const y = padding.top + graphHeight - barHeight;

        bars.push(
          <Rect
            key={`bar-${itemIndex}-${keyIndex}`}
            x={x}
            y={y}
            width={barSize}
            height={barHeight}
            fill={chartColors[keyIndex % chartColors.length]}
            rx={4}
            ry={4}
          />
        );
      });
    });

    return bars;
  };

  // Pie chart rendering
  const renderPieChart = () => {
    if (processedData.length === 0) return null;

    const centerX = width / 2;
    const centerY = padding.top + graphHeight / 2;
    const radius = Math.min(graphWidth, graphHeight) / 2.5;

    let total = 0;
    const key = dataKeys[0];

    processedData.forEach((item) => {
      const valueRaw = item[key];
      const value =
        typeof valueRaw === "number" ? valueRaw : Number(valueRaw) || 0;
      total += value;
    });

    if (total === 0) total = 1; // Avoid division by zero

    let startAngle = 0;
    const slices: React.ReactNode[] = [];
    const pieLabels: React.ReactNode[] = [];

    processedData.forEach((item, index) => {
      const valueRaw = item[key];
      const value =
        typeof valueRaw === "number" ? valueRaw : Number(valueRaw) || 0;
      const sliceAngle = (value / total) * 360;
      const endAngle = startAngle + sliceAngle;

      // Convert angles to radians
      const startRad = ((startAngle - 90) * Math.PI) / 180;
      const endRad = ((endAngle - 90) * Math.PI) / 180;
      const midRad = (startRad + endRad) / 2;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      // Create path for arc
      const largeArcFlag = sliceAngle > 180 ? 1 : 0;
      const pathData = `
        M ${centerX} ${centerY}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
      `;

      slices.push(
        <Path
          key={`slice-${index}`}
          d={pathData}
          fill={chartColors[index % chartColors.length]}
        />
      );

      // Add percentage label for slices big enough
      if (sliceAngle > 20) {
        const labelRadius = radius * 0.7;
        const labelX = centerX + labelRadius * Math.cos(midRad);
        const labelY = centerY + labelRadius * Math.sin(midRad);

        pieLabels.push(
          <Text
            key={`pie-label-${index}`}
            x={labelX - 8}
            y={labelY + 2}
            style={{ fontSize: 8, fill: "white", fontWeight: "bold" }}
          >
            {`${Math.round((value / total) * 100)}%`}
          </Text>
        );
      }

      startAngle = endAngle;
    });

    return (
      <G>
        {slices}
        {pieLabels}
      </G>
    );
  };

  // Area chart rendering
  const renderAreaChart = () => {
    const keys = dataKeys;
    if (processedData.length < 2) return null;

    return keys.map((key, seriesIndex) => {
      const segmentWidth = graphWidth / (processedData.length - 1);

      let pathData = "";
      processedData.forEach((item, index) => {
        const x = padding.left + index * segmentWidth;
        const valueRaw = item[key];
        const value =
          typeof valueRaw === "number" ? valueRaw : Number(valueRaw) || 0;
        const y = padding.top + scaleY(value);

        if (index === 0) {
          pathData += `M${x},${y}`;
        } else {
          pathData += ` L${x},${y}`;
        }
      });

      // Complete the path by drawing down to the bottom and back to the start
      const startX = padding.left;
      const endX = padding.left + (processedData.length - 1) * segmentWidth;
      const bottomY = padding.top + graphHeight;
      pathData += ` L${endX},${bottomY} L${startX},${bottomY} Z`;

      return (
        <G key={`area-series-${seriesIndex}`}>
          <Path
            d={pathData}
            fill={chartColors[seriesIndex % chartColors.length]}
            fillOpacity={0.3}
            stroke={chartColors[seriesIndex % chartColors.length]}
            strokeWidth={1}
          />
        </G>
      );
    });
  };

  // Main render function
  return (
    <View
      style={{
        width,
        height,
        border: "1px solid #e2e8f0",
        borderRadius: 4,
        padding: 2,
        position: "relative",
      }}
    >
      <Svg width={width - 4} height={height - 4}>
        {renderGridLines()}
        {renderChart()}
        {renderLegend()}

        {/* Draw x and y axes if requested */}
        {showAxis && (
          <G>
            <SVGLine
              x1={padding.left}
              y1={padding.top + graphHeight}
              x2={width - padding.right}
              y2={padding.top + graphHeight}
              stroke="#a0aec0"
              strokeWidth={1}
            />
            <SVGLine
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={padding.top + graphHeight}
              stroke="#a0aec0"
              strokeWidth={1}
            />
          </G>
        )}
      </Svg>
    </View>
  );
};

export default PDFChartImage;
