'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Pass both the token AND the email to the login function
        login(data.token, email);
        router.push('/'); // Redirect to home page
      } else {
        setMessage(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error("Login fetch error:", err);
      setMessage('A network error occurred. Is the backend server running?');
    }
  };

  return (
    <div className="container p-4 mx-auto max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email-login" className="block mb-1 font-semibold">Email</label>
              <Input
                id="email-login"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password-login" className="block mb-1 font-semibold">Password</label>
              <Input
                id="password-login"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            {message && <p className="text-sm text-red-500">{message}</p>}
            <Button type="submit" size="lg" className="w-full">
              Log In
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}