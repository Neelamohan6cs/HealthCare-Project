import React from "react";

function Footer() {
  return (
    <div
      style={{
        width: "100%",
        padding: "18px 10px",
        background: "linear-gradient(135deg, #1b5e20, #43a047)",
        color: "#ffffff",
        textAlign: "center",
        fontFamily: "'Segoe UI', sans-serif",
        marginTop: "40px",
        boxShadow: "0 -4px 12px rgba(0,0,0,0.1)"
      }}
    >
      <div style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "0.5px" }}>
        © {new Date().getFullYear()} Health Monitor
      </div>

     

      <div style={{ marginTop: "10px", fontSize: "18px" }}>
        ❤️ Stay Healthy
      </div>
    </div>
  );
}

export default Footer;