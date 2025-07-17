import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    name: 'Sapunoa API',
    version: '0.1.0',
    status: 'active',
    timestamp: new Date().toISOString(),
  })
}