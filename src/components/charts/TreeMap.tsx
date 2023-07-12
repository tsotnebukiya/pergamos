/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import MyChart from "./mychart";
type EChartsOption = echarts.EChartsOption;
import * as echarts from "echarts";

const TreeMap: React.FC = () => {
  const newOption: EChartsOption = {
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        tooltip: {
          position: "inside",
          show: true,

          trigger: "item",
          triggerOn: "mousemove",
          formatter: `{b}: {c}`,
        },
        breadcrumb: {
          show: false,
        },
        roam: false,
        nodeClick: false,
        width: "100%",
        height: "100%",
        type: "treemap",
        data: [
          {
            name: "JP Morgan",
            value: 423,
          },
          {
            name: "Goldman Sachs",
            value: 231,
          },
          {
            name: "Barclays",
            value: 200,
          },
          {
            name: "BNY Mellon",
            value: 167,
          },
          {
            name: "HSBC",
            value: 150,
          },
          {
            name: "Paribas",
            value: 100,
          },
          {
            name: "Bank Of America",
            value: 20,
          },
        ],
      },
    ],
  };
  return <MyChart newOption={newOption} height={300} />;
};

export default TreeMap;
