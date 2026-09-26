"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const router = useRouter();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Registrasi gagal");
      return;
    }
    router.push("/login");
  }

  return (
    <div className="auth-box">
      <h1>⚡ Daftar ChargeKita</h1>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        <input placeholder="Nama Lengkap" value={form.name} onChange={(e) => update("name", e.target.value)} required />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => update("password", e.target.value)} required />
        <select value={form.role} onChange={(e) => update("role", e.target.value)}>
          <option value="user">Pengguna Kendaraan Listrik</option>
          <option value="operator">Operator</option>
        </select>
        <button type="submit" style={{ width: "100%" }}>Register</button>
      </form>
      <p style={{ marginTop: 12, fontSize: 14 }}>
        Sudah punya akun? <a href="/login">Login</a>
      </p>
    </div>
  );
}
