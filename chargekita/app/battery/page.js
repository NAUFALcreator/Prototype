"use client";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";

export default function BatteryPage() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetch("/api/battery").then((r) => r.json()).then(setStations);
  }, []);

  const totalAvailable = stations.reduce((sum, s) => sum + s.battery_available, 0);
  const totalCapacity = stations.reduce((sum, s) => sum + s.battery_total, 0);

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="summary-row">
          <div className="summary-card">
            <div className="num">{totalAvailable}/{totalCapacity}</div>
            <div className="label">Total Baterai Tersedia</div>
          </div>
        </div>

        <h2 style={{ color: "#0d47a1" }}>Monitoring Baterai per Stasiun</h2>
        <div className="grid">
          {stations.map((s) => {
            const pct = s.battery_total ? Math.round((s.battery_available / s.battery_total) * 100) : 0;
            return (
              <div key={s.id} className="card station-card">
                <h3>{s.name}</h3>
                <div className="addr">{s.address}</div>
                <div>{s.battery_available}/{s.battery_total} tersedia</div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
          {stations.length === 0 && <p>Belum ada stasiun battery swap.</p>}
        </div>
      </div>
    </div>
  );
}
