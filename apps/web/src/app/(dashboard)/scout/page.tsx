'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { opportunitiesApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatRelativeDate } from '@/lib/utils';
import type { Opportunity } from '@/types';

export default function ScoutDashboard() {
  const { user } = useAuth();

  const { data: opportunities, isLoading } = useQuery<Opportunity[]>({
    queryKey: ['my-opportunities'],
    queryFn: () => opportunitiesApi.getMyOpportunities(),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Scout Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <Link href="/opportunities/new">
          <Button>+ Introduce opportunity</Button>
        </Link>
      </div>

      <Card className="mb-6 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-700">
          As a Scout, you identify and introduce promising opportunities on behalf of their owners.
          Opportunities you introduce will go through the standard review process before being published.
        </p>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      ) : opportunities?.length === 0 ? (
        <Card className="py-16 text-center">
          <p className="mb-4 text-gray-500">You haven&apos;t introduced any opportunities yet.</p>
          <Link href="/opportunities/new">
            <Button>Introduce your first opportunity</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {opportunities?.map((opp) => (
            <Card key={opp.id}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="mb-1 flex gap-2">
                    <StatusBadge status={opp.status} />
                    <span className="text-xs text-gray-500">{opp.type}</span>
                  </div>
                  <Link href={`/opportunities/${opp.id}`}>
                    <h2 className="font-semibold text-gray-900 hover:text-primary-600">{opp.title}</h2>
                  </Link>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Updated {formatRelativeDate(opp.updatedAt)}
                    {opp.sector && ` · ${opp.sector}`}
                  </p>
                </div>
                <Link href={`/opportunities/${opp.id}`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
