/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RouterOutputs } from "pergamos/utils/api";
import MyChart from "./mychart";
type EChartsOption = echarts.EChartsOption;
import * as echarts from "echarts";

type TreeMap = RouterOutputs["payments"]["dashboard"]["analytics"]["treemap"];

const TreeMap: React.FC<{ data: TreeMap }> = ({ data }) => {
  const totalValue = data.sortedBanks.reduce(
    (sum, bank) => sum + bank.value,
    0
  );

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
          formatter: (params) => {
            const value = params.value as number;
            const formattedValue = new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 0,
              style: "currency",
              currency: "USD",
            }).format(value);
            return `${params.name}: ${formattedValue}`;
          },
        },
        breadcrumb: {
          show: false,
        },
        label: {
          show: true,
          formatter: (params) => {
            const value = params.value as number;
            const percent = (value / totalValue) * 100;
            return `${params.name}: ${percent.toFixed(2)}%`;
          },
        },
        roam: false,
        nodeClick: false,
        width: "100%",
        height: "100%",
        type: "treemap",
        data: data.sortedBanks,
      },
    ],
  };
  return <MyChart newOption={newOption} height={300} />;
};

export default TreeMap;
