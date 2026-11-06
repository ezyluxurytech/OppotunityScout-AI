'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.').max(100),
  email: z.string().email('Please enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[A-Z]/, 'Must contain an uppercase letter.')
    .regex(/[0-9]/, 'Must contain a number.'),
  role: z.enum(['OPPORTUNITY_OWNER', 'INVESTOR', 'SCOUT']),
});

type FormData = z.infer<typeof schema>;

const ROLE_OPTIONS = [
  { value: 'OPPORTUNITY_OWNER', label: 'Opportunity Owner — I have a business, idea, or talent' },
  { value: 'INVESTOR', label: 'Investor — I want to discover and fund opportunities' },
  { value: 'SCOUT', label: 'Scout — I identify and introduce opportunities' },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState('');

  const defaultRole = (searchParams.get('role') as any) || 'OPPORTUNITY_OWNER';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: defaultRole },
  });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      await registerUser(data);
      const redirects: Record<string, string> = {
        OPPORTUNITY_OWNER: '/dashboard/owner',
        INVESTOR: '/dashboard/investor',
        SCOUT: '/dashboard/scout',
      };
      router.push(redirects[data.role] || '/');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setServerError(
        typeof msg === 'string' ? msg : 'Registration failed. Please try again.',
      );
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Registration form">
        <div className="space-y-4">
          <Input
            label="Full name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            hint="Must include uppercase letter and number."
            error={errors.password?.message}
            {...register('password')}
          />
          <Select
            label="I am a..."
            options={ROLE_OPTIONS}
            error={errors.role?.message}
            {...register('role')}
          />

          {serverError && (
            <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Create account
          </Button>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
          Log in
        </Link>
      </p>

      <p className="mt-3 text-center text-xs text-gray-500">
        By signing up, you acknowledge this is a discovery platform and not an investment exchange.
      </p>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-gray-600">Join OpportunityScout AI today</p>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
            </div>
          }
        >
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
