export const dashboardData = {
  summaryCards: [
    {
      title: "$424,652",
      description: "Sales",
      data: [30, 40, 20, 50, 30, 60, 40, 50, 35, 70],
      color: "chart.indigo",
    },
    {
      title: "$235,312",
      description: "Expenses",
      data: [40, 30, 20, 40, 50, 30, 60, 35, 25, 45],
      color: "chart.blue",
    },
    {
      title: "$135,965",
      description: "Profits",
      data: [20, 35, 45, 25, 35, 55, 30, 45, 60, 70],
      color: "chart.purple",
    },
  ],
  monthlySales: {
    title: "Monthly Sales",
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    series: [
      {
        name: "Clothing",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 52, 56, 60],
        color: "chart.teal",
      },
      {
        name: "Food Products",
        data: [35, 41, 36, 26, 45, 48, 52, 30, 41, 50, 58, 45],
        color: "chart.blue",
      },
    ],
  },
  departmentSales: {
    title: "Department Sales",
    series: [
      { name: "Clothing", value: 35, color: "chart.teal" },
      { name: "Food Products", value: 25, color: "chart.blue" },
      { name: "Electronics", value: 20, color: "chart.yellow" },
      { name: "Kitchen Utility", value: 15, color: "chart.orange" },
      { name: "Gardening", value: 5, color: "chart.purple" },
    ],
  },
  dailyVisits: {
    title: "Daily Visits Insights",
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    series: [
      {
        name: "Day Time",
        data: [3, 4, 8, 6, 9, 7, 3],
        color: "chart.green",
      },
      {
        name: "Night Time",
        data: [5, 6, 10, 8, 7, 5, 4],
        color: "chart.blue",
      },
    ],
  },
  customers: {
    title: "Customers",
    value: "168,215",
    series: [
      {
        name: "Day Time",
        data: [30, 40, 45, 50, 55, 60],
        color: "chart.cyan",
      },
      {
        name: "Night Time",
        data: [20, 25, 35, 45, 50, 55],
        color: "chart.blue",
      },
    ],
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  },
};
