'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { AuthLayout, Button, Input } from '@/components';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = 'Enter a valid email';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    if (!form.confirmPassword)
      newErrors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
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
    <AuthLayout
      title="Create account"
      subtitle="Start tracking your nutrition today"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Full name"
          type="text"
          name="name"
          placeholder="Jane Doe"
          value={form.name}
          onChange={handleChange('name')}
          error={errors.name}
          autoComplete="name"
        />

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange('email')}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Min. 8 characters"
          value={form.password}
          onChange={handleChange('password')}
          error={errors.password}
          autoComplete="new-password"
          helperText="Must be at least 8 characters"
        />

        <Input
          label="Confirm password"
          type="password"
          name="confirmPassword"
          placeholder="Repeat your password"
          value={form.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Create Account
        </Button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
