import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { ref, onValue, remove } from "firebase/database";
import "./table.css";

export default function DataTable() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const patientsRef = ref(db, "patients");

    onValue(patientsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const formatted = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

       
        formatted.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setPatients(formatted);
      } else {
        setPatients([]);
      }
    });
  }, []);


  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    const patientRef = ref(db, `patients/${id}`);
    remove(patientRef);
  };

  if (patients.length === 0) {
    return <h3 style={{ textAlign: "center" }}>No Data Available</h3>;
  }

  return (
    <div className="table-container">
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

      <h2>Health Records</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Pulse</th>
            <th>SPO2</th>
            <th>Temperature</th>
            <th>Prediction</th>
            <th>Accuracy</th>
            <th>Date&Time</th>
            <th>Action</th> 
          </tr>
        </thead>

        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td className="name">{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.gender}</td>
              <td>{patient.pulse}</td>
              <td>{patient.spo2}</td>
              <td>{patient.temperature}</td>
              <td>{patient.prediction}</td>
              <td>{patient.accuracy}</td>
              <td>
                {patient.createdAt
                  ? new Date(patient.createdAt).toLocaleString()
                  : "-"}
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(patient.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}