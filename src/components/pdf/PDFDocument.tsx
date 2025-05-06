import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { DashboardChartsPngs } from "./captureDashboardChartsToPng";

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
    width: 50,
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
    monthlySales: unknown;
    departmentSales: unknown;
    dailyVisits: unknown;
    customers: unknown;
  };
  chartPngs: DashboardChartsPngs;
}

const PDFDocument = ({
  title,
  description,
  data,
  chartPngs,
}: PDFDocumentProps) => (
  <Document>
    {/* First Page - Summary Cards and First Charts */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image
          src="/lovable-uploads/ac844856-c66a-4015-abc1-144fc68e43b2.png"
          style={styles.logo}
        />
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
                <Image
                  src={chartPngs.summaryCards[index]}
                  style={{ width: 110, height: 60 }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.largeCard}>
            <Text style={styles.cardTitle}>
              {(data.monthlySales as any).title}
            </Text>
            <View style={styles.chartContainer}>
              <Image
                src={chartPngs.monthlySales}
                style={{ width: 320, height: 170 }}
              />
            </View>
          </View>

          <View style={styles.mediumCard}>
            <Text style={styles.cardTitle}>
              {(data.departmentSales as any).title}
            </Text>
            <View style={styles.chartContainer}>
              <Image
                src={chartPngs.departmentSales}
                style={{ width: 180, height: 170 }}
              />
            </View>
          </View>
        </View>
      </View>

      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
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
            <Text style={styles.cardTitle}>
              {(data.dailyVisits as any).title}
            </Text>
            <View style={styles.chartContainer}>
              <Image
                src={chartPngs.dailyVisits}
                style={{ width: 220, height: 170 }}
              />
            </View>
          </View>

          <View style={styles.mediumCard}>
            <Text style={styles.cardTitle}>
              {(data.customers as any).title}
            </Text>
            <Text style={styles.cardValue}>
              {(data.customers as any).value}
            </Text>
            <View style={styles.chartContainer}>
              <Image
                src={chartPngs.customers}
                style={{ width: 220, height: 170 }}
              />
            </View>
          </View>
        </View>
      </View>

      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </Page>
  </Document>
);

export default PDFDocument;
