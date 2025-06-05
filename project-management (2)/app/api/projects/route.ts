import { NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI! // Mets ton URI Atlas dans .env.local
const client = new MongoClient(uri)
const dbName = "ma-base-de-données-SpaceX" 

export async function POST(request: NextRequest) {
  const data = await request.json()
  await client.connect()
  const db = client.db(dbName)
  const collection = db.collection("projects")
  const result = await collection.insertOne(data)
  return NextResponse.json({ insertedId: result.insertedId })
}

export async function GET() {
  await client.connect()
  const db = client.db(dbName)
  const collection = db.collection("projects")
  const projects = await collection.find().toArray()
  return NextResponse.json(projects)
}