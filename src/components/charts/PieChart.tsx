import MyChart from "./mychart";
type EChartsOption = echarts.EChartsOption;

const PieChart: React.FC = () => {
  const newOption: EChartsOption = {
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        width: "100%",
        name: "Access From",
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
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 735, name: "Direct" },
          { value: 580, name: "Email" },
          { value: 484, name: "Union Ads" },
          { value: 300, name: "Video Ads" },
        ],
      },
    ],
  };
  return <MyChart newOption={newOption} height={300} />;
};

export default PieChart;
