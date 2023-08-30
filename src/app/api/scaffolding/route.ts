import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest):Promise<NextResponse> {
    return NextResponse.json({message: "Endpoint hit.",TEST_VAR:process.env.TEST_VAR || "is undefined"})

  }
  

export async function POST(request: NextRequest):Promise<NextResponse> {
    const body:Record<string,string> = await request.json()
    const response = {
        message: body
    }
    return NextResponse.json(response)
  }

  