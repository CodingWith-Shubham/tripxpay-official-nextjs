import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json(
      {
        title: "Hellow tripxpay",
        descritpion: "Travel Now , Pay Later",
        azenda: "shift the backend to next js",
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
}
