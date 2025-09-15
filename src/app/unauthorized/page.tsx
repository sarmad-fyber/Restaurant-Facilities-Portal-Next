// app/unauthorized/page.tsx

"use client"; // This component uses client-side hooks for navigation (useRouter).

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft } from 'lucide-react'; // Using modern icons

const UnauthorizedPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
        
        {/* Icon Container */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <ShieldAlert className="h-10 w-10 text-red-600" aria-hidden="true" />
        </div>
        
        {/* Text Content */}
        <div className="mt-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Access Denied
          </h1>
          <p className="mt-4 text-base text-slate-500">
            Sorry, your assigned role does not grant you permission to view this page.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Please contact an administrator if you believe this is an error.
          </p>
        </div>
        
        {/* Action Button */}
        <div className="mt-8">
          <button
            onClick={() => router.push('/dashboard')} // Redirects to the main dashboard
            className="inline-flex items-center gap-2 justify-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Go to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};

export default UnauthorizedPage;