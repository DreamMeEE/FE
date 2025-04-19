import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

interface SleepDonutChartProps {
  sleepPercentage?: number;
  satisfactionPercentage?: number;
  height?: number;
  width?: number;
}

const RadialChart: React.FC<SleepDonutChartProps> = ({
  sleepPercentage = 5,
  satisfactionPercentage = 50,
  height = 50,
  width = 50,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ApexCharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Cleanup previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const options = {
        // @desc 값이 0이라면 아예 안 보이게
        colors: [
          sleepPercentage !== 0 ? "#6BE901" : "rgba(105, 233, 1, 0)",
          satisfactionPercentage !== 0 ? "#0F81FE" : "rgba(15, 131, 254, 0)",
        ],

        stroke: {
          lineCap: "round",
        },
        chart: {
          height: height,
          width: width,
          type: "radialBar",
          sparkline: {
            enabled: true,
          },
          parentHeightOffset: 0,
          toolbar: {
            show: false,
          },
        },
        series: [sleepPercentage, satisfactionPercentage],
        plotOptions: {
          radialBar: {
            width: "100%",
            inverseOrder: true,
            track: {
              margin: 0,
              background: ["rgba(15, 131, 254, 0.2)", "rgba(105, 233, 1, 0.2)"],
              dropShadow: {
                enabled: false,
              },
            },
            hollow: {
              margin: 0,
              size: "10%",
            },
            dataLabels: {
              show: false,
              name: {
                fontSize: "14px",
                color: "#333",
                offsetY: 10,
              },
              value: {
                fontSize: "18px",
                formatter: function (val: number) {
                  return val > 0 ? val + "%" : "0%";
                },
              },
              total: {
                show: false,
                label: "총점",
                formatter: function () {
                  // Calculate average of non-zero values
                  const values = [sleepPercentage, satisfactionPercentage];
                  const nonZeroValues = values.filter((val) => val > 0);
                  if (nonZeroValues.length === 0) return "0%";

                  const sum = nonZeroValues.reduce((acc, val) => acc + val, 0);
                  return Math.round(sum / nonZeroValues.length) + "%";
                },
              },
            },
          },
        },
      };

      chartInstance.current = new ApexCharts(chartRef.current, options);
      chartInstance.current.render();
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [sleepPercentage, satisfactionPercentage]);

  return <div ref={chartRef} style={{ display: "inline-block" }}></div>;
};

export default RadialChart;
