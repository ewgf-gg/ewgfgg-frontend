import { NextResponse } from 'next/server'
export async function GET(
    request: Request,
    { params }: { params: { version: string; category: string } }
  ) {
    try {
      const response = await fetch(
        `http://localhost:8080/statistics/rankDistribution/${params.version}/${params.category}`
      )
      const data = await response.json()
      return NextResponse.json(data)
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch rank distribution' }, { status: 500 })
    }
  }