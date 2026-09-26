import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query(
    `SELECT id, name, address, battery_available, battery_total
     FROM stations WHERE type = 'battery_swap' ORDER BY id`
  );
  return NextResponse.json(rows);
}
