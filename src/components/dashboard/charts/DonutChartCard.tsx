"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ["Item A", "Item B", "Item C"],
  datasets: [
    {
      data: [20, 30, 30], // values (you can adjust)
      backgroundColor: ["#2563eb", "#facc15", "#f87171"], // blue, yellow, red
      borderWidth: 0,
      borderRadius: 30, // rounded ends
      cutout: "75%", // donut thickness
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }, // disable default tooltip
  },
};

const DonutChartCard = () => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4">
      <h2 className="text-lg font-bold text-sky-900 mb-4">Analytics</h2>

      {/* Chart Container */}
      <div className="relative h-64 flex items-center justify-center">
        <Doughnut data={data} options={options} />

        {/* Center Text */}
        <div className="absolute text-center">
          <p className="text-2xl font-bold text-sky-900">80%</p>
          <p className="text-gray-500 text-sm">Text placeholder</p>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600"></span>
          <span className="text-gray-600 text-sm">Item A</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="text-gray-600 text-sm">Item B</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400"></span>
          <span className="text-gray-600 text-sm">Item C</span>
        </div>
      </div>
    </div>
  );
};

export default DonutChartCard;
