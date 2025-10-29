import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";


const SECRET = process.env.JWT_SECRET || "supersecret";

async function getUser(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export async function GET(req) {
  const user = await getUser(req);
  if (!user) return NextResponse.json([], { status: 401 });

  const [contacts] = await db.query("SELECT * FROM directory WHERE uid = ?", [user.uid]);
  return NextResponse.json(contacts || []);
}

export async function POST(req) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { contact_name, contact_number } = await req.json();
  const [result] = await db.query(
    "INSERT INTO directory (uid, contact_name, contact_number) VALUES (?, ?, ?)",
    [user.uid, contact_name, contact_number]
  );

  return NextResponse.json({ id: result.insertId, contact_name, contact_number });
}

export async function DELETE(req) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db.query("DELETE FROM directory WHERE id = ? AND uid = ?", [id, user.uid]);
  return NextResponse.json({ success: true });
}

export async function PUT(req) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, contact_name, contact_number } = await req.json();
  await db.query(
    "UPDATE directory SET contact_name = ?, contact_number = ? WHERE id = ? AND uid = ?",
    [contact_name, contact_number, id, user.uid]
  );

  return NextResponse.json({ success: true });
}