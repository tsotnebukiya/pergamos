/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { RouterOutputs } from "pergamos/utils/api";
import MyChart from "./mychart";
type EChartsOption = echarts.EChartsOption;
import * as echarts from "echarts";

type BarChart = RouterOutputs["payments"]["dashboard"]["analytics"]["barChart"];

const BarChart: React.FC<{ data: BarChart }> = ({ data }) => {
  const newOption: EChartsOption = {
    legend: {},
    tooltip: {},

    dataset: {
      source: data.purposeArray,
    },
    xAxis: [{ type: "category", gridIndex: 0 }],
    yAxis: [{ gridIndex: 0, min: 0 }],
    series: [
      { type: "bar", seriesLayoutBy: "row" },
      { type: "bar", seriesLayoutBy: "row" },
      { type: "bar", seriesLayoutBy: "row" },
      { type: "bar", seriesLayoutBy: "row" },
    ],
  };
  return <MyChart newOption={newOption} height={320} />;
};

export default BarChart;
