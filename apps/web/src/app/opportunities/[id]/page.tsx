'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { opportunitiesApi, investorApi, connectionApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { formatDate, formatRelativeDate } from '@/lib/utils';
import type { Opportunity, OpportunityAnalysis } from '@/types';

export default function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [connectMsg, setConnectMsg] = useState('');
  const [showConnectForm, setShowConnectForm] = useState(false);

  const { data: opportunity, isLoading } = useQuery<Opportunity>({
    queryKey: ['opportunity', id],
    queryFn: () => opportunitiesApi.getOne(id),
  });

  const { data: analysis } = useQuery<OpportunityAnalysis>({
    queryKey: ['analysis', id],
    queryFn: () => opportunitiesApi.getAnalysis(id),
    enabled: !!opportunity && opportunity.status === 'PUBLISHED',
  });

  const saveOpportunity = useMutation({
    mutationFn: () => investorApi.saveOpportunity(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved'] }),
  });

  const sendConnection = useMutation({
    mutationFn: () => connectionApi.create({ opportunityId: id, message: connectMsg }),
    onSuccess: () => {
      setShowConnectForm(false);
      setConnectMsg('');
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" aria-label="Loading" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Opportunity not found.</p>
      </div>
    );
  }

  const isOwner = user?.id === opportunity.ownerId;
  const isInvestor = user?.role === 'INVESTOR';

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge>{opportunity.type}</Badge>
          {opportunity.stage && <Badge variant="default">{opportunity.stage.replace(/_/g, ' ')}</Badge>}
          <StatusBadge status={opportunity.status} />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{opportunity.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {opportunity.sector && <span>📁 {opportunity.sector}</span>}
          {opportunity.location && <span>📍 {opportunity.location}</span>}
          {opportunity.publishedAt && <span>Published {formatRelativeDate(opportunity.publishedAt)}</span>}
          {opportunity.owner && <span>by {opportunity.owner.name}</span>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {opportunity.summary && (
            <Card>
              <h2 className="mb-2 text-lg font-semibold">Summary</h2>
              <p className="text-gray-700">{opportunity.summary}</p>
            </Card>
          )}

          <Card>
            <h2 className="mb-2 text-lg font-semibold">Description</h2>
            <p className="whitespace-pre-wrap text-gray-700">{opportunity.description}</p>
          </Card>

          {opportunity.problem && (
            <Card>
              <h2 className="mb-2 text-lg font-semibold">Problem</h2>
              <p className="text-gray-700">{opportunity.problem}</p>
            </Card>
          )}

          {opportunity.solution && (
            <Card>
              <h2 className="mb-2 text-lg font-semibold">Solution / Value Proposition</h2>
              <p className="text-gray-700">{opportunity.solution}</p>
            </Card>
          )}

          {opportunity.goals && (
            <Card>
              <h2 className="mb-2 text-lg font-semibold">Goals</h2>
              <p className="text-gray-700">{opportunity.goals}</p>
            </Card>
          )}

          {/* AI Analysis Section */}
          {analysis && (analysis as any).summary && (
            <Card className="border-accent-200 bg-accent-50">
              <div className="mb-3 flex items-center gap-2">
                <span className="ai-badge">✨ AI-Generated Summary</span>
              </div>
              <p className="mb-4 text-gray-700">{(analysis as any).summary}</p>

              {(analysis as any).categories?.length > 0 && (
                <div className="mb-3">
                  <p className="mb-1 text-xs font-medium text-gray-500 uppercase">Categories</p>
                  <div className="flex flex-wrap gap-1">
                    {(analysis as any).categories.map((cat: string) => (
                      <span key={cat} className="rounded-full bg-white px-2 py-0.5 text-xs text-gray-700 border border-gray-200">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 italic">
                {(analysis as any).disclaimer || 'AI-generated. Not independently verified.'}
              </p>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Actions */}
          {isAuthenticated && (
            <Card>
              <h2 className="mb-3 text-base font-semibold">Actions</h2>
              <div className="space-y-2">
                {isInvestor && (
                  <>
                    <Button
                      className="w-full"
                      onClick={() => saveOpportunity.mutate()}
                      isLoading={saveOpportunity.isPending}
                    >
                      💾 Save opportunity
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowConnectForm(!showConnectForm)}
                    >
                      🤝 Request connection
                    </Button>
                    {showConnectForm && (
                      <div className="pt-2">
                        <textarea
                          className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                          rows={3}
                          placeholder="Add an introductory message (optional)..."
                          value={connectMsg}
                          onChange={(e) => setConnectMsg(e.target.value)}
                          maxLength={1000}
                          aria-label="Connection request message"
                        />
                        <Button
                          className="mt-2 w-full"
                          onClick={() => sendConnection.mutate()}
                          isLoading={sendConnection.isPending}
                        >
                          Send request
                        </Button>
                      </div>
                    )}
                  </>
                )}
                {isOwner && (
                  <Link href={`/opportunities/${id}/edit`}>
                    <Button variant="outline" className="w-full">✏️ Edit opportunity</Button>
                  </Link>
                )}
              </div>
            </Card>
          )}

          {/* Details card */}
          <Card>
            <h2 className="mb-3 text-base font-semibold">Details</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Type</dt>
                <dd className="font-medium text-gray-900">{opportunity.type}</dd>
              </div>
              {opportunity.stage && (
                <div>
                  <dt className="text-gray-500">Stage</dt>
                  <dd className="font-medium text-gray-900">{opportunity.stage.replace(/_/g, ' ')}</dd>
                </div>
              )}
              {opportunity.sector && (
                <div>
                  <dt className="text-gray-500">Sector</dt>
                  <dd className="font-medium text-gray-900">{opportunity.sector}</dd>
                </div>
              )}
              {opportunity.location && (
                <div>
                  <dt className="text-gray-500">Location</dt>
                  <dd className="font-medium text-gray-900">{opportunity.location}</dd>
                </div>
              )}
              {opportunity.supportRequired && (
                <div>
                  <dt className="text-gray-500">Support needed</dt>
                  <dd className="font-medium text-gray-900">{opportunity.supportRequired}</dd>
                </div>
              )}
              {opportunity.createdAt && (
                <div>
                  <dt className="text-gray-500">Created</dt>
                  <dd className="text-gray-700">{formatDate(opportunity.createdAt)}</dd>
                </div>
              )}
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
