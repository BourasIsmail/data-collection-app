import { NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  // For production, use environment variable with service account JSON
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : null;

  if (serviceAccount) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // Fallback for development - uses application default credentials
    initializeApp();
  }
}

interface CreateUserRequest {
  users: Array<{
    email: string;
    password: string;
    province: string;
  }>;
  adminUid: string;
}

export async function POST(request: Request) {
  try {
    const body: CreateUserRequest = await request.json();
    const { users, adminUid } = body;

    // Verify the requester is an admin
    const adminDb = getFirestore();
    const adminDoc = await adminDb.collection("users").doc(adminUid).get();
    
    if (!adminDoc.exists || adminDoc.data()?.role !== "admin") {
      return NextResponse.json({ error: "غير مصرح لك بإجراء هذه العملية" }, { status: 403 });
    }

    const auth = getAuth();
    const db = getFirestore();
    
    const results = {
      created: [] as string[],
      failed: [] as { email: string; error: string }[],
    };

    for (const userData of users) {
      try {
        // Create user in Firebase Auth
        const userRecord = await auth.createUser({
          email: userData.email,
          password: userData.password,
        });

        // Create user document in Firestore
        await db.collection("users").doc(userRecord.uid).set({
          email: userData.email,
          role: "user",
          province: userData.province,
          createdAt: new Date(),
        });

        results.created.push(userData.email);
      } catch (err: unknown) {
        const error = err as { code?: string; message?: string };
        let errorMsg = "خطأ غير معروف";
        
        if (error.code === "auth/email-already-exists") {
          errorMsg = "البريد الإلكتروني موجود مسبقاً";
        } else if (error.code === "auth/invalid-email") {
          errorMsg = "بريد إلكتروني غير صالح";
        } else if (error.code === "auth/weak-password") {
          errorMsg = "كلمة المرور ضعيفة";
        }
        
        results.failed.push({ email: userData.email, error: errorMsg });
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error creating users:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
