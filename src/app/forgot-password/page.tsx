'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { VscMail, VscLock } from 'react-icons/vsc';

type View = 'EMAIL' | 'OTP' | 'SET_PASSWORD' | 'SUCCESS';

export default function ResetPasswordFlow() {
  const [currentView, setCurrentView] = useState<View>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(new Array(5).fill(''));
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpExpiry, setOtpExpiry] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const otpFormRef = useRef<HTMLFormElement>(null);

  // --- TIMER HANDLER ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpExpiry) {
      interval = setInterval(() => {
        const remaining = Math.max(0, Math.floor((otpExpiry - Date.now()) / 1000));
        setTimer(remaining);
        if (remaining <= 0) clearInterval(interval);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpExpiry]);

  // --- STEP 1: EMAIL SUBMIT (send OTP via API) ---
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Failed to send OTP');

      setOtp(new Array(5).fill(''));
      setOtpExpiry(Date.now() + 10 * 60 * 1000); // 10 min expiry
      setSuccess(`OTP sent to ${email}`);
      setCurrentView('OTP');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: OTP Verification ---
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    const newOtp = [...otp];
    newOtp[index] = element.value.slice(-1);
    setOtp(newOtp);
    if (element.value && index < otp.length - 1) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const verificationCode = otp.join('');

    const res = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code: verificationCode }),
    });

    const data = await res.json();

    if (!data.success) {
      setError('Invalid or expired OTP.');
      setOtp(new Array(5).fill(''));
      otpInputRefs.current[0]?.focus();
      setLoading(false);
      return;
    }

    setCurrentView('SET_PASSWORD');
    setLoading(false);
  };

  const isOtpComplete = otp.every((digit) => digit !== '');
  useEffect(() => {
    if (isOtpComplete && currentView === 'OTP') {
      setTimeout(() => otpFormRef.current?.requestSubmit(), 100);
    }
  }, [otp, isOtpComplete, currentView]);

  // --- STEP 3: Reset Password ---
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setCurrentView('SUCCESS');
  };

  // --- STEP 4: Resend OTP ---
  const handleResendOtp = () => {
    setOtpExpiry(null);
    setCurrentView('EMAIL');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* LEFT PANEL */}
      <div className="w-full md:w-2/5 bg-[#DD0031] flex flex-col justify-center items-center text-white p-8 md:p-12 text-center">
        <div className="flex flex-col items-center gap-y-10 mb-12">
          <img src="/images/logo/logo.png" alt="Logo" className="w-48 h-auto" />
          <img src="/images/logo/logo2.png" alt="Icon" className="w-40 h-auto" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">An original then, an original now</h2>
        <p className="text-white/90 max-w-xs mx-auto">Lorem ipsum dolor sit amet.</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-3/5 flex flex-col justify-center items-center bg-white p-8 md:p-12 relative">
        <div className="w-full max-w-md">
          {/* Step 1: Enter Email */}
          {currentView === 'EMAIL' && (
            <form onSubmit={handleEmailSubmit}>
              <h1 className="text-2xl font-bold text-[#DD0031] mb-3 text-center">Forgot Password</h1>
              {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
              {success && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{success}</div>}
              <div className="mb-6 relative">
                <VscMail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                  placeholder="example@email.com"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-[#DD0031] text-white rounded-lg">
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {currentView === 'OTP' && (
            <form ref={otpFormRef} onSubmit={handleOtpSubmit} className="text-center">
              <h1 className="text-2xl font-bold text-[#DD0031] mb-3">Check your email</h1>
              <p className="text-gray-500 text-sm mb-6">Enter the 5-digit code sent to {email}</p>
              {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
              <div className="flex justify-center gap-3 mb-6">
                {otp.map((data, index) => (
                 <input
                        key={index}
                        ref={(el) => {
                          otpInputRefs.current[index] = el;
                        }}
                        type="tel"
                        maxLength={1}
                        value={data}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        className="w-12 h-12 text-center text-xl border rounded"
                      />

                ))}
              </div>
              <p className="text-gray-500 text-sm mb-4">
                Code expires in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
              </p>
              <button type="submit" disabled={loading} className="w-full py-3 bg-[#DD0031] text-white rounded-lg mb-4">
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
              <button type="button" onClick={handleResendOtp} disabled={timer > 0} className="w-full py-3 bg-gray-200 rounded-lg">
                Resend OTP
              </button>
            </form>
          )}

          {/* Step 3: Set Password */}
          {currentView === 'SET_PASSWORD' && (
            <form onSubmit={handlePasswordSubmit}>
              <h1 className="text-2xl font-bold text-[#DD0031] mb-3 text-center">Set a new password</h1>
              {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
              <div className="mb-4 relative">
                <VscLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-16 py-3 border rounded-lg"
                  placeholder="New password"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 text-sm">
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
              <div className="mb-6 relative">
                <VscLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-16 py-3 border rounded-lg"
                  placeholder="Confirm password"
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-3 text-sm">
                  {showConfirmPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-[#DD0031] text-white rounded-lg">
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}

          {/* Step 4: Success */}
          {currentView === 'SUCCESS' && (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#DD0031] mb-3">Success!</h1>
              <p className="text-gray-500 mb-6">Your password has been reset.</p>
              <Link href="/" className="block w-full py-3 bg-[#DD0031] text-white rounded-lg">LOG IN</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
