'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/jwt-auth/v1/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: email, // The WP JWT plugin uses 'username', which can be an email or username
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // The API often returns errors in a 'message' property. Customize as needed.
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      // On successful login, you receive a token.
      // Store the token to be used in subsequent authenticated API requests.
      // NOTE: localStorage is simple, but for better security, consider httpOnly cookies.
      if (data.token) {
        localStorage.setItem('token', data.token);
        // Redirect to a protected route, like a user dashboard.
        router.push('/dashboard');
      } else {
        throw new Error('Login successful, but no token was received.');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Welcome Back!</h1>
          <p className="text-gray-500 mt-2">Please sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="mb-5">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="text-sm text-right mb-6">
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200">
              Forgot Password?
            </a>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-500 mt-8">
          Don&apos;t have an account yet?{' '}
          <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}