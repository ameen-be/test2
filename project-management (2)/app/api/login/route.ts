import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import bcrypt from "bcryptjs"

const USERS_FILE = path.resolve(process.cwd(), "users.json")

type User = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin" | "client";
  avatarUrl?: string; // <-- Ajout ici
};

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  let users: User[] = []
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"))
  }

  const user = users.find(u => u.email === email)
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  return NextResponse.json({
    success: true,
    user: { 
      firstName: user.firstName, 
      lastName: user.lastName, 
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl || null, // <-- Ajout ici
    }
  })
}