'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const schema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      const result = await login(data.email, data.password);
      // Redirect based on the user's actual role
      const role = result.user?.role || 'OPPORTUNITY_OWNER';
      const redirects: Record<string, string> = {
        OPPORTUNITY_OWNER: '/dashboard/owner',
        INVESTOR: '/dashboard/investor',
        SCOUT: '/dashboard/scout',
        ADMIN: '/dashboard/admin',
      };
      router.push(redirects[role] || '/dashboard/owner');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Login failed. Please check your credentials.';
      setServerError(typeof msg === 'string' ? msg : 'Invalid credentials.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-gray-600">Log in to your OpportunityScout account</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Login form">
            <div className="space-y-4">
              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />

              {serverError && (
                <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {serverError}
                </div>
              )}

              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Log in
              </Button>
            </div>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
