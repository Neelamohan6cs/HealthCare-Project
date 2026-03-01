import { useState } from "react";

const GOOGLE_API_KEY = "AIzaSyBCsRFfXzvkZHbeeWYqQmU-vFpEcD-V7Ig";

export default function HealthAdviceButton({ form, sensors }) {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const getAdvice = async () => {
    setLoading(true);
    setAdvice("");

    try {
      const prompt = `
Patient Details:
Name: ${form.name}
Age: ${form.age}
Gender: ${form.gender}
Temperature: ${sensors.temperature}
Pulse: ${sensors.pulse}
Heart Rate: ${sensors.heartrate}

Give short doctor guidance in 4-5 lines.
Start with: "Hi ${form.name},"
End with simple advice.
Return response in paragraph format.
`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "API Error");
      }

      let text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ No advice generated";

      // ✅ Clean unwanted line breaks and format paragraph
      text = text.replace(/\n+/g, " ").trim();

      setAdvice(text);

    } catch (err) {
      console.error(err);
      setAdvice("⚠️ Failed to get guidance");
    }

    setLoading(false);
  };

  const clearAll = () => {
    setAdvice("");
  };

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <button
        onClick={getAdvice}
        disabled={loading}
        style={{
          padding: "10px 20px",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          backgroundColor: loading ? "#888" : "#007BFF",
        }}
      >
        {loading ? "Analyzing..." : "Get Guidance"}
      </button>

      {advice && (
        <div
          style={{
            marginTop: "15px",
            padding: "15px",
            borderRadius: "8px",
            fontSize: "15px",
            lineHeight: "1.6",
            textAlign: "left",
            maxWidth: "500px",
            marginInline: "auto"
          }}
        >
          {advice}
        </div>
      )}

      {advice && (
        <button
          onClick={clearAll}
          style={{
            marginTop: "15px",
            padding: "8px 16px",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            backgroundColor: "red",
          }}
        >
          🗑 Clear All
        </button>
      )}
    </div>
  );
}