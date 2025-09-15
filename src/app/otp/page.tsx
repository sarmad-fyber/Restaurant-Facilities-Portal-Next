"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function OtpPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [otp, setOtp] = useState(Array(5).fill("")); // 5-digit OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpFormRef = useRef<HTMLFormElement>(null);

  // 🚀 On mount → fetch user email (from localStorage/session/etc.)
  useEffect(() => {
    const email = localStorage.getItem("userEmail"); // adjust if using session or cookies
    if (!email) {
      router.push("/"); // fallback if email missing
      return;
    }
    setUserEmail(email);

    // Send OTP immediately
    sendOtp(email);
  }, []);

  async function sendOtp(email: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to send OTP");
      }
    } catch {
      setError("Failed to send OTP.");
    }
    setLoading(false);
  }

  // 2. Verify OTP
  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, otp: otp.join("") }),
      });
      const data = await res.json();
      if (data.success) {
        // ✅ OTP valid → redirect
        router.push("/dashboard"); // redirect to main app
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to verify OTP.");
    }
    setLoading(false);
  }

  // Handle OTP input boxes
  function handleOtpChange(element: HTMLInputElement, index: number) {
    if (isNaN(Number(element.value))) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto focus next
    if (element.value && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full">
        <form ref={otpFormRef} onSubmit={handleOtpSubmit} className="text-center">
          <h1 className="text-2xl font-bold text-[#DD0031] mb-4">Enter OTP</h1>
          <p className="text-gray-500 text-sm mb-6">
            We sent a code to <span className="font-semibold">{userEmail}</span>
          </p>
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="tel"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target, index)}
                className="w-14 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={loading}
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#DD0031] text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-red-400"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
