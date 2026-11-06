'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { opportunitiesApi } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.').max(200),
  type: z.enum(['BUSINESS', 'IDEA', 'TALENT']),
  description: z.string().min(10, 'Please provide a description.'),
  sector: z.string().optional(),
  location: z.string().optional(),
  stage: z.enum(['IDEA', 'EARLY_STAGE', 'GROWTH', 'ESTABLISHED', 'SEEKING_PARTNER', '']).optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  goals: z.string().optional(),
  supportRequired: z.string().optional(),
  useOfFunds: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditOpportunityPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [loaded, setLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    opportunitiesApi.getOne(id).then((data: any) => {
      reset({
        title: data.title,
        type: data.type,
        description: data.description,
        sector: data.sector || '',
        location: data.location || '',
        stage: data.stage || '',
        problem: data.problem || '',
        solution: data.solution || '',
        goals: data.goals || '',
        supportRequired: data.supportRequired || '',
        useOfFunds: data.useOfFunds || '',
      });
      setLoaded(true);
    }).catch(() => {
      setServerError('Failed to load opportunity.');
      setLoaded(true);
    });
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      const payload = { ...data, stage: data.stage || undefined };
      await opportunitiesApi.update(id, payload);
      router.push(`/opportunities/${id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setServerError(typeof msg === 'string' ? msg : 'Failed to update opportunity.');
    }
  };

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit opportunity</h1>
        <p className="mt-1 text-gray-600">Update your opportunity details.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Edit opportunity form">
          <div className="space-y-5">
            <Select
              label="Opportunity type"
              options={[
                { value: 'BUSINESS', label: 'Business' },
                { value: 'IDEA', label: 'Idea' },
                { value: 'TALENT', label: 'Talent' },
              ]}
              error={errors.type?.message}
              {...register('type')}
            />

            <Input
              label="Title"
              error={errors.title?.message}
              {...register('title')}
            />

            <Textarea
              label="Description"
              rows={5}
              error={errors.description?.message}
              {...register('description')}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Sector / Industry" {...register('sector')} />
              <Input label="Location" {...register('location')} />
            </div>

            <Select
              label="Current stage"
              options={[
                { value: '', label: 'Select stage...' },
                { value: 'IDEA', label: 'Idea' },
                { value: 'EARLY_STAGE', label: 'Early Stage' },
                { value: 'GROWTH', label: 'Growth' },
                { value: 'ESTABLISHED', label: 'Established' },
                { value: 'SEEKING_PARTNER', label: 'Seeking Partner' },
              ]}
              error={errors.stage?.message}
              {...register('stage')}
            />

            <Textarea label="Problem being addressed" rows={3} {...register('problem')} />
            <Textarea label="Solution / Value proposition" rows={3} {...register('solution')} />
            <Textarea label="Goals and development needs" rows={3} {...register('goals')} />
            <Input label="Investment or support required" {...register('supportRequired')} />
            <Textarea label="Use of funds (optional)" rows={2} {...register('useOfFunds')} />

            {serverError && (
              <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" isLoading={isSubmitting}>Save changes</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
