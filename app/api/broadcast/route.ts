import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { title, body } = await req.json();

  if (!title || !body) {
    return NextResponse.json(
      { error: "Title and body are required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      "https://broadcasttoalldrivers-nm27sv53qq-uc.a.run.app",
      {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key":  "MY_SECRET_KEY_123",
        },
        body: JSON.stringify({ title, body }),
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to reach broadcast service" },
      { status: 500 }
    );
  }
}