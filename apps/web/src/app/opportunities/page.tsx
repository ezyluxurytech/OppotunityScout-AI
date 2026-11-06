'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { opportunitiesApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatRelativeDate } from '@/lib/utils';
import type { Opportunity, PaginatedResponse } from '@/types';

const TYPE_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'IDEA', label: 'Idea' },
  { value: 'TALENT', label: 'Talent' },
];

const STAGE_OPTIONS = [
  { value: '', label: 'All stages' },
  { value: 'IDEA', label: 'Idea' },
  { value: 'EARLY_STAGE', label: 'Early Stage' },
  { value: 'GROWTH', label: 'Growth' },
  { value: 'ESTABLISHED', label: 'Established' },
  { value: 'SEEKING_PARTNER', label: 'Seeking Partner' },
];

export default function DiscoverPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [stage, setStage] = useState('');
  const [sector, setSector] = useState('');
  const [page, setPage] = useState(1);

  const params = {
    search: search || undefined,
    type: type || undefined,
    stage: stage || undefined,
    sector: sector || undefined,
    page,
    limit: 12,
  };

  const { data, isLoading } = useQuery<PaginatedResponse<Opportunity>>({
    queryKey: ['opportunities', params],
    queryFn: () => opportunitiesApi.discover(params),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discover Opportunities</h1>
        <p className="mt-2 text-gray-600">
          Browse published businesses, ideas, and talents seeking investment or support.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          label="Search"
          placeholder="Search opportunities..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <Select
          label="Type"
          options={TYPE_OPTIONS}
          value={type}
          onChange={(e) => { setType(e.target.value); setPage(1); }}
        />
        <Select
          label="Stage"
          options={STAGE_OPTIONS}
          value={stage}
          onChange={(e) => { setStage(e.target.value); setPage(1); }}
        />
        <Input
          label="Sector"
          placeholder="e.g. Agriculture"
          value={sector}
          onChange={(e) => { setSector(e.target.value); setPage(1); }}
        />
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20" aria-label="Loading opportunities">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      ) : data?.data.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-20 text-center">
          <p className="text-gray-500">No opportunities found matching your criteria.</p>
          <Button variant="ghost" className="mt-4" onClick={() => { setSearch(''); setType(''); setStage(''); setSector(''); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.data.map((opp) => (
              <Link key={opp.id} href={`/opportunities/${opp.id}`}>
                <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                        {opp.type}
                      </span>
                      {opp.stage && (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                          {opp.stage.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <h2 className="mb-2 text-base font-semibold text-gray-900 line-clamp-2">{opp.title}</h2>
                  {opp.summary && (
                    <p className="mb-3 text-sm text-gray-600 line-clamp-3">{opp.summary}</p>
                  )}
                  <div className="mt-auto flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    {opp.sector && <span>📁 {opp.sector}</span>}
                    {opp.location && <span>📍 {opp.location}</span>}
                    {opp.publishedAt && <span>🕐 {formatRelativeDate(opp.publishedAt)}</span>}
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {data && data.meta.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {data.meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.meta.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
