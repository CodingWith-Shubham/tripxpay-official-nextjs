import { database } from "@/lib/firebase";
import { ref, serverTimestamp, update } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      displayName,
      email,
      photoURL,
      uid,
      pan,
      aadhaar,
      faceImage,
      emailVerified,
      address,
      profilePicture,
      phoneNumber,
      profession,
      fatherName,
    } = await req.json();

    if (!displayName || !email || !uid) {
      return NextResponse.json({ message: "Bad request " }, { status: 400 });
    }

    const updatadata = {
      displayName,
      email,
      photoUrl: profilePicture,
      uid,
      phoneNumber,
      address,
      profession,
      fatherName,
      isEmailVerified: emailVerified,
      isVerified: false,
      creditedAmount: 0,
      submittedAt: serverTimestamp(),
      status: "pending",
      documents: {
        pan: pan
          ? {
              downloadURL: pan,
              type: "pan",
              uploadedAt: serverTimestamp(),
            }
          : null,
        aadhaar: aadhaar
          ? {
              downloadURL: aadhaar,
              type: "aadhaar",
              uploadedAt: serverTimestamp(),
            }
          : null,
      },
      faceAuth: faceImage
        ? {
            downloadURL: faceImage,
            uploaded: true,
            uploadedAt: serverTimestamp(),
          }
        : null,
    };

    const rtdbref = ref(database, `users/${uid}`);
    await update(rtdbref, updatadata);
    return NextResponse.json(
      { message: "document update successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log("error while uploadintg document", error as Error);
    return NextResponse.json(
      { message: "Internal server issue", success: false },
      { status: 500 }
    );
  }
}
