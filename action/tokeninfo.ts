"use server";
import { cookies } from "next/headers";

import jwt from "jsonwebtoken";

export async function getUserInfo() {
  try {
    const token = (await cookies()).get("tripxPay__token")?.value;
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded) {
      return null;
    }
    return decoded;
  } catch (error) {
    console.log(
      "error to extract the info from the token",
      (error as Error).message
    );
    return null;
  }
}
