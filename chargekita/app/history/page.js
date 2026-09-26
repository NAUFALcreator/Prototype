"use client";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";

export default function HistoryPage() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch("/api/activities").then((r) => r.json()).then(setActivities);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2 style={{ color: "#0d47a1" }}>Riwayat Aktivitas</h2>
        <div className="card">
          <table>
            <thead>
              <tr><th>Waktu</th><th>Stasiun</th><th>Jenis</th><th>Deskripsi</th></tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id}>
                  <td>{new Date(a.created_at).toLocaleString("id-ID")}</td>
                  <td>{a.station_name || "-"}</td>
                  <td>{a.activity_type}</td>
                  <td>{a.description}</td>
                </tr>
              ))}
              {activities.length === 0 && (
                <tr><td colSpan={4}>Belum ada aktivitas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
