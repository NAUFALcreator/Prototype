import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { verifyPassword, createToken, setSessionCookie } from "../../../lib/auth";

export async function POST(req) {
  const { email, password } = await req.json();

  const rows = await query("SELECT * FROM users WHERE email = $1", [email]);
  if (rows.length === 0) {
    return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
  }

  const user = rows[0];
  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
  }

  const token = createToken(user);
  const res = NextResponse.json({ ok: true, role: user.role });
  setSessionCookie(res, token);
  return res;
}
