import { RouterOutputs } from "pergamos/utils/api";
import MyChart from "./mychart";
type EChartsOption = echarts.EChartsOption;

type PieChart = RouterOutputs["payments"]["dashboard"]["analytics"]["pieChart"];

const PieChart: React.FC<{ data: PieChart }> = ({ data }) => {
  const newOption: EChartsOption = {
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        width: "100%",
        name: "Citi Team",
        type: "pie",
        radius: ["20%", "90%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "inner",
          formatter: "{b}\n{d}%",
        },
        labelLine: {
          show: false,
        },
        data: data.cititeams,
      },
    ],
  };
  return <MyChart newOption={newOption} height={300} />;
};

export default PieChart;
