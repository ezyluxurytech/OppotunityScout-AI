'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investorApi, profilesApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

export default function InvestorPreferencesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [sectors, setSectors] = useState('');
  const [opportunityTypes, setOpportunityTypes] = useState<string[]>([]);
  const [locations, setLocations] = useState('');
  const [stages, setStages] = useState<string[]>([]);
  const [minInvestment, setMinInvestment] = useState('');
  const [maxInvestment, setMaxInvestment] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  useQuery({
    queryKey: ['investor-preferences'],
    queryFn: async () => {
      const data = await investorApi.getPreferences();
      if (data) {
        setSectors((data.sectors || []).join(', '));
        setOpportunityTypes(data.opportunityTypes || []);
        setLocations((data.locations || []).join(', '));
        setStages(data.stages || []);
        setMinInvestment(data.minInvestment?.toString() || '');
        setMaxInvestment(data.maxInvestment?.toString() || '');
      }
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        sectors: sectors.split(',').map((s) => s.trim()).filter(Boolean),
        opportunityTypes,
        locations: locations.split(',').map((s) => s.trim()).filter(Boolean),
        stages,
        minInvestment: minInvestment ? parseFloat(minInvestment) : undefined,
        maxInvestment: maxInvestment ? parseFloat(maxInvestment) : undefined,
      };
      return investorApi.upsertPreferences(payload);
    },
    onSuccess: () => {
      setSavedMsg('Preferences saved successfully.');
      queryClient.invalidateQueries({ queryKey: ['investor-preferences'] });
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      setTimeout(() => setSavedMsg(''), 3000);
    },
  });

  const toggleArrayValue = (arr: string[], value: string): string[] => {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Investment Preferences</h1>
        <p className="mt-1 text-gray-600">
          Define what you're looking for. We'll use these to recommend relevant opportunities.
        </p>
      </div>

      <Card>
        <div className="space-y-6">
          <Input
            label="Preferred sectors"
            placeholder="Agriculture, Technology, Fintech"
            hint="Comma-separated list of sectors you're interested in."
            value={sectors}
            onChange={(e) => setSectors(e.target.value)}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Opportunity types</label>
            <div className="flex flex-wrap gap-2">
              {['BUSINESS', 'IDEA', 'TALENT'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOpportunityTypes(toggleArrayValue(opportunityTypes, type))}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    opportunityTypes.includes(type)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Preferred locations"
            placeholder="Nigeria, Ghana, Kenya"
            hint="Comma-separated list of locations."
            value={locations}
            onChange={(e) => setLocations(e.target.value)}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Preferred stages</label>
            <div className="flex flex-wrap gap-2">
              {['IDEA', 'EARLY_STAGE', 'GROWTH', 'ESTABLISHED', 'SEEKING_PARTNER'].map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setStages(toggleArrayValue(stages, stage))}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    stages.includes(stage)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {stage.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Minimum investment (optional)"
              type="number"
              placeholder="e.g. 10000"
              value={minInvestment}
              onChange={(e) => setMinInvestment(e.target.value)}
            />
            <Input
              label="Maximum investment (optional)"
              type="number"
              placeholder="e.g. 500000"
              value={maxInvestment}
              onChange={(e) => setMaxInvestment(e.target.value)}
            />
          </div>

          {savedMsg && (
            <div role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {savedMsg}
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={() => saveMutation.mutate()} isLoading={saveMutation.isPending}>
              Save preferences
            </Button>
          </div>
        </div>
      </Card>

      <p className="mt-4 text-xs text-gray-500">
        Match scores are preference-based discovery aids. They do not represent investment suitability or guarantee any outcome.
      </p>
    </div>
  );
}
