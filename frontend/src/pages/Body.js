import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setPatientData } from "../Slice/healthSlice";
import "./Body.css";
import SensorGraph from "./SensorGraph";

function Body() {
  const dispatch = useDispatch();

  const ESP_IP = "http://192.168.43.2";
  const BACKEND_URL = "http://127.0.0.1:5000/predict";

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    temperature: "",
    pulse: "",
    heartrate: "",
  });

  const [loadingKey, setLoadingKey] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchSensor = async (type) => {
    setLoadingKey(type);

    try {
      const url =
        type === "temp"
          ? `${ESP_IP}/?type=${type}&name=${encodeURIComponent(formData.name)}`
          : `${ESP_IP}/?type=${type}`;

      const response = await fetch(url);
      const data = await response.json();

      if (type === "temp" && data.temperature !== undefined)
        setFormData((prev) => ({ ...prev, temperature: data.temperature }));

      if (type === "pulse" && data.pulse !== undefined)
        setFormData((prev) => ({ ...prev, pulse: data.pulse }));

      if (type === "heartrate" && data.heartrate !== undefined)
        setFormData((prev) => ({ ...prev, heartrate: data.heartrate }));

    } catch (err) {
      console.log("Sensor error");
    }

    setLoadingKey(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: Number(formData.age),
          bp: Number(formData.pulse),
          sp: Number(formData.heartrate),
          gender: formData.gender,
          temperature: Number(formData.temperature),
        }),
      });

      const data = await response.json();

      dispatch(setPatientData({ ...formData, prediction: data.prediction }));
      setResult(data);

      setFormData((prev) => ({
        ...prev,
        name: "",
        age: "",
      }));

    } catch {
      setResult({ error: "Backend error" });
    }

    setLoadingSubmit(false);
  };

  const iconList = [1,2,3,4,5,1,2,3,4,5];

  return (
  <div className="body-container">

    <div className="medical-icons">
      {iconList.map((n,i)=>(
        <img key={i} src={`/img/icons/i${n}.png`} alt="icon"/>
      ))}
    </div>

    <div className="main-wrapper">

      {/* LEFT + RIGHT */}
      <div className="two-column-layout">

        {/* LEFT SIDE FORM */}
        <form className="health-form left-form" onSubmit={handleSubmit}>
          <h2 className="form-title">🩺 Health Monitor</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
          />

          <div className="gender-buttons">
            {["Male","Female"].map(g=>(
              <button
                type="button"
                key={g}
                className={formData.gender===g?"active-gender":""}
                onClick={()=>setFormData({...formData,gender:g})}>
                {g}
              </button>
            ))}
          </div>

          <div className="sensor-row">
            🌡 Temp: {formData.temperature || "--"}
            <button type="button" onClick={()=>fetchSensor("temp")}>
              {loadingKey==="temp"?"⏳":"Read"}
            </button>
          </div>

          <div className="sensor-row">
            💓 Pulse: {formData.pulse || "--"}
            <button type="button" onClick={()=>fetchSensor("pulse")}>
              {loadingKey==="pulse"?"⏳":"Read"}
            </button>
          </div>

          <div className="sensor-row">
            ❤️ HR: {formData.heartrate || "--"}
            <button type="button" onClick={()=>fetchSensor("heartrate")}>
              {loadingKey==="heartrate"?"⏳":"Read"}
            </button>
          </div>
        </form>

    
        <div className="right-graphs">
          <SensorGraph type="temperature" value={formData.temperature}/>
          <SensorGraph type="pulse" value={formData.pulse}/>
          <SensorGraph type="heartrate" value={formData.heartrate}/>
        </div>

      </div>

      <div className="submit-center">
        <button
          className="submit-btn center-btn"
          onClick={handleSubmit}
          disabled={loadingSubmit}
        >
          {loadingSubmit ? "⏳ Checking..." : "Describe Our Health"}
        </button>
      </div>

      {result && (
        <div className="result-card">
          {result.error ? (
            <p>⚠ {result.error}</p>
          ) : (
            <>
              <h3>
                {result.prediction === "Normal"
                  ? "✅ Normal"
                  : "⚠ Attention Needed"}
              </h3>
              <p>Accuracy: {result.accuracy}%</p>
            </>
          )}
        </div>
      )}

    </div>
  </div>
);
}

export default Body;