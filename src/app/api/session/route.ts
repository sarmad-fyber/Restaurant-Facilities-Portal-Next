import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    // 1️⃣ Sign in with Firebase Admin (verify password)
    // NOTE: Firebase Admin doesn't sign in directly with password, so you may need Firebase Auth REST API
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 401 });
    }

    const uid = data.localId;

    // 2️⃣ Get user profile from Firestore
    const userDoc = await adminDb.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const userProfile = userDoc.data()!;
    const role = (userProfile.role || "user").toLowerCase();

    // 3️⃣ Set cookie
    const response = NextResponse.json({ success: true, role });
    response.cookies.set("userRole", role, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (err: any) {
    console.error("Login API error:", err);
    return NextResponse.json({ error: err.message || "Login failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("userRole", "", { path: "/", maxAge: 0 });
  return res;
}
