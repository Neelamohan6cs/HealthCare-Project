import React from "react";

export default function LoadingSpinner() {
  return (
    <div style={overlayStyle}>
      <div style={spinnerStyle}></div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(255,255,255,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const spinnerStyle = {
  width: "60px",
  height: "60px",
  border: "6px solid #e0e0e0",
  borderTop: "6px solid #43a047",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};