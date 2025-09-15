'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { VscLock } from 'react-icons/vsc';

// Define the different views the component can be in
type View = 'OTP_VERIFY' | 'SET_PASSWORD' | 'SUCCESS';

export default function CombinedResetPage() {
  // State to manage which view is currently active
  const [currentView, setCurrentView] = useState<View>('OTP_VERIFY');

  // State for OTP view
  const [otp, setOtp] = useState<string[]>(new Array(5).fill(''));
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // State for Set Password view
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // General state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // A placeholder email for display purposes
  const userEmail = "example@email.com";

  // --- OTP Logic ---
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value.slice(-1);
    setOtp(newOtp);

    if (element.value && index < otp.length - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    const verificationCode = otp.join('');
    await new Promise(resolve => setTimeout(resolve, 500));

    if (verificationCode === "12345") {
      setCurrentView('SET_PASSWORD');
    } else {
      setError("Invalid or expired code. Please try again.");
      setOtp(new Array(5).fill(''));
      otpInputRefs.current[0]?.focus();
    }
    setLoading(false);
  };
  
  // Auto-submit OTP form when complete
  const isOtpComplete = otp.every(digit => digit !== '');
  const otpFormRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (isOtpComplete) {
      setTimeout(() => otpFormRef.current?.requestSubmit(), 100);
    }
  }, [otp, isOtpComplete]);


  // --- New Password Logic ---
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Dummy logic for testing
    setTimeout(() => {
      setCurrentView('SUCCESS');
      setLoading(false);
    }, 1000);
  };


  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* LEFT PANEL (Remains constant) */}
      <div className="w-full md:w-2/5 bg-[#DD0031] flex flex-col justify-center items-center text-white p-8 md:p-12 text-center">
        <div className="py-12 md:py-0">
          <div className="flex flex-col items-center gap-y-10 mb-12 md:mb-16">
            <img src="/images/logo/logo.png" alt="Chick-fil-A Logo" className="w-48 h-auto" />
            <img src="/images/logo/logo2.png" alt="Chick-fil-A Icon" className="w-40 h-auto" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">An original then, an original now</h2>
          <p className="text-white/90 max-w-xs mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL (Content changes based on view) */}
      <div className="w-full md:w-3/5 flex flex-col justify-center items-center bg-white p-8 md:p-12 relative">
        <div className="w-full max-w-md">

          {/* VIEW 1: OTP VERIFICATION */}
          {currentView === 'OTP_VERIFY' && (
            <div className="text-center">
              <div className="mb-10">
                <h1 className="text-2xl md:text-3xl font-bold text-[#DD0031] mb-3">Check your email</h1>
                <p className="text-gray-500 tracking-wider text-sm font-medium leading-relaxed">
                  WE SENT A RESET LINK TO {userEmail.toUpperCase()}. ENTER 5 DIGIT CODE<br/>THAT MENTIONED IN THE EMAIL
                </p>
              </div>
              <form ref={otpFormRef} onSubmit={handleOtpSubmit}>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
                <div className="flex justify-center gap-3 md:gap-4 mb-8">
                  {otp.map((data, index) => (
                    <input
                      key={index} type="tel" maxLength={1} value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                   
                      className="w-14 h-14 md:w-16 md:h-16 text-center text-2xl font-semibold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                      disabled={loading}
                    />
                  ))}
                </div>
                <button type="submit" disabled={loading} className="w-full flex justify-between items-center py-3 px-6 rounded-xl text-lg font-semibold text-white bg-[#DD0031] hover:bg-red-700 transition cursor-pointer disabled:bg-red-400 disabled:cursor-not-allowed">
                  <span>{loading ? 'Verifying...' : 'Verify Code'}</span><span className="font-light text-2xl">→</span>
                </button>
              </form>
            </div>
          )}

          {/* VIEW 2: SET NEW PASSWORD */}
          {currentView === 'SET_PASSWORD' && (
             <div>
              <div className="text-center mb-10">
                <h1 className="text-2xl md:text-3xl font-bold text-[#DD0031] mb-3">Set a new password</h1>
                <p className="text-gray-500 tracking-wider text-sm font-medium">YOUR NEW PASSWORD MUST BE DIFFERENT<br/>FROM PREVIOUSLY USED PASSWORD</p>
              </div>
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4 relative">
                  <VscLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-16 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Enter your new password" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-gray-500 hover:text-gray-700 cursor-pointer">{showPassword ? 'HIDE' : 'SHOW'}</button>
                </div>
                <div className="mb-6 relative">
                  <VscLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                  <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-16 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Re-enter password" required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-gray-500 hover:text-gray-700 cursor-pointer">{showConfirmPassword ? 'HIDE' : 'SHOW'}</button>
                </div>
                <button type="submit" disabled={loading} className="w-full flex justify-between items-center py-3 px-6 rounded-lg text-lg font-semibold text-white bg-[#DD0031] hover:bg-red-700 transition cursor-pointer disabled:bg-red-400 disabled:cursor-not-allowed">
                  <span>{loading ? 'Updating...' : 'Update password'}</span><span className="font-light text-2xl">→</span>
                </button>
              </form>
            </div>
          )}

          {/* VIEW 3: SUCCESS MESSAGE */}
          {currentView === 'SUCCESS' && (
            <div className="text-center">
              <div className="mb-10">
                <h1 className="text-2xl md:text-3xl font-bold text-[#DD0031] mb-3">Success!</h1>
                <p className="text-gray-500 tracking-wider text-sm font-medium">PASSWORD HAS BEEN UPDATED.<br/>USE NEW ACCOUNT TO LOG IN</p>
              </div>
              <Link href="/" passHref>
                <button className="w-full flex justify-between items-center py-3 px-6 rounded-lg text-lg font-semibold text-white bg-[#DD0031] hover:bg-red-700 transition cursor-pointer">
                  <span>LOG IN</span><span className="font-light text-2xl">→</span>
                </button>
              </Link>
              <div className="text-center mt-8">
                <p className="text-sm text-gray-500">
                  Want a new account?{' '}
                  <Link href="/signup" className="font-semibold text-cyan-600 hover:underline cursor-pointer">Create an account</Link>
                </p>
              </div>
            </div>
          )}

        </div>
        <p className="absolute bottom-10 left-8 md:left-12 text-gray-400 text-sm">© 2025 CFA Properties, Inc. All rights reserved.</p>
      </div>
    </div>
  );
}