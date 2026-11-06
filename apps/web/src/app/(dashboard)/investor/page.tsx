'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investorApi, connectionApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function InvestorDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'matches' | 'saved' | 'connections'>('matches');

  const { data: matches, isLoading: matchLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: () => investorApi.getMatches(),
  });

  const { data: saved, isLoading: savedLoading } = useQuery({
    queryKey: ['saved'],
    queryFn: () => investorApi.getSaved(),
  });

  const { data: connections, isLoading: connLoading } = useQuery({
    queryKey: ['connections'],
    queryFn: () => connectionApi.list(),
  });

  const withdrawMutation = useMutation({
    mutationFn: (id: string) => connectionApi.update(id, 'WITHDRAW'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['connections'] }),
  });

  const tabs = [
    { key: 'matches', label: 'Recommendations' },
    { key: 'saved', label: 'Saved' },
    { key: 'connections', label: 'Connection Requests' },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investor Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome back, {user?.name}</p>
        </div>
        <Link href="/dashboard/investor/preferences">
          <Button variant="outline" size="sm">⚙️ Preferences</Button>
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
            aria-selected={activeTab === tab.key}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Matches Tab */}
      {activeTab === 'matches' && (
        <div>
          {matches?.disclaimer && (
            <p className="mb-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
              ℹ️ {matches.disclaimer}
            </p>
          )}
          {matchLoading ? (
            <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" /></div>
          ) : matches?.data?.length === 0 ? (
            <Card className="py-16 text-center">
              <p className="text-gray-500">No recommendations yet. Set your investor preferences to see matches.</p>
              <Link href="/dashboard/investor/preferences">
                <Button className="mt-4">Set preferences</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {matches?.data?.map((match: any) => (
                <Card key={match.opportunity.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <StatusBadge status={match.relevanceBand} type="relevance" />
                        <span className="text-xs text-gray-500">Score: {match.score}%</span>
                        <span className="text-xs text-gray-400">{match.opportunity.type}</span>
                      </div>
                      <Link href={`/opportunities/${match.opportunity.id}`}>
                        <h2 className="font-semibold text-gray-900 hover:text-primary-600">
                          {match.opportunity.title}
                        </h2>
                      </Link>
                      <p className="mt-1 text-xs text-gray-500">{match.explanation}</p>
                    </div>
                    <Link href={`/opportunities/${match.opportunity.id}`}>
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Saved Tab */}
      {activeTab === 'saved' && (
        <div>
          {savedLoading ? (
            <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" /></div>
          ) : saved?.length === 0 ? (
            <Card className="py-16 text-center">
              <p className="text-gray-500">No saved opportunities yet. Browse and save opportunities that interest you.</p>
              <Link href="/opportunities">
                <Button className="mt-4">Browse opportunities</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {saved?.map((item: any) => (
                <Card key={item.id}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <Link href={`/opportunities/${item.opportunity.id}`}>
                        <h2 className="font-semibold text-gray-900 hover:text-primary-600">
                          {item.opportunity.title}
                        </h2>
                      </Link>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {item.opportunity.type} {item.opportunity.sector && `· ${item.opportunity.sector}`}
                      </p>
                    </div>
                    <Link href={`/opportunities/${item.opportunity.id}`}>
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <div>
          {connLoading ? (
            <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" /></div>
          ) : connections?.length === 0 ? (
            <Card className="py-16 text-center">
              <p className="text-gray-500">No connection requests yet.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {connections?.map((req: any) => (
                <Card key={req.id}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <StatusBadge status={req.status} type="connection" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {req.opportunity?.title || 'Opportunity'}
                      </p>
                      {req.message && (
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{req.message}</p>
                      )}
                    </div>
                    {req.status === 'PENDING' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => withdrawMutation.mutate(req.id)}
                        isLoading={withdrawMutation.isPending}
                      >
                        Withdraw
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
