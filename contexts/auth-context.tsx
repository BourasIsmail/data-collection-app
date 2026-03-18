"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface UserData {
  uid: string;
  email: string;
  role: "admin" | "user";
  province: string;
  displayName: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, province: string, role?: "admin" | "user") => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // Fetch user data asynchronously with proper error handling
        getDoc(doc(db, "users", user.uid))
          .then((userDoc) => {
            if (userDoc.exists()) {
              setUserData(userDoc.data() as UserData);
            } else {
              // User exists in Auth but not in Firestore yet
              setUserData(null);
            }
            setLoading(false);
          })
          .catch((err) => {
            // Firestore not configured or permission denied - silently handle
            // This is expected when Firestore rules aren't set up yet
            if (err?.code !== 'permission-denied') {
              console.warn("Firestore error (expected if not configured):", err?.code);
            }
            setUserData(null);
            setLoading(false);
          });
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // User data will be fetched by onAuthStateChanged listener
  };

  const signUp = async (
    email: string, 
    password: string, 
    displayName: string, 
    province: string, 
    role: "admin" | "user" = "user"
  ) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUserData: UserData = {
      uid: userCredential.user.uid,
      email,
      role,
      province,
      displayName
    };
    try {
      await setDoc(doc(db, "users", userCredential.user.uid), newUserData);
      setUserData(newUserData);
    } catch (error) {
      console.error("Error saving user data:", error);
      // Still set local userData even if Firestore fails
      setUserData(newUserData);
      throw new Error("تم إنشاء الحساب لكن فشل حفظ البيانات. تأكد من إعداد قواعد Firestore.");
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
