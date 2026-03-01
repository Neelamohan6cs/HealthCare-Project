import "./Load.css";

export default function LoadingSpinner() {
  return (
    <div className="spinner-overlay">
      <div className="spinner"></div>
      <div className="spinner-text">Analyzing Health Data...</div>
    </div>
  );
}