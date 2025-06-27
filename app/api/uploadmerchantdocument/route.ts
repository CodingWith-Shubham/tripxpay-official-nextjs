import { database } from "@/lib/firebase";
import { ref, serverTimestamp, set } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      displayName,
      email,
      photoUrl,
      uid,
      msmeCertificate,
      gstCertificate,
      isEmailVerified,
      address,
      profilePicture,
      phoneNumber,
      companyName,
    } = await req.json();
    if (!displayName || !email || !uid) {
      return NextResponse.json(
        { message: "bad request", success: false },
        { status: 400 }
      );
    }
    const merchantData = {
      displayName,
      email,
      photoUrl: profilePicture || photoUrl,
      merchantId: uid,
      phoneNumber,
      address,
      companyName,
      isEmailVerified,
      isVerified: false,
      submittedAt: serverTimestamp(),
      documents: {
        msmeCertificate: msmeCertificate
          ? {
              downloadURL: msmeCertificate,
              type: "msmeCertificate",
              uploadedAt: serverTimestamp(),
            }
          : null,
        gstCertificate: gstCertificate
          ? {
              downloadURL: gstCertificate,
              type: "gstCertificate",
              uploadedAt: serverTimestamp(),
            }
          : null,
      },
    };
    const rtdbref = ref(database, `merchants/${uid}`);
    await set(rtdbref, merchantData);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log("error while uploading the merchant data", error);
    return NextResponse.json(
      { success: false, message: "Internal server issue" },
      { status: 500 }
    );
  }
}
