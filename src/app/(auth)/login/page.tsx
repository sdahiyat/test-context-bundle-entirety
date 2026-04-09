'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { AuthLayout, Button, Input } from '@/components';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    // Auth logic handled in task 2
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue tracking">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Sign In
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">
            <span className="bg-white px-2">New to NutriTrack?</span>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/signup"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Create an account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
