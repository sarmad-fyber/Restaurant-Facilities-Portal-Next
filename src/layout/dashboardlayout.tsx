// src/components/layouts/DashboardLayout.tsx

"use client";

import React, { useState, useRef, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase"; // your firebase client setup
import {
  LayoutDashboard,
  Building2,
  FileText,
  Truck,
  ClipboardList,
  HelpCircle,
  LogOut,
  User,
  Settings,
  Bell,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ----------------- Types -----------------
interface DashboardLayoutProps {
  children: ReactNode;
}
interface HeaderProps {
  onLogout: () => void;
}
interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: number;
}

// ----------------- Avatar -----------------
const Avatar: React.FC<AvatarProps> = ({ name, imageUrl, size = 40 }) => {
  const [imageError, setImageError] = useState(false);
  const getInitials = (name: string): string => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();
  };

  if (imageUrl && !imageError) {
    return (
      <Image
        src={imageUrl}
        alt={name || "Profile"}
        width={size}
        height={size}
        className="rounded-full object-cover"
        onError={() => setImageError(true)}
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size, fontSize: size / 2.3 }}
      className="rounded-full flex items-center justify-center font-bold text-white bg-gray-300 "
    >
      {getInitials(name)}
    </div>
  );
};

// ----------------- Header -----------------
const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { user, userName, userProfile } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white py-3 px-6 flex items-center justify-between shadow-sm sticky top-0 z-20">
      <h1 className="text-lg font-bold text-sky-900">
        Facilities Management Portal
      </h1>

      <div className="flex items-center gap-4" ref={dropdownRef}>
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
          <Search className="h-4 w-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search for something"
            className="bg-transparent outline-none flex-1 text-sm text-gray-700"
          />
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Settings className="h-5 w-5 text-gray-700" />
        </button>

        <button className="p-2 hover:bg-gray-100 rounded-full relative">
          <Bell className="h-5 w-5 text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center cursor-pointer"
          >
            <Avatar
              name={userName || "User"}
              imageUrl={userProfile?.profilePicUrl}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-lg bg-white shadow-lg border z-30">
              <div className="p-4 border-b">
                <p className="font-semibold">{userName || "User"}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="p-2">
                <Link
                  href="/my-profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  <User size={16} /> My Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  <Settings size={16} /> Settings
                </Link>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full rounded"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// ----------------- Welcome Banner -----------------
const WelcomeBanner = () => {
  const { userName } = useAuth();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-xl bg-gradient-to-r from-red-700 to-red-600 text-white rounded-b-2xl p-6 shadow-md overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative text-center">
          <p className="text-sm opacity-90">{today}</p>
          <h2 className="text-2xl font-extrabold mt-1">
            Welcome, {userName || "User"}!
          </h2>
        </div>
      </div>
    </div>
  );
};

// ----------------- Sidebar -----------------
const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);

  const menuItems = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Facilities", href: "/facilities", icon: Building2 },
    { name: "Issues and Logs", href: "/issues", icon: FileText },
    { name: "Suppliers and Contractors", href: "/suppliers", icon: Truck },
    { name: "Inspections", href: "/inspections", icon: ClipboardList },
    { name: "Support and Training", href: "/support", icon: HelpCircle },
  ];

  return (
    <aside
      className={`${
        expanded ? "w-60" : "w-20"
      } bg-red-700 text-white flex flex-col py-6 relative transition-all duration-300 ease-in-out`}
    >
      {/* Logo */}
      <div className="flex justify-center mb-10">
        <img
          src="/images/logo/logo2.png"
          alt="Logo"
          className={`transition-all duration-300 ${
            expanded ? "h-20" : "h-10"
          }`}
        />
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2 flex-1">
        {menuItems.map(({ name, href, icon: Icon }) => (
          <div key={name} className="relative group">
            <Link
              href={href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-red-800 rounded-md transition-all ${
                expanded ? "justify-start" : "justify-center"
              }`}
            >
              <Icon size={20} />
              {expanded && <span>{name}</span>}
            </Link>
            {!expanded && (
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1 rounded-md bg-white text-black shadow-md text-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition">
                {name}
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* Toggle Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer sidebar-toggle absolute -right-3 bg-white text-red-700 rounded-full p-2 shadow-md hover:shadow-lg transition"
      >
        {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
    </aside>
  );
};

// ----------------- Dashboard Layout -----------------
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { authLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Firebase sign out
      await signOut(auth);

      // 2. Clear userRole cookie via API
      await fetch("/api/session", {
        method: "DELETE",
      });

      // 3. Redirect
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header onLogout={handleLogout} />
        <WelcomeBanner />
        <main className="flex-grow p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
