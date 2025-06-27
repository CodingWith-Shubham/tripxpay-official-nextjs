import { database } from "@/lib/firebase";
import { ref, update } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const userid = searchParams.get("userid");
    const merchantid = searchParams.get("merchantid");
    if (!userid || !merchantid) {
      return NextResponse.json(
        { message: "userid or merchantid required" },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    }

    if (userid == merchantid) {
      return NextResponse.json(
        {
          message: "Cannot create merchant relationship with yourself",
        },
        {
          status: 409,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    }

    await update(ref(database, `users/${userid}`), {
      merchantRel: merchantid,
    });

    return NextResponse.json(
      { message: "Now you are merchant consumer" },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.log("error while stablishing the merchant relation", error);
    return NextResponse.json(
      { message: "Internal Server issue" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
}
