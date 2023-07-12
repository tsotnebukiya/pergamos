/* eslint-disable @typescript-eslint/restrict-plus-operands */
import MyChart from "./mychart";
type EChartsOption = echarts.EChartsOption;
import * as echarts from "echarts";

function getVirtualData(year: string) {
  const date = +echarts.time.parse(year + "-01-01");
  const end = +echarts.time.parse(+year + 1 + "-01-01");
  const dayTime = 3600 * 24 * 1000;
  const data: [string, number][] = [];
  for (let time = date; time < end; time += dayTime) {
    data.push([
      echarts.time.format(time, "{yyyy}-{MM}-{dd}", false),
      Math.floor(Math.random() * 1000),
    ]);
  }
  return data;
}

const HeatMap: React.FC = () => {
  const newOption: EChartsOption = {
    legend: {},
    tooltip: {},
    dataset: {
      source: [
        ["product", "2012", "2013", "2014", "2015"],
        ["Matcha Latte", 41.1, 30.4, 65.1, 53.3],
        ["Milk Tea", 86.5, 92.1, 85.7, 83.1],
        ["Cheese Cocoa", 24.1, 67.2, 79.5, 86.4],
      ],
    },
    xAxis: [{ type: "category", gridIndex: 0 }],
    yAxis: [{ gridIndex: 0 }],
    grid: [{}],
    series: [
      { type: "bar", seriesLayoutBy: "row" },
      { type: "bar", seriesLayoutBy: "row" },
      { type: "bar", seriesLayoutBy: "row" },
    ],
  };
  return <MyChart newOption={newOption} height={350} />;
};

export default HeatMap;
