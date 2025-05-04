import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";
function DualAxesChart({ dataChart, dataSetBar, dataSetLine, max, min }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (context.dataset.label === "Doanh thu") {
              return `${
                context.dataset.label
              }: ${context.raw.toLocaleString()} VND`;
            } else if (context.dataset.label === "Đơn hàng") {
              return `Số đơn hàng: ${context.raw.toLocaleString()}`;
            }
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        position: "right", // Chuyển trục Y sang phải
        min: min,
        max: max,

        ticks: {
          stepSize: 10,
        },
      },
      x: {
        ticks: {
          autoSkip: false,
        },
      },
    },
  };
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const myChartRef = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(myChartRef, {
      type: "dualAxes",
      data: {
        labels: dataChart,
        datasets: [
          {
            label: "Doanh thu",
            data: dataSetBar,
            type: "bar",
            backgroundColor: "#1c8fff",
            borderColor: "#1c8fff",
            borderWidth: 2,
            yAxisID: "y1",
            order: 2,
          },
          {
            label: "Đơn hàng",
            data: dataSetLine,
            type: "line",
            backgroundColor: "#f67b2b",
            borderColor: "#f67b2b",
            borderWidth: 2,
            order: 1,
          },
        ],
      },
      options: options,
    });
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);
  return (
    <div>
      <canvas id="myChart" ref={chartRef} />
    </div>
  );
}

export default DualAxesChart;
