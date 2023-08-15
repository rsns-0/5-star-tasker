import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest):Promise<NextResponse> {
    const res:Record<string,string> = await request.json()
    console.log(res)
    return new NextResponse("OK", {
      status: 200,
    })
  }
  

export async function POST(request: NextRequest):Promise<NextResponse> {
    const body:Record<string,string> = await request.json()
    const response = {
        message: body
    }
    return new NextResponse(JSON.stringify(response), {
        status: 200,
    })
  }

  