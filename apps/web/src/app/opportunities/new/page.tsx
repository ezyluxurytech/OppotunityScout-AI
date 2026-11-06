'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function NewOpportunityPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'BUSINESS' },
  });

  const type = watch('type');

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      const payload = { ...data, stage: data.stage || undefined };
      const opportunity = await opportunitiesApi.create(payload);
      router.push(`/opportunities/${opportunity.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setServerError(typeof msg === 'string' ? msg : 'Failed to create opportunity. Please try again.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create opportunity</h1>
        <p className="mt-2 text-gray-600">
          Describe your business, idea, or talent to attract relevant investors and support.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Create opportunity form">
          <div className="space-y-5">
            <Select
              label="Opportunity type"
              options={[
                { value: 'BUSINESS', label: 'Business — An existing or new business' },
                { value: 'IDEA', label: 'Idea — A concept seeking development support' },
                { value: 'TALENT', label: 'Talent — A person or team seeking development' },
              ]}
              error={errors.type?.message}
              {...register('type')}
            />

            <Input
              label="Title"
              placeholder="e.g. AgriTech Marketplace for Smallholder Farmers"
              error={errors.title?.message}
              {...register('title')}
            />

            <Textarea
              label="Description"
              placeholder="Provide a clear, detailed description of your opportunity..."
              rows={5}
              error={errors.description?.message}
              {...register('description')}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Sector / Industry"
                placeholder="e.g. Agriculture, Technology"
                error={errors.sector?.message}
                {...register('sector')}
              />
              <Input
                label="Location"
                placeholder="e.g. Lagos, Nigeria"
                error={errors.location?.message}
                {...register('location')}
              />
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

            <Textarea
              label="Problem being addressed"
              placeholder="What specific problem does this opportunity solve?"
              rows={3}
              {...register('problem')}
            />

            <Textarea
              label={type === 'TALENT' ? 'Skills and portfolio' : 'Solution / Value proposition'}
              placeholder={type === 'TALENT' ? 'Describe your skills, experience, and portfolio links...' : 'How does your solution address the problem?'}
              rows={3}
              {...register('solution')}
            />

            <Textarea
              label="Goals and development needs"
              placeholder="What do you hope to achieve? What support are you seeking?"
              rows={3}
              {...register('goals')}
            />

            {type !== 'TALENT' && (
              <>
                <Input
                  label="Investment or support required"
                  placeholder="e.g. $50,000 seed funding or strategic partner"
                  {...register('supportRequired')}
                />
                <Textarea
                  label="Use of funds (optional)"
                  placeholder="How will investment be used?"
                  rows={2}
                  {...register('useOfFunds')}
                />
              </>
            )}

            {serverError && (
              <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" isLoading={isSubmitting}>
                Save draft
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
