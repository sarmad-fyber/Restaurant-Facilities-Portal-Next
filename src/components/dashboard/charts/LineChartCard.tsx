"use client";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useRef, useEffect, useState } from "react";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const labels = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct"];
const values = [50, 30, 60, 35, 22, 41, 15, 30, 62, 55];

const LineChartCard = () => {
  const chartRef = useRef<any>(null);
  const [gradient, setGradient] = useState<string | CanvasGradient>("rgba(229,9,20,0.1)");

  // Generate gradient after canvas is mounted
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current.ctx;
      const gradientFill = chart.createLinearGradient(0, 0, 0, chartRef.current.height);
      gradientFill.addColorStop(0, "rgba(229,9,20,0.25)"); // light red top
      gradientFill.addColorStop(1, "rgba(229,9,20,0)"); // fade to transparent
      setGradient(gradientFill);
    }
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: "Reports",
        data: values,
        borderColor: "#e50914",
        backgroundColor: gradient,
        pointBackgroundColor: "#e50914",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
        tension: 0.4,
        fill: true, // enables gradient under the line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
        },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          color: "#666",
        },
        grid: {
          drawTicks: false,
          color: "#eee",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#e50914",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            return `${context.parsed.y} Reports`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4">
      <h2 className="text-lg font-bold text-sky-900 mb-4">Urgent Reports</h2>
      <div className="h-72">
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChartCard;
