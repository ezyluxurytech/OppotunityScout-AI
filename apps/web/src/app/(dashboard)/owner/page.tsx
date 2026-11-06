'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { opportunitiesApi, connectionApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatRelativeDate } from '@/lib/utils';
import type { Opportunity } from '@/types';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'opportunities' | 'connections'>('opportunities');

  const { data: opportunities, isLoading } = useQuery<Opportunity[]>({
    queryKey: ['my-opportunities'],
    queryFn: () => opportunitiesApi.getMyOpportunities(),
  });

  const { data: connections } = useQuery({
    queryKey: ['connections'],
    queryFn: () => connectionApi.list(),
  });

  const submitMutation = useMutation({
    mutationFn: (id: string) => opportunitiesApi.submit(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-opportunities'] }),
  });

  const analyzeMutation = useMutation({
    mutationFn: (id: string) => opportunitiesApi.requestAnalysis(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-opportunities'] }),
  });

  const acceptMutation = useMutation({
    mutationFn: (id: string) => connectionApi.update(id, 'ACCEPT'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['connections'] }),
  });

  const declineMutation = useMutation({
    mutationFn: (id: string) => connectionApi.update(id, 'DECLINE'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['connections'] }),
  });

  const tabs = [
    { key: 'opportunities', label: 'My Opportunities' },
    { key: 'connections', label: 'Connection Requests' },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <Link href="/opportunities/new">
          <Button>+ New opportunity</Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.key
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
              }`}
            role="tab"
            aria-selected={activeTab === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Opportunities Tab */}
      {activeTab === 'opportunities' && (
        <>
          {isLoading ? (
            <div className="flex justify-center py-20" aria-label="Loading">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
            </div>
          ) : opportunities?.length === 0 ? (
            <Card className="py-16 text-center">
              <p className="mb-4 text-gray-500">You haven&apos;t created any opportunities yet.</p>
              <Link href="/opportunities/new">
                <Button>Create your first opportunity</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {opportunities?.map((opp) => (
                <Card key={opp.id}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <StatusBadge status={opp.status} />
                        <span className="text-xs text-gray-500">{opp.type}</span>
                      </div>
                      <Link href={`/opportunities/${opp.id}`}>
                        <h2 className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-1">
                          {opp.title}
                        </h2>
                      </Link>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                        {opp.sector && <span>{opp.sector}</span>}
                        {opp.location && <span>{opp.location}</span>}
                        <span>Updated {formatRelativeDate(opp.updatedAt)}</span>
                      </div>
                      {opp.reviewFeedback && (
                        <p className="mt-2 rounded bg-yellow-50 px-2 py-1 text-xs text-yellow-700">
                          📋 Reviewer note: {opp.reviewFeedback}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {['DRAFT', 'NEEDS_INFORMATION'].includes(opp.status) && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => submitMutation.mutate(opp.id)}
                            isLoading={submitMutation.isPending}
                          >
                            Submit for review
                          </Button>
                          <Link href={`/opportunities/${opp.id}/edit`}>
                            <Button variant="outline" size="sm">Edit</Button>
                          </Link>
                        </>
                      )}
                      {opp.status === 'PUBLISHED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => analyzeMutation.mutate(opp.id)}
                          isLoading={analyzeMutation.isPending}
                        >
                          ✨ Get AI analysis
                        </Button>
                      )}
                      <Link href={`/opportunities/${opp.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <>
          {connections?.length === 0 ? (
            <Card className="py-16 text-center">
              <p className="text-gray-500">No connection requests yet. Once investors discover your opportunities, they&apos;ll appear here.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {connections?.map((req: any) => (
                <Card key={req.id}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <StatusBadge status={req.status} type="connection" />
                      </div>
                      <Link href={`/opportunities/${req.opportunity?.id}`}>
                        <h2 className="font-semibold text-gray-900 hover:text-primary-600">
                          {req.opportunity?.title || 'Opportunity'}
                        </h2>
                      </Link>
                      <p className="mt-0.5 text-xs text-gray-500">
                        From: {req.investor?.name || 'Anonymous Investor'}
                      </p>
                      {req.message && (
                        <p className="mt-2 rounded bg-gray-50 px-3 py-2 text-sm text-gray-700">
                          &ldquo;{req.message}&rdquo;
                        </p>
                      )}
                    </div>

                    {req.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => acceptMutation.mutate(req.id)}
                          isLoading={acceptMutation.isPending}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => declineMutation.mutate(req.id)}
                          isLoading={declineMutation.isPending}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
