import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { westerosTheme } from "./westeros";
type EChartsOption = echarts.EChartsOption;

echarts.registerTheme("westerosDefault", westerosTheme);

const MyChart: React.FC<{ newOption: EChartsOption; height: number }> = ({
  newOption,
  height,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<echarts.ECharts | null>(null);
  const [option, setOption] = useState<EChartsOption | null>(null);

  useEffect(() => {
    if (chartRef.current && !chart) {
      const myChart = echarts.init(chartRef.current, "westerosDefault"); // Specify the theme name when initializing the chart
      setChart(myChart);
    }
  }, [chart]);

  useEffect(() => {
    if (chart && option) {
      chart.setOption(option);
    }
  }, [chart, option]);

  useEffect(() => {
    setOption(newOption);
  }, []);

  return (
    <div
      id="main"
      ref={chartRef}
      style={{ width: "100%", height: `${height}px` }}
    />
  );
};

export default MyChart;
