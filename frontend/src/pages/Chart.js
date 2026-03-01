import React from "react";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ChartComponent() {
  const patient = useSelector((state) => state.health.patientData);

  if (!patient) {
    return <h3 style={{ textAlign: "center" }}>No Data Available</h3>;
  }

  const data = {
    labels: ["Temperature", "Pulse", "Heart Rate"],
    datasets: [
      {
        label: "Patient Health Data",
        data: [
          Number(patient.temperature),
          Number(patient.pulse),
          Number(patient.heartrate),
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Health Data for ${patient.name}`,
      },
    },
  };

  return (
    <div style={{ width: "70%", margin: "40px auto" }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default ChartComponent;