'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { VscLock } from 'react-icons/vsc';

// Firebase imports
import { auth, db } from '@/lib/firebase'; // Ensure this path is correct
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Staff'); // Default role
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data (including the selected role) into Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role,
        createdAt: serverTimestamp(),
      });

      setIsAccountCreated(true);
    } catch (err: any) {
      console.error('Signup error:', err.message);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* Left Panel */}
      <div className="w-full md:w-2/5 bg-[#DD0031] flex flex-col justify-center items-center text-white p-8 md:p-12 text-center">
        {/* Your branding content here */}
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-3/5 flex flex-col justify-center items-center bg-white p-8 md:p-12">
        <div className="w-full max-w-sm">
          {!isAccountCreated ? (
            <div>
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-[#DD0031]">Create Account</h1>
                <p className="text-gray-500 mt-2">Fill in your details to get started.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>}

                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required className="w-full p-3 border rounded-lg" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required className="w-full p-3 border rounded-lg" />
                
                <div>
                   <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
                   <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required className="w-full p-3 border rounded-lg bg-white">
                    <option value="Staff">Staff</option>
                    <option value="Manager">Manager</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full p-3 border rounded-lg" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required className="w-full p-3 border rounded-lg" />

                <button type="submit" disabled={loading} className="w-full p-3 rounded-lg text-lg font-semibold text-white bg-[#DD0031] hover:bg-red-700 disabled:bg-red-400">
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </form>

              <p className="text-center mt-6 text-sm text-gray-500">
                Already have an account? <Link href="/" className="font-bold text-red-600 hover:underline">Log In</Link>
              </p>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[#DD0031]">Success!</h1>
              <p className="text-gray-500 my-4">Your account has been created.</p>
              <Link href="/" className="w-full inline-block p-3 rounded-lg text-lg font-semibold text-white bg-[#DD0031] hover:bg-red-700">
                Go to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}