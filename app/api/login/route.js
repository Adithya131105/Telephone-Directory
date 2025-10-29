import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req) {
  try {
    const { uname, password } = await req.json();

    const [rows] = await db.query("SELECT * FROM users WHERE uname = ?", [uname]);
    if (!rows.length) return NextResponse.json({ error: "User not found" }, { status: 401 });

    const user = rows[0];

    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign({ uid: user.uid, uname: user.uname }, SECRET, { expiresIn: "1d" });

    return NextResponse.json({ token });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
