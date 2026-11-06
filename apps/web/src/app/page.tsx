import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700">
            <span>✨</span> AI-Powered Opportunity Discovery
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Connecting Ideas, Businesses,{' '}
            <span className="text-primary-600">and Talent</span> with Investors
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            OpportunityScout AI helps opportunity owners present their ideas clearly and helps
            investors discover promising opportunities beyond their existing networks.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg">Start for free</Button>
            </Link>
            <Link href="/opportunities">
              <Button variant="outline" size="lg">Browse opportunities</Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Discovery platform only. Not an investment exchange or financial adviser.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="how-it-works-heading">
        <div className="mx-auto max-w-5xl">
          <h2 id="how-it-works-heading" className="mb-4 text-center text-3xl font-bold text-gray-900">
            How it works
          </h2>
          <p className="mb-12 text-center text-gray-600">
            Three simple steps to connect opportunities with the right investors.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Submit your opportunity',
                description:
                  'Opportunity owners create structured profiles for businesses, ideas, or talents. Our AI helps identify missing information and suggests improvements.',
                icon: '📝',
              },
              {
                step: '02',
                title: 'Get discovered',
                description:
                  'Published opportunities appear in the discovery feed. Investors set preferences and receive AI-assisted recommendations tailored to their criteria.',
                icon: '🔍',
              },
              {
                step: '03',
                title: 'Make the connection',
                description:
                  'Investors send connection requests. Owners review and accept. Both parties track progress through our transparent progress system.',
                icon: '🤝',
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-3 text-3xl" aria-hidden="true">{item.icon}</div>
                <div className="mb-1 text-xs font-bold uppercase tracking-wider text-primary-600">
                  Step {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles section */}
      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="roles-heading">
        <div className="mx-auto max-w-5xl">
          <h2 id="roles-heading" className="mb-12 text-center text-3xl font-bold text-gray-900">
            Built for everyone in the ecosystem
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                role: 'Opportunity Owners',
                description:
                  'Present your business, idea, or talent professionally. Get AI-powered summaries and feedback. Track connection requests and progress.',
                cta: 'Submit an opportunity',
                href: '/register?role=OPPORTUNITY_OWNER',
                color: 'border-primary-200 bg-primary-50',
              },
              {
                role: 'Investors',
                description:
                  'Define your investment preferences. Discover curated opportunities that match your criteria. Connect directly with owners.',
                cta: 'Start discovering',
                href: '/register?role=INVESTOR',
                color: 'border-accent-200 bg-accent-50',
              },
              {
                role: 'Opportunity Scouts',
                description:
                  'Identify and introduce promising opportunities. Help connect great ideas with the right investors.',
                cta: 'Become a scout',
                href: '/register?role=SCOUT',
                color: 'border-green-200 bg-green-50',
              },
              {
                role: 'Administrators',
                description:
                  'Review submissions, manage accounts, moderate content, and ensure platform quality.',
                cta: 'Admin access',
                href: '/login',
                color: 'border-gray-200 bg-gray-50',
              },
            ].map((item) => (
              <div key={item.role} className={`rounded-xl border p-6 ${item.color}`}>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{item.role}</h3>
                <p className="mb-4 text-sm text-gray-600">{item.description}</p>
                <Link href={item.href} className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  {item.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-gray-200 bg-white px-4 py-12 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-sm text-gray-500">
          <p className="mb-2 font-medium text-gray-700">Platform Boundary</p>
          <p>
            OpportunityScout AI is a discovery and introduction platform. It does not execute
            investments, guarantee funding, or provide financial advice. Users and investors remain
            responsible for their own evaluation, due diligence, and decisions.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 px-4 py-8 sm:px-6 lg:px-8" role="contentinfo">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary-600">
                <span className="text-xs font-bold text-white">OS</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">OpportunityScout AI</span>
            </div>
            <nav aria-label="Footer navigation">
              <div className="flex gap-6 text-sm text-gray-500">
                <Link href="/terms" className="hover:text-gray-900">Terms</Link>
                <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
                <Link href="/how-it-works" className="hover:text-gray-900">How it works</Link>
              </div>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
