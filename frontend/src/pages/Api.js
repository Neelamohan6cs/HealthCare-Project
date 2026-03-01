import { useState } from "react";

const ESP_IP = "http://192.168.43.2";

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "10px",
  border: "1.5px solid #e0e0e0",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
  transition: "border 0.2s",
};

const labelStyle = {
  fontWeight: "600",
  fontSize: "13px",
  color: "#555",
  marginBottom: "6px",
  display: "block",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const sectionStyle = {
  background: "#fff",
  borderRadius: "14px",
  padding: "20px 24px",
  marginBottom: "14px",
  border: "1.5px solid #f0f0f0",
  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
};

function SensorRow({ label, value, onFetch, loading }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 0",
      borderBottom: "1px solid #f5f5f5",
    }}>
      <div>
        <div style={{ fontWeight: "600", fontSize: "14px", color: "#333" }}>{label}</div>
        <div style={{
          fontSize: "18px",
          fontWeight: "700",
          color: value ? "#2e7d32" : "#bbb",
          marginTop: "2px"
        }}>
          {value || "—"}
        </div>
      </div>
      <button
        onClick={onFetch}
        disabled={loading}
        style={{
          padding: "9px 18px",
          background: loading ? "#e0e0e0" : "linear-gradient(135deg, #43a047, #66bb6a)",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontWeight: "700",
          fontSize: "13px",
          cursor: loading ? "not-allowed" : "pointer",
          letterSpacing: "0.3px",
          transition: "all 0.2s",
        }}
      >
        {loading ? "⏳" : "Get"}
      </button>
    </div>
  );
}

export default function Api() {
  const [form, setForm] = useState({ name: "", age: "", gender: "Male" });
  const [sensors, setSensors] = useState({ temperature: "", pulse: "", heartrate: "" });
  const [loadingKey, setLoadingKey] = useState(null);
  const [result, setResult] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const fetchSensor = async (type) => {
    setLoadingKey(type);
    try {
    
      const url = type === "temp"
        ? `${ESP_IP}/?type=${type}&name=${encodeURIComponent(form.name)}`
        : `${ESP_IP}/?type=${type}`;

      const res = await fetch(url);
      const data = await res.json();

      if (type === "temp" && data.temperature !== undefined)
        setSensors((s) => ({ ...s, temperature: data.temperature }));
      else if (type === "pulse" && data.pulse !== undefined)
        setSensors((s) => ({ ...s, pulse: data.pulse }));
      else if (type === "heartrate" && data.heartrate !== undefined)
        setSensors((s) => ({ ...s, heartrate: data.heartrate }));
    } catch {
      alert("⚠️ Failed to fetch from NodeMCU");
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
          name       : form.name,
          temperature: Number(sensors.temperature),
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Failed to connect to backend" });
    }
    setFormLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #e8f5e9 0%, #f3f8ff 100%)",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "40px 16px",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "38px" }}>🩺</div>
          <h1 style={{ margin: "6px 0 4px", fontSize: "24px", fontWeight: "800", color: "#1b5e20" }}>
            Health Monitor
          </h1>
          <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>
            Fill patient details and collect sensor readings
          </p>
        </div>

        {/* Step 1 — Name */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <div style={{ background: "#43a047", color: "#fff", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700" }}>1</div>
            <span style={{ fontWeight: "700", color: "#333" }}>Patient Name</span>
          </div>
          <label style={labelStyle}>Full Name</label>
          <input
            name="name"
            type="text"
            placeholder="Enter patient name"
            value={form.name}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <div style={{ background: "#43a047", color: "#fff", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700" }}>2</div>
            <span style={{ fontWeight: "700", color: "#333" }}>Age</span>
          </div>
          <label style={labelStyle}>Patient Age</label>
          <input
            name="age"
            type="number"
            placeholder="Enter age"
            value={form.age}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <div style={{ background: "#43a047", color: "#fff", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700" }}>3</div>
            <span style={{ fontWeight: "700", color: "#333" }}>Gender</span>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            {["Male", "Female"].map((g) => (
              <button
                key={g}
                onClick={() => setForm({ ...form, gender: g })}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "10px",
                  border: form.gender === g ? "2px solid #43a047" : "1.5px solid #e0e0e0",
                  background: form.gender === g ? "#e8f5e9" : "#fff",
                  fontWeight: "700",
                  fontSize: "14px",
                  color: form.gender === g ? "#2e7d32" : "#888",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {g === "Male" ? "👨 Male" : "👩 Female"}
              </button>
            ))}
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <div style={{ background: "#43a047", color: "#fff", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700" }}>4</div>
            <span style={{ fontWeight: "700", color: "#333" }}>Sensor Readings</span>
          </div>
          <p style={{ fontSize: "12px", color: "#aaa", margin: "0 0 8px" }}>Press Get to fetch from NodeMCU</p>

          <SensorRow
            label="🌡 Temperature (°C)"
            value={sensors.temperature ? `${sensors.temperature} °C` : ""}
            onFetch={() => fetchSensor("temp")}
            loading={loadingKey === "temp"}
          />
          <SensorRow
            label="💓 Pulse (BPM)"
            value={sensors.pulse ? `${sensors.pulse} BPM` : ""}
            onFetch={() => fetchSensor("pulse")}
            loading={loadingKey === "pulse"}
          />
          <SensorRow
            label="❤️ Heart Rate (BPM)"
            value={sensors.heartrate ? `${sensors.heartrate} BPM` : ""}
            onFetch={() => fetchSensor("heartrate")}
            loading={loadingKey === "heartrate"}
          />
        </div>

    
        <button
          onClick={handleSubmit}
          disabled={formLoading}
          style={{
            width: "100%",
            padding: "15px",
            background: formLoading ? "#ccc" : "linear-gradient(135deg, #1b5e20, #43a047)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "800",
            cursor: formLoading ? "not-allowed" : "pointer",
            letterSpacing: "0.5px",
            boxShadow: "0 4px 14px rgba(67,160,71,0.3)",
            marginBottom: "20px",
            transition: "all 0.2s",
          }}
        >
          {formLoading ? "⏳ Checking..." : "Submit & Predict"}
        </button>

        {/* Result */}
        {result && !result.error && (
          <div style={{
            padding: "20px",
            borderRadius: "14px",
            background: result.prediction === "Normal" ? "#e8f5e9" : "#ffebee",
            border: `2px solid ${result.prediction === "Normal" ? "#43a047" : "#e53935"}`,
            textAlign: "center",
          }}>
            <div style={{ fontSize: "32px" }}>{result.prediction === "Normal" ? "✅" : "⚠️"}</div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: result.prediction === "Normal" ? "#2e7d32" : "#c62828", marginTop: "6px" }}>
              {result.prediction === "Normal" ? "Normal" : "Not Normal"}
            </div>
            <div style={{ fontSize: "13px", color: "#777", marginTop: "6px" }}>
              Accuracy: {result.accuracy}
            </div>
          </div>
        )}

        {result && result.error && (
          <div style={{ padding: "14px", background: "#ffebee", borderRadius: "10px", color: "#c62828", fontWeight: "600", textAlign: "center" }}>
            ⚠️ {result.error}
          </div>
        )}

      </div>
    </div>
  );
}
