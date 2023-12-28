import React from "react";
import Chart from "react-apexcharts";

const PieChart = ({ title, value }) => {
  const chartOptions = {
    colors: ["#0ba99a"],
    labels: [title],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
        },
      },
    },
  };

  const seriesData = [value];

  return (
    <div className="round__chart">
      <h3>{title}</h3>
      <Chart
        options={chartOptions}
        series={seriesData}
        type="donut"
        height={70}
      />
    </div>
  );
};

export default PieChart;
