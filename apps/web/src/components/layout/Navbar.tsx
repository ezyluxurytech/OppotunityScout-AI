'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'OPPORTUNITY_OWNER': return '/dashboard/owner';
      case 'INVESTOR': return '/dashboard/investor';
      case 'SCOUT': return '/dashboard/scout';
      case 'ADMIN': return '/dashboard/admin';
      default: return '/';
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white" role="navigation" aria-label="Main navigation">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="OpportunityScout AI home">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <span className="text-sm font-bold text-white">OS</span>
            </div>
            <span className="text-lg font-bold text-gray-900">OpportunityScout AI</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/opportunities" className="text-sm text-gray-600 hover:text-gray-900">
              Discover
            </Link>

            {isAuthenticated ? (
              <>
                <Link href={getDashboardLink()} className="text-sm text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {user?.name}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Log out
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
