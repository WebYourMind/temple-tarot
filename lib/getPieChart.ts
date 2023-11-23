import { ArchetypeValues } from "lib/types";
import { getRelativePercentages } from "./utils";

const getPieChart = (scores: ArchetypeValues) => {
  const relativePercentages = getRelativePercentages(scores);

  const chartConfig = {
    type: "pie",
    data: {
      labels: ["Explorer", "Analyst", "Designer", "Optimizer", "Connector", "Nurturer", "Energizer", "Achiever"],
      datasets: [
        {
          data: relativePercentages,
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          color: "white",
          font: {
            weight: "bold",
          },
        },
      },
    },
  };

  let stringChartConfig = JSON.stringify(chartConfig);
  // Manually append the formatter function as a string
  const formatterFunctionString = `,"formatter": function(value) { return value + '%' }`;
  stringChartConfig = stringChartConfig.replace(/("datalabels"\s*:\s*\{[^}]*\})/, `$1${formatterFunctionString}`);
  const encodedChartConfig = encodeURIComponent(stringChartConfig);
  const chartUrl = `https://quickchart.io/chart?c=${encodedChartConfig}`;

  return `![Pie Chart](${chartUrl})`;
};

export default getPieChart;
