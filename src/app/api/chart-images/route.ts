import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderLineChart({ width, height, data, chartProps }: any) {
  return React.createElement(
    "svg",
    { width, height, xmlns: "http://www.w3.org/2000/svg" },
    React.createElement(
      "foreignObject",
      { width: "100%", height: "100%" },
      React.createElement(
        "div",
        { xmlns: "http://www.w3.org/1999/xhtml", style: { width, height } },

        React.createElement(
          LineChart as any,
          { width, height, data, ...chartProps },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          React.createElement(CartesianGrid as any, { strokeDasharray: "3 3" }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          React.createElement(XAxis as any, { dataKey: "name" }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          React.createElement(YAxis as any, null),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          React.createElement(Tooltip as any, null),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          React.createElement(Line as any, {
            type: "monotone",
            dataKey: "value",
            stroke: "#8884d8",
          })
        )
      )
    )
  );
}

export async function POST(req: NextRequest) {
  try {
    const {
      type,
      data,
      width = 600,
      height = 400,
      chartProps = {},
    } = await req.json();

    // Render the chart as SVG markup
    let svgString = "";
    if (type === "line") {
      const chartElement = renderLineChart({ width, height, data, chartProps });
      svgString = renderToStaticMarkup(chartElement);
    } else {
      return NextResponse.json(
        { error: "Unsupported chart type" },
        { status: 400 }
      );
    }

    // Draw SVG to canvas using node-canvas (requires svg2img or similar)
    // For now, return the SVG as base64 PNG fallback
    // TODO: Use svg2img or sharp to convert SVG to PNG
    const base64SVG = Buffer.from(svgString).toString("base64");
    const dataUrl = `data:image/svg+xml;base64,${base64SVG}`;

    return NextResponse.json({ image: dataUrl });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
