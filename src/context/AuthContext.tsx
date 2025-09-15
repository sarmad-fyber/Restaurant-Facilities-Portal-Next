// context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  User as FirebaseAuthUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// --- Interfaces ---
export interface UserProfile {
  name: string;
  email: string;
  role: string;
  profilePicUrl?: string;
  designation?: string;
  [key: string]: any;
}

interface AppUser extends FirebaseAuthUser {
  displayName: string | null;
}

interface AuthContextProps {
  user: AppUser | null;
  userName: string;
  role: string;
  userProfile: UserProfile | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

// --- Context Setup ---
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// --- Provider ---
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // 🔹 Fetch profile from Firestore
  const fetchUserProfile = useCallback(async (firebaseUser: FirebaseAuthUser) => {
    try {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data() as UserProfile;
        const userRole = userData.role?.toLowerCase() || "user"; // fallback role

        // 🔹 Set cookie for middleware
        document.cookie = `userRole=${userRole}; path=/; max-age=86400; SameSite=Lax`;

        // 🔹 Update state
        setUserProfile(userData);
        setRole(userRole);
        const fetchedName = userData.name || firebaseUser.displayName || "";
        setUserName(fetchedName);
        setUser({ ...firebaseUser, displayName: fetchedName });
      } else {
        console.warn("⚠️ No Firestore document found for user. Assigning default role.");
        setRole("user");
        setUserProfile(null);
        setUser(firebaseUser as AppUser);
        setUserName(firebaseUser.displayName || firebaseUser.email || "User");
      }
    } catch (err) {
      console.error("❌ Error fetching Firestore profile:", err);
      await signOut(auth);
    }
  }, []);

  // 🔹 Clear on logout
  const clearAuthData = () => {
    document.cookie = "userRole=; path=/; max-age=0; SameSite=Lax";
    setUser(null);
    setUserName("");
    setRole("");
    setUserProfile(null);
  };

  // 🔹 Listen for login/logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await fetchUserProfile(currentUser);
      } else {
        clearAuthData();
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [fetchUserProfile]);

  // --- Auth Methods ---
  const login = async (email: string, password: string) => {
    setAuthLoading(true);
    await signInWithEmailAndPassword(auth, email, password);
    // profile fetch handled by listener
  };

  const logout = async () => {
    await signOut(auth);
    clearAuthData();
  };

  const refreshUserProfile = useCallback(async () => {
    if (auth.currentUser) {
      await fetchUserProfile(auth.currentUser);
    }
  }, [fetchUserProfile]);

  // --- Context Value ---
  const value = {
    user,
    userName,
    role,
    userProfile,
    authLoading,
    login,
    logout,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
