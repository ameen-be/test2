import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import bcrypt from "bcryptjs"

const USERS_FILE = path.resolve(process.cwd(), "users.json")

type User = {
  firstName: string
  lastName: string
  email: string
  password: string // hashé !
  avatarUrl?: string // <-- Ajout du champ avatar
}

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, password, avatarUrl } = await req.json()

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  let users: User[] = []
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"))
  }

  if (users.find(u => u.email === email)) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 })
  }

  // Hash du mot de passe !
  const hashedPassword = await bcrypt.hash(password, 10)
  users.push({ firstName, lastName, email, password: hashedPassword, avatarUrl })

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))

  return NextResponse.json({ success: true })
}