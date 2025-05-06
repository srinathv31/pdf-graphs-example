// Shared chart utilities for color palette and helpers

// Color palette used in dashboard and PDF charts
export const chartColorMap: Record<string, string> = {
  blue: "#4299E1",
  indigo: "#7366BD",
  cyan: "#3ABAB4",
  teal: "#0BC5C5",
  green: "#48BB78",
  yellow: "#F6AD55",
  orange: "#ED8936",
  red: "#F56565",
  pink: "#ED64A6",
  purple: "#805AD5",
};

// Utility to get color from palette or fallback to provided value
export function getChartColor(color: string): string {
  return chartColorMap[color] || color;
}

// Utility to get an array of colors from palette or fallback
export function getChartColors(colors: string | string[]): string[] {
  if (Array.isArray(colors)) {
    return colors.map((c) => getChartColor(c));
  }
  return [getChartColor(colors)];
}
