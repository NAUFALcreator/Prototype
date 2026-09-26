import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query("SELECT * FROM stations ORDER BY id DESC");
  return NextResponse.json(rows);
}

export async function POST(req) {
  const {
    name, type, address, connector_type, status,
    battery_available, battery_total, latitude, longitude,
  } = await req.json();

  if (!name || !type) {
    return NextResponse.json({ error: "Nama dan tipe wajib diisi" }, { status: 400 });
  }

  const rows = await query(
    `INSERT INTO stations (name, type, address, connector_type, status, battery_available, battery_total, latitude, longitude)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [
      name,
      type,
      address || "",
      connector_type || "",
      status || "available",
      battery_available || 0,
      battery_total || 0,
      latitude === "" || latitude === undefined ? null : Number(latitude),
      longitude === "" || longitude === undefined ? null : Number(longitude),
    ]
  );

  await query(
    "INSERT INTO activities (station_id, activity_type, description) VALUES ($1, $2, $3)",
    [rows[0].id, "status_change", `Stasiun "${name}" ditambahkan`]
  );

  return NextResponse.json(rows[0]);
}
