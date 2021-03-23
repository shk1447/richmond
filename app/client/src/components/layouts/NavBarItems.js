export default [
  {
    name: "Data",
    label: "DATA",
    icon: "mdi-database",
    panels: [
      { content: "origin-data-panel", params: {}, expand: true },
      { content: "data-table-panel", params: {}, expand: true },
    ],
  },
  {
    name: "Report",
    label: "REPORT",
    icon: "mdi-file-chart",
    panels: [
      { content: "report-panel", params: {}, expand: true },
      { content: "output-data-panel", params: {}, expand: false },
    ],
  },
]