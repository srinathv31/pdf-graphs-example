import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import PDFChartImage, { DashboardChartData } from "./PDFChartImage";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  summaryCard: {
    width: "30%",
    margin: "0 5px 16px 5px",
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    boxSizing: "border-box",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  largeCard: {
    width: "63%",
    margin: "0 5px 16px 5px",
    padding: 18,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    boxSizing: "border-box",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  mediumCard: {
    width: "46%",
    margin: "0 5px 16px 5px",
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    boxSizing: "border-box",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 8,
  },
  chartContainer: {
    height: 170,
    marginTop: 12,
    marginBottom: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  smallChartContainer: {
    height: 70,
    marginTop: 8,
    marginBottom: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    // width: 50,
    height: 50,
    marginBottom: 10,
    alignSelf: "center",
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#666666",
  },
});

interface SummaryCardData {
  title: string;
  description: string;
  data: number[];
  color: string;
}

interface PDFDocumentProps {
  title: string;
  description: string;
  data: {
    summaryCards: SummaryCardData[];
    monthlySales: DashboardChartData & { title: string };
    departmentSales: {
      title: string;
      series: Array<{ name: string; value: number }>;
    };
    dailyVisits: DashboardChartData & { title: string };
    customers: DashboardChartData & { value: number; title: string };
  };
  chartImages?: {
    monthlyBar?: string;
    monthlyBarSize?: { width: number; height: number };
  };
}

const PDFDocument = ({
  title,
  description,
  data,
  chartImages,
}: PDFDocumentProps) => {
  // Calculate target size for the chart image
  const targetWidth = 320;
  let targetHeight = 170;
  if (
    chartImages?.monthlyBarSize?.width &&
    chartImages?.monthlyBarSize?.height
  ) {
    const aspectRatio =
      chartImages.monthlyBarSize.width / chartImages.monthlyBarSize.height;
    targetHeight = Math.round(targetWidth / aspectRatio);
  }

  return (
    <Document>
      {/* First Page - Summary Cards and First Charts */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src="/logo.png" style={styles.logo} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            {data.summaryCards.map((card, index) => (
              <View key={index} style={styles.summaryCard}>
                <Text style={styles.cardValue}>{card.title}</Text>
                <Text style={styles.cardDescription}>{card.description}</Text>
                <View style={styles.smallChartContainer}>
                  <PDFChartImage
                    type="line"
                    data={{
                      categories: card.data.map((_: number, idx: number) =>
                        idx.toString()
                      ),
                      series: [
                        {
                          name: card.title,
                          data: card.data,
                          color: card.color.includes(".")
                            ? card.color.split(".")[1]
                            : "blue",
                        },
                      ],
                    }}
                    width={110}
                    height={60}
                    showGrid={true}
                    showAxis={false}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <View style={{ ...styles.largeCard, width: "100%" }}>
              <Text style={styles.cardTitle}>{data.monthlySales.title}</Text>
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  margin: 0,
                }}
              >
                {/* Use the captured monthly bar chart image if available */}
                {chartImages?.monthlyBar ? (
                  <Image
                    src={chartImages.monthlyBar}
                    style={{
                      width: targetWidth,
                      height: targetHeight,
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  />
                ) : (
                  <PDFChartImage
                    type="bar"
                    data={data.monthlySales}
                    width={320}
                    height={170}
                    showGrid={true}
                    showAxis={true}
                  />
                )}
              </View>
            </View>

            <View style={styles.mediumCard}>
              <Text style={styles.cardTitle}>{data.departmentSales.title}</Text>
              <View style={styles.chartContainer}>
                <PDFChartImage
                  type="pie"
                  data={{
                    categories: data.departmentSales.series.map(
                      (item) => item.name
                    ),
                    series: [
                      {
                        name: data.departmentSales.title,
                        data: data.departmentSales.series.map(
                          (item) => item.value
                        ),
                        color: "teal",
                      },
                    ],
                  }}
                  width={180}
                  height={170}
                  showGrid={false}
                  showAxis={false}
                  showLegend={true}
                />
              </View>
            </View>
          </View>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </Page>

      {/* Second Page - Remaining Charts */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{title} - Continued</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.mediumCard}>
              <Text style={styles.cardTitle}>{data.dailyVisits.title}</Text>
              <View style={styles.chartContainer}>
                <PDFChartImage
                  type="area"
                  data={data.dailyVisits}
                  width={220}
                  height={170}
                  showGrid={true}
                  showAxis={true}
                />
              </View>
            </View>

            <View style={styles.mediumCard}>
              <Text style={styles.cardTitle}>{data.customers.title}</Text>
              <Text style={styles.cardValue}>{data.customers.value}</Text>
              <View style={styles.chartContainer}>
                <PDFChartImage
                  type="line"
                  data={data.customers}
                  width={220}
                  height={170}
                  showGrid={true}
                  showAxis={true}
                  showLegend={true}
                />
              </View>
            </View>
          </View>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
};

export default PDFDocument;
