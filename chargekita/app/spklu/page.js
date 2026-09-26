"use client";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";

const emptyForm = {
  name: "", type: "spklu", address: "", connector_type: "",
  status: "available", battery_available: 0, battery_total: 0,
  latitude: "", longitude: "",
};

export default function SpkluPage() {
  const [stations, setStations] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  function load() {
    fetch("/api/stations").then((r) => r.json()).then(setStations);
  }
  useEffect(load, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/stations/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/stations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm(emptyForm);
    setEditingId(null);
    load();
  }

  function handleEdit(s) {
    setForm(s);
    setEditingId(s.id);
  }

  async function handleDelete(id) {
    await fetch(`/api/stations/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2 style={{ color: "#0d47a1" }}>Manajemen SPKLU & Battery Swap</h2>

        <form className="card" onSubmit={handleSubmit}>
          <div className="grid">
            <input placeholder="Nama Stasiun" value={form.name} onChange={(e) => update("name", e.target.value)} required />
            <select value={form.type} onChange={(e) => update("type", e.target.value)}>
              <option value="spklu">SPKLU</option>
              <option value="battery_swap">Battery Swap</option>
            </select>
            <input placeholder="Alamat" value={form.address} onChange={(e) => update("address", e.target.value)} />
            <input placeholder="Tipe Konektor" value={form.connector_type} onChange={(e) => update("connector_type", e.target.value)} />
            <select value={form.status} onChange={(e) => update("status", e.target.value)}>
              <option value="available">Tersedia</option>
              <option value="in_use">Digunakan</option>
              <option value="full">Penuh</option>
              <option value="disrupted">Gangguan</option>
            </select>
            <input type="number" placeholder="Baterai Tersedia" value={form.battery_available} onChange={(e) => update("battery_available", Number(e.target.value))} />
            <input type="number" placeholder="Total Baterai" value={form.battery_total} onChange={(e) => update("battery_total", Number(e.target.value))} />
            <input type="number" step="any" placeholder="Latitude (contoh: -7.7925)" value={form.latitude} onChange={(e) => update("latitude", e.target.value)} />
            <input type="number" step="any" placeholder="Longitude (contoh: 110.3656)" value={form.longitude} onChange={(e) => update("longitude", e.target.value)} />
          </div>
          <p style={{ fontSize: 12, color: "#666", marginTop: -6, marginBottom: 10 }}>
            Tips: buka Google Maps, klik kanan lokasi stasiun → salin koordinat, lalu tempel di sini agar muncul di Peta Lokasi.
          </p>
          <button type="submit">{editingId ? "Simpan Perubahan" : "+ Tambah Stasiun"}</button>
        </form>

        <div className="card">
          <table>
            <thead>
              <tr><th>Nama</th><th>Tipe</th><th>Status</th><th>Alamat</th><th></th></tr>
            </thead>
            <tbody>
              {stations.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.type === "spklu" ? "SPKLU" : "Battery Swap"}</td>
                  <td><span className={`badge badge-${s.status}`}>{s.status}</span></td>
                  <td>{s.address}</td>
                  <td>
                    <button className="btn-blue" onClick={() => handleEdit(s)} style={{ marginRight: 6 }}>Edit</button>
                    <button className="btn-outline" onClick={() => handleDelete(s.id)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
