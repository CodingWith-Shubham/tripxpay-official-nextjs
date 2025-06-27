import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    const password = req.nextUrl.searchParams.get("password");
    if (!email || !password) {
      return NextResponse.json(
        { message: "fields are required" },
        { status: 400 }
      );
    }

    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      return NextResponse.json({ user }, { status: 200 });
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;

      switch (errorCode) {
        case "auth/invalid-email":
          return NextResponse.json(
            { message: "Invalid email format" },
            { status: 400 }
          );
        case "auth/user-disabled":
          return NextResponse.json(
            { message: "This user account has been disabled" },
            { status: 400 }
          );
        case "auth/user-not-found":
          return NextResponse.json(
            { message: "No user found with this email" },
            { status: 400 }
          );
        case "auth/wrong-password":
          return NextResponse.json(
            { message: "Incorrect password" },
            { status: 400 }
          );
        case "auth/too-many-requests":
          return NextResponse.json(
            { message: "Too many attempts. Please try again later" },
            { status: 429 }
          );
        case "auth/network-request-failed":
          return NextResponse.json(
            { message: "Network error. Please check your connection" },
            { status: 500 }
          );
        case "auth/operation-not-allowed":
          return NextResponse.json(
            { message: "Email/password sign-in is not enabled" },
            { status: 400 }
          );
        default:
          return NextResponse.json({ message: errorMessage }, { status: 500 });
      }
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server issue" },
      { status: 500 }
    );
  }
}
