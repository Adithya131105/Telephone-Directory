import { NextResponse } from "next/server";
import { db } from "@/lib/db";


export async function POST(req) {
  try {
    const { uname, password } = await req.json();

    const [existing] = await db.query("SELECT * FROM users WHERE uname = ?", [uname]);
    if (existing.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const [result] = await db.query(
      "INSERT INTO users (uname, password) VALUES (?, ?)",
      [uname, password]
    );

    return NextResponse.json({ success: true, uid: result.insertId });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
