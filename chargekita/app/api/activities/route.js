import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query(
    `SELECT a.id, a.activity_type, a.description, a.created_at,
            s.name AS station_name
     FROM activities a
     LEFT JOIN stations s ON s.id = a.station_id
     ORDER BY a.created_at DESC
     LIMIT 100`
  );
  return NextResponse.json(rows);
}
