"use server";
import { cookies } from "next/headers";

export async function deleteToken() {
  try {
    (await cookies()).delete("tripxPay__token");
  } catch (error) {
    console.log("error while deleting the token", (error as Error).message);
  }
}
