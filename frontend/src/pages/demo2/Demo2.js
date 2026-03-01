import { useState } from "react";
import "./Demo.css";
import SensorGraph from "../SensorGraph";
import LoadingSpinner from "./loding/LoadingSpinner";
import HealthAdviceButton from "./HealthAdviceButton";

import { db } from "../../firebase";
import { ref, push } from "firebase/database";

const ESP_IP = "http://192.168.43.2";

export default function Demo2() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male"
  });

  const [sensors, setSensors] = useState({
    temperature: "",
    pulse: "",
    heartrate: ""
  });

  const [activeGraphs, setActiveGraphs] = useState({
    temperature: false,
    pulse: false,
    heartrate: false
  });

  const [result, setResult] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [loadingKey, setLoadingKey] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const fetchSensor = async (type) => {
    setLoadingKey(type);

    try {
      const url =
        type === "temp"
          ? `${ESP_IP}/?type=${type}&name=${encodeURIComponent(form.name)}`
          : `${ESP_IP}/?type=${type}`;

      const res = await fetch(url);
      const data = await res.json();

      if (type === "temp" && data.temperature !== undefined) {
        setSensors((s) => ({ ...s, temperature: data.temperature }));
        setActiveGraphs((g) => ({ ...g, temperature: true }));
      }

      if (type === "pulse" && data.pulse !== undefined) {
        setSensors((s) => ({ ...s, pulse: data.pulse }));
        setActiveGraphs((g) => ({ ...g, pulse: true }));
      }

      if (type === "heartrate" && data.heartrate !== undefined) {
        setSensors((s) => ({ ...s, heartrate: data.heartrate }));
        setActiveGraphs((g) => ({ ...g, heartrate: true }));
      }
    } catch {
      alert("⚠ Failed to fetch from NodeMCU");
    }

    setLoadingKey(null);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.age || !sensors.temperature) {
      alert("Please fill Name, Age and get Temperature first.");
      return;
    }

    setFormLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          age: Number(form.age),
          gender: form.gender,
          temperature: Number(sensors.temperature),
          pulse: sensors.pulse ? Number(sensors.pulse) : null,
          heartrate: sensors.heartrate ? Number(sensors.heartrate) : null,
        }),
      });

      const data = await res.json();
      setResult(data);

      await push(ref(db, "patients"), {
        name: form.name,
        age: Number(form.age),
        gender: form.gender,
        temperature: Number(sensors.temperature),
        pulse: sensors.pulse ? Number(sensors.pulse) : null,
        heartrate: sensors.heartrate ? Number(sensors.heartrate) : null,
        prediction: data.prediction || null,
        accuracy: data.accuracy || null,
        createdAt: new Date().toISOString()
      });

    } catch {
      setResult({ error: "Failed to connect to backend" });
    }

    setFormLoading(false);
  };

  return (
    <div className="body-container">

      <div className="medical-icons">
        <img src="/img/icons/i1.png" alt="icon1" />
        <img src="/img/icons/i2.png" alt="icon2" />
        <img src="/img/icons/i3.png" alt="icon3" />
        <img src="/img/icons/i4.png" alt="icon4" />
        <img src="/img/icons/i5.png" alt="icon5" />
        <img src="/img/icons/i1.png" alt="icon6" />
        <img src="/img/icons/i2.png" alt="icon7" />
        <img src="/img/icons/i3.png" alt="icon8" />
        <img src="/img/icons/i4.png" alt="icon9" />
        <img src="/img/icons/i5.png" alt="icon10" />
      </div>

      <div className="demo2-container">

        <div className="left-section">
          {activeGraphs.temperature && (
            <SensorGraph type="temperature" value={sensors.temperature} />
          )}
          {activeGraphs.heartrate && (
            <SensorGraph type="heartrate" value={sensors.heartrate} />
          )}
        </div>

        <div className="form-section">
          <form className="api-form-wrapper">

            <div className="form-title">🩺 Health Monitor</div>

            <div className="form-row">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label>Age</label>
              <input
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label>Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="step-box">
              <div className="step-header">Sensor Readings</div>

              <div className="sensor-row">
                <div>
                  🌡 Temp:
                  <span className="reading-value">
                    {sensors.temperature || " — "}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => fetchSensor("temp")}
                  disabled={loadingKey === "temp"}
                >
                  {loadingKey === "temp" ? <LoadingSpinner /> : "Read"}
                </button>
              </div>

              <div className="sensor-row">
                <div>
                  💓 Pulse:
                  <span className="reading-value">
                    {sensors.pulse || " — "}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => fetchSensor("pulse")}
                  disabled={loadingKey === "pulse"}
                >
                  {loadingKey === "pulse" ? <LoadingSpinner /> : "Read"}
                </button>
              </div>

              <div className="sensor-row">
                <div>
                  ❤️ Heart:
                  <span className="reading-value">
                    {sensors.heartrate || " — "}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => fetchSensor("heartrate")}
                  disabled={loadingKey === "heartrate"}
                >
                  {loadingKey === "heartrate" ? <LoadingSpinner /> : "Read"}
                </button>
              </div>
            </div>

            <button
              type="button"
              className="submit-btn"
              onClick={handleSubmit}
              disabled={formLoading}
            >
              {formLoading ? <LoadingSpinner /> : "Submit & Predict"}
            </button>

        
            {result && !result.error && (
              <>
                <div className="result-card">
                  <div style={{ fontSize: "32px" }}>
                    {result.prediction === "Normal" ? "✅" : "⚠️"}
                  </div>
                  <div style={{ fontSize: "20px", fontWeight: "800" }}>
                    {result.prediction}
                  </div>
                  <div style={{ fontSize: "13px", marginTop: "6px" }}>
                    Accuracy: {result.accuracy}
                  </div>
                </div>

               
                <HealthAdviceButton form={form} sensors={sensors} />
              </>
            )}

     
            {result && result.error && (
              <div className="result-card" style={{ border: "2px solid red" }}>
                ⚠ {result.error}
              </div>
            )}

          </form>
        </div>

        <div className="right-section">
          {activeGraphs.pulse && (
            <SensorGraph type="pulse" value={sensors.pulse} />
          )}
        </div>

      </div>
    </div>
  );
}
    

    