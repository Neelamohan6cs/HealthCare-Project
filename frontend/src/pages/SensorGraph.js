import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import "./SensorGraph.css";

function generateWaveData(baseValue, variation, points = 20) {
  const data = [];

  for (let i = 0; i < points; i++) {
    data.push({
      name: i,
      val:
        Number(baseValue) +
        Math.sin(i * 0.5) * variation +
        (Math.random() * variation) / 2
    });
  }

  return data;
}

function SensorGraph({ type, value }) {
  if (!value) return null;

  let data = [];

  if (type === "temperature") {
    data = generateWaveData(value, 0.3);
  }

  if (type === "pulse") {
    data = generateWaveData(value, 5);
  }

  if (type === "spo2") {
    data = generateWaveData(value, 1.5); 
  }

  return (
    <div className="graph-container">

   
      {type === "temperature" && (
        <>
          <h3>🌡 Body Temperature</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff4d4d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ff4d4d" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="name" hide />
              <YAxis domain={[34, 42]} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={(value) => `${value.toFixed(1)} °C`} />

              <Area
                type="monotone"
                dataKey="val"
                stroke="#ff4d4d"
                fillOpacity={1}
                fill="url(#colorTemp)"
                strokeWidth={3}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}

      
      {type === "pulse" && (
        <>
          <h3>💓 Pulse Rate (BPM)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <XAxis dataKey="name" hide />
              <YAxis domain={[40, 140]} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={(value) => `${Math.round(value)} BPM`} />

              <Line
                type="monotone"
                dataKey="val"
                stroke="#00ff99"
                strokeWidth={3}
                dot={false}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}

      
      {type === "spo2" && (
        <>
          <h3>🫀 SpO₂ (Oxygen Saturation %)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <XAxis dataKey="name" hide />
              <YAxis domain={[90, 100]} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={(value) => `${Math.round(value)} %`} />

              <Line
                type="monotone"
                dataKey="val"
                stroke="#2E7D32"
                strokeWidth={3}
                dot={false}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}

    </div>
  );
}

export default SensorGraph;