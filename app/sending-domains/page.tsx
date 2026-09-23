'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import SendingDomainsView from '@/components/domains/SendingDomainsView';

export default function SendingDomainsPage() {
  return (
    <AppShell>
      <SendingDomainsView />
    </AppShell>
  );
}
