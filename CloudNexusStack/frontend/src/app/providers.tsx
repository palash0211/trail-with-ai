'use client';

import React from 'react';
import { I18nProvider } from '../i18n/config';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <I18nProvider>
      {children}
    </I18nProvider>
  );
}

export default Providers;
