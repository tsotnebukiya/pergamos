import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { westerosTheme, darkWesterosTheme } from "./westeros";
import { useTheme } from "next-themes";
type EChartsOption = echarts.EChartsOption;

echarts.registerTheme("westeros", westerosTheme);
echarts.registerTheme("westerosDark", darkWesterosTheme);

const MyChart: React.FC<{ newOption: EChartsOption; height: number }> = ({
  newOption,
  height,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<echarts.ECharts | null>(null);
  const [option, setOption] = useState<EChartsOption | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (chartRef.current && !chart) {
      const myChart = echarts.init(
        chartRef.current,
        `${resolvedTheme === "dark" ? "westerosDark" : "westeros"}`
      ); // Specify the theme name when initializing the chart
      setChart(myChart);
    }
  }, [chart, resolvedTheme]);
  useEffect(() => {
    if (chart && chartRef.current && resolvedTheme) {
      const themeName = `${
        resolvedTheme === "dark" ? "westerosDark" : "westeros"
      }`;
      chart.dispose(); // Dispose the previous chart instance
      const newChart = echarts.init(chartRef.current, themeName);
      setChart(newChart);
    }
  }, [resolvedTheme]);
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
