import { useState } from "react";
import "./Main.css";
import SensorGraph from "../SensorGraph";
import LoadingSpinner from "./loding/LoadingSpinner";
import HealthAdviceButton from "./HealthAdviceButton";
import { useNavigate } from "react-router-dom";

import { db } from "../../firebase";
import { ref, push } from "firebase/database";

const IOT_API     = "http://192.168.43.2";   // ESP8266 IP
const BACKEND_API = "http://127.0.0.1:5000"; // Flask backend

export default function Main() {

  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", age: "", gender: "Male" });

  const [sensors, setSensors] = useState({
    temperature: "",
    pulse: "",
    spo2: ""
  });

  const [activeGraphs, setActiveGraphs] = useState({
    temperature: false,
    pulse: false,
    spo2: false
  });

  const [result, setResult] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [loadingKey, setLoadingKey] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ------------------------------
  // Fetch Sensors (FIXED API)
  // ------------------------------
  const fetchSensor = async (type) => {

    if (!IOT_API) return alert("IoT API not configured");

    setLoadingKey(type);

    try {

      // Build correct ESP URL
      let url = `${IOT_API}/?type=${type}`;

      if (form.name) {
        url += `&name=${form.name}`;
      }

      const res = await fetch(url);

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();

      if (type === "temp" && data.temperature !== undefined) {
        setSensors(s => ({ ...s, temperature: data.temperature }));
        setActiveGraphs(g => ({ ...g, temperature: true }));
      }

      if (type === "pulse" && data.pulse !== undefined) {
        setSensors(s => ({ ...s, pulse: data.pulse }));
        setActiveGraphs(g => ({ ...g, pulse: true }));
      }

      if (type === "spo2" && data.spo2 !== undefined) {
        setSensors(s => ({ ...s, spo2: data.spo2 }));
        setActiveGraphs(g => ({ ...g, spo2: true }));
      }

    } catch (error) {
      console.error(error);
      alert("⚠ Failed to fetch sensor data");
    }

    setLoadingKey(null);
  };

  // ------------------------------
  // Submit Prediction (No change)
  // ------------------------------
  const handleSubmit = async () => {

    if (!form.name || !form.age || !sensors.temperature)
      return alert("Fill Name, Age & Temp first");

    setFormLoading(true);
    setResult(null);

    try {

      const res = await fetch(`${BACKEND_API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          age: Number(form.age),
          gender: form.gender,
          temperature: Number(sensors.temperature),
          pulse: sensors.pulse ? Number(sensors.pulse) : null,
          spo2: sensors.spo2 ? Number(sensors.spo2) : null,
        }),
      });

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();
      setResult(data);

      await push(ref(db, "patients"), {
        name: form.name,
        age: Number(form.age),
        gender: form.gender,
        temperature: Number(sensors.temperature),
        pulse: sensors.pulse ? Number(sensors.pulse) : null,
        spo2: sensors.spo2 ? Number(sensors.spo2) : null,
        prediction: data.prediction || null,
        accuracy: data.accuracy || null,
        createdAt: new Date().toISOString(),
      });

    } catch {
      setResult({ error: "Failed to connect to backend" });
    }

    setFormLoading(false);
  };

  return (
    <div className="body-container">
      <div className="demo2-container">

        <button
          onClick={() => navigate("/table")}
          className="set-patient-btn"
        >
          Patients
        </button>

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

        <div className="left-section">
          {activeGraphs.temperature && (
            <SensorGraph type="temperature" value={sensors.temperature} />
          )}
          {activeGraphs.spo2 && (
            <SensorGraph type="spo2" value={sensors.spo2} />
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

              {["temp", "pulse", "spo2"].map(type => (
                <div className="sensor-row" key={type}>
                  <div>
                    {type === "temp" && "🌡 Temp"}
                    {type === "pulse" && "💓 Pulse"}
                    {type === "spo2" && "🩸 SpO2"} :
                    <span className="reading-value">
                      {sensors[
                        type === "temp" ? "temperature" : type
                      ] || " — "}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => fetchSensor(type)}
                    disabled={loadingKey === type}
                  >
                    {loadingKey === type
                      ? <LoadingSpinner />
                      : "Read"}
                  </button>
                </div>
              ))}
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
                  <div style={{ fontSize: "28px" }}>
                    {result.prediction === "Normal" ? "✅" : "⚠️"}
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {result.prediction}
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    Accuracy: {result.accuracy}
                  </div>
                </div>
                <HealthAdviceButton form={form} sensors={sensors} />
              </>
            )}

            {result && result.error && (
              <div
                className="result-card"
                style={{ border: "2px solid red" }}
              >
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