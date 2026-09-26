import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";

export async function POST(req) {
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Data belum lengkap" }, { status: 400 });
  }

  const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.length > 0) {
    return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
  }

  const hashed = await hashPassword(password);
  await query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
    [name, email, hashed, role || "user"]
  );

  return NextResponse.json({ ok: true });
}
