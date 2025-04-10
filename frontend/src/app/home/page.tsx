'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/auth-store';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { useTranslation } from '../../i18n/config';

export default function HomePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    // If user is not authenticated, redirect to welcome page
    if (!isAuthenticated) {
      router.push('/welcome');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/welcome');
  };

  if (!isAuthenticated || !user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{t('home.welcome')}</CardTitle>
          <CardDescription>
            {t('home.loggedInAs', { name: user.username })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>{t('home.email')}:</strong> {user.email}</p>
            {user.firstName && <p><strong>{t('home.firstName')}:</strong> {user.firstName}</p>}
            {user.lastName && <p><strong>{t('home.lastName')}:</strong> {user.lastName}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogout}>{t('home.logout')}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
