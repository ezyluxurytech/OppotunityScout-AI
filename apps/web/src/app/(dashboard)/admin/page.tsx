'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatRelativeDate } from '@/lib/utils';

type Tab = 'overview' | 'review' | 'users' | 'audit';

export default function AdminDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [reviewFeedback, setReviewFeedback] = useState<Record<string, string>>({});

  const { data: metrics } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: () => adminApi.getMetrics(),
  });

  const { data: reviewQueue, isLoading: reviewLoading } = useQuery({
    queryKey: ['admin-review-queue'],
    queryFn: () => adminApi.getReviewQueue(),
    enabled: activeTab === 'review',
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users', userSearch],
    queryFn: () => adminApi.listUsers({ search: userSearch || undefined }),
    enabled: activeTab === 'users',
  });

  const { data: auditLogs } = useQuery({
    queryKey: ['admin-audit'],
    queryFn: () => adminApi.getAuditLogs(),
    enabled: activeTab === 'audit',
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, action, feedback }: { id: string; action: string; feedback?: string }) =>
      adminApi.reviewOpportunity(id, { action, feedback }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-review-queue'] }),
  });

  const userMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApi.manageUser(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'review', label: 'Review Queue' },
    { key: 'users', label: 'Users' },
    { key: 'audit', label: 'Audit Logs' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-gray-600">Platform management and moderation</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
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

      {/* Overview Tab */}
      {activeTab === 'overview' && metrics && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center">
            <p className="text-3xl font-bold text-primary-600">{metrics.users.total}</p>
            <p className="mt-1 text-sm text-gray-600">Total Users</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-green-600">{metrics.opportunities.total}</p>
            <p className="mt-1 text-sm text-gray-600">Opportunities</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-yellow-600">{metrics.opportunities.pendingReview}</p>
            <p className="mt-1 text-sm text-gray-600">Pending Review</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-accent-500">{metrics.connections.total}</p>
            <p className="mt-1 text-sm text-gray-600">Connections</p>
          </Card>
          {/* Users by role */}
          <Card className="sm:col-span-2">
            <h2 className="mb-3 font-semibold text-gray-900">Users by Role</h2>
            <dl className="space-y-1 text-sm">
              {Object.entries(metrics.users.byRole || {}).map(([role, count]: any) => (
                <div key={role} className="flex justify-between">
                  <dt className="text-gray-600">{role.replace(/_/g, ' ')}</dt>
                  <dd className="font-medium">{count}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card className="sm:col-span-2">
            <h2 className="mb-3 font-semibold text-gray-900">Opportunities by Status</h2>
            <dl className="space-y-1 text-sm">
              {Object.entries(metrics.opportunities.byStatus || {}).map(([status, count]: any) => (
                <div key={status} className="flex justify-between">
                  <dt className="text-gray-600">{status.replace(/_/g, ' ')}</dt>
                  <dd className="font-medium">{count}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      )}

      {/* Review Queue Tab */}
      {activeTab === 'review' && (
        <div>
          {reviewLoading ? (
            <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" /></div>
          ) : reviewQueue?.data?.length === 0 ? (
            <Card className="py-16 text-center">
              <p className="text-green-600 font-medium">✓ Review queue is empty</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviewQueue?.data?.map((opp: any) => (
                <Card key={opp.id}>
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-1 flex gap-2">
                        <StatusBadge status={opp.status} />
                        <span className="text-xs text-gray-500">{opp.type}</span>
                      </div>
                      <h2 className="font-semibold text-gray-900">{opp.title}</h2>
                      <p className="text-xs text-gray-500">
                        by {opp.owner.name} ({opp.owner.email}) · Submitted {formatRelativeDate(opp.submittedAt || opp.createdAt)}
                      </p>
                      {opp.sector && <p className="mt-1 text-xs text-gray-500">Sector: {opp.sector}</p>}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Input
                      placeholder="Optional feedback note..."
                      value={reviewFeedback[opp.id] || ''}
                      onChange={(e) => setReviewFeedback({ ...reviewFeedback, [opp.id]: e.target.value })}
                      className="flex-1"
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => reviewMutation.mutate({ id: opp.id, action: 'SET_UNDER_REVIEW', feedback: reviewFeedback[opp.id] })}
                      variant="secondary"
                    >
                      Mark Under Review
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => reviewMutation.mutate({ id: opp.id, action: 'APPROVE', feedback: reviewFeedback[opp.id] })}
                    >
                      ✓ Approve & Publish
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => reviewMutation.mutate({ id: opp.id, action: 'REQUEST_INFO', feedback: reviewFeedback[opp.id] })}
                    >
                      📋 Request Info
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => reviewMutation.mutate({ id: opp.id, action: 'REJECT', feedback: reviewFeedback[opp.id] })}
                    >
                      ✕ Reject
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div className="mb-4">
            <Input
              placeholder="Search users by name or email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>
          {usersLoading ? (
            <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" /></div>
          ) : (
            <div className="space-y-3">
              {users?.data?.map((u: any) => (
                <Card key={u.id} padding="sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email} · {u.role.replace(/_/g, ' ')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={u.status} />
                      {u.status === 'ACTIVE' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => userMutation.mutate({ id: u.id, status: 'SUSPENDED' })}
                        >
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => userMutation.mutate({ id: u.id, status: 'ACTIVE' })}
                        >
                          Activate
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-2">
          {auditLogs?.data?.map((log: any) => (
            <Card key={log.id} padding="sm">
              <div className="flex items-center justify-between gap-2 text-sm">
                <div>
                  <span className="font-medium text-gray-900">{log.action}</span>
                  <span className="ml-2 text-gray-500">on {log.entityType}</span>
                  {log.actor && <span className="ml-2 text-gray-400">by {log.actor.name}</span>}
                </div>
                <span className="text-xs text-gray-400">{formatRelativeDate(log.createdAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
