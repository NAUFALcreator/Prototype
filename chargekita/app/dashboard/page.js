"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "../Navbar";

// Leaflet butuh objek "window", jadi harus dimuat khusus di sisi klien (ssr: false)
const StationMap = dynamic(() => import("./StationMap"), { ssr: false });

const STATUS_LABEL = {
  available: "Tersedia",
  in_use: "Digunakan",
  full: "Penuh",
  disrupted: "Gangguan",
};

export default function DashboardPage() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetch("/api/stations").then((r) => r.json()).then(setStations);
  }, []);

  const total = stations.length;
  const available = stations.filter((s) => s.status === "available").length;
  const disrupted = stations.filter((s) => s.status === "disrupted").length;

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="summary-row">
          <div className="summary-card"><div className="num">{total}</div><div className="label">Total Stasiun</div></div>
          <div className="summary-card"><div className="num">{available}</div><div className="label">Tersedia</div></div>
          <div className="summary-card" style={{ borderLeftColor: "#e74c3c" }}>
            <div className="num">{disrupted}</div><div className="label">Gangguan</div>
          </div>
        </div>

        <h2 style={{ color: "#0d47a1" }}>Peta Lokasi Stasiun</h2>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <StationMap stations={stations} />
        </div>

        <h2 style={{ color: "#0d47a1", marginTop: 24 }}>Daftar Stasiun</h2>
        <div className="grid">
          {stations.map((s) => (
            <div key={s.id} className="card station-card">
              <h3>{s.name}</h3>
              <div className="addr">{s.address}</div>
              <span className={`badge badge-${s.status}`}>{STATUS_LABEL[s.status] || s.status}</span>
            </div>
          ))}
          {stations.length === 0 && <p>Belum ada data stasiun.</p>}
        </div>
      </div>
    </div>
  );
}
