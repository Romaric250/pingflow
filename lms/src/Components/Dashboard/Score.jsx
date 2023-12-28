import React from "react";
import Chart from "react-apexcharts";

const Scores = ({ score, project_name }) => {
  const chartOptions = {
    chart: {
      height: 80,
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "80%",
        colors: {
          backgroundBarColors: ["#f2f2f2"],
          backgroundBarOpacity: 1,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [score],
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    fill: {
      colors: ["#00bfa5"],
    },
    tooltip: {
      enabled: false,
    },
  };

  const seriesData = [
    {
      data: [score],
    },
  ];

  return (
    <div>
      <div className="score__detail">
        <h5>{project_name}</h5>
        <h6>{score}%</h6>
      </div>
      <Chart
        options={chartOptions}
        series={seriesData}
        type="bar"
        height={50}
      />
    </div>
  );
};

export default Scores;
