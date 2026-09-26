"use client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="navbar">
      <span className="brand">⚡ ChargeKita</span>
      <a href="/dashboard">Map & Status</a>
      <a href="/spklu">Manajemen SPKLU</a>
      <a href="/battery">Monitoring Baterai</a>
      <a href="/history">Riwayat Aktivitas</a>
      <span className="spacer" />
      <button onClick={handleLogout} className="btn-outline" style={{ background: "transparent", border: "1px solid white", color: "white" }}>
        Logout
      </button>
    </div>
  );
}
