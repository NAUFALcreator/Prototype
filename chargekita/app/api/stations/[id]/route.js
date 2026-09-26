import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";

export async function PUT(req, { params }) {
  const { id } = params;
  const {
    name, type, address, connector_type, status,
    battery_available, battery_total, latitude, longitude,
  } = await req.json();

  const rows = await query(
    `UPDATE stations SET name=$1, type=$2, address=$3, connector_type=$4, status=$5,
     battery_available=$6, battery_total=$7, latitude=$8, longitude=$9, updated_at=NOW()
     WHERE id=$10 RETURNING *`,
    [
      name, type, address, connector_type, status,
      battery_available, battery_total,
      latitude === "" || latitude === undefined ? null : Number(latitude),
      longitude === "" || longitude === undefined ? null : Number(longitude),
      id,
    ]
  );

  await query(
    "INSERT INTO activities (station_id, activity_type, description) VALUES ($1, $2, $3)",
    [id, "status_change", `Status stasiun diubah menjadi "${status}"`]
  );

  return NextResponse.json(rows[0]);
}

export async function DELETE(req, { params }) {
  const { id } = params;
  const existing = await query("SELECT name FROM stations WHERE id = $1", [id]);
  await query("DELETE FROM stations WHERE id = $1", [id]);
  if (existing[0]) {
    await query(
      "INSERT INTO activities (station_id, activity_type, description) VALUES ($1, $2, $3)",
      [null, "status_change", `Stasiun "${existing[0].name}" dihapus`]
    );
  }
  return NextResponse.json({ ok: true });
}
