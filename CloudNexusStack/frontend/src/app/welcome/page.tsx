'use client';

import { useEffect } from 'react';
import LoginForm from '../../components/login-form';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/auth-store';
import { useTranslation } from '../../i18n/config';

export default function WelcomePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // If user is already authenticated, redirect to home page
    if (isAuthenticated) {
      router.push('/home');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{t('welcome.title')}</h1>
          <p className="text-gray-600 mt-2">{t('welcome.subtitle')}</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}
