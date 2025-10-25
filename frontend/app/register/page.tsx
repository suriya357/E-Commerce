'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('User registered successfully! You can now log in.');
    } else {
      setMessage(data.message || 'An error occurred.');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-sm">
      <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Register
        </button>
      </form>
      {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      <p className="mt-4 text-center">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-500 hover:underline">
          Log In
        </Link>
      </p>
    </div>
  );
}