'use client';

import React from 'react';
import { MailingProvider } from '@/lib/store';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <MailingProvider>{children}</MailingProvider>;
}
