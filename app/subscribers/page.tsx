'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import SubscribersView from '@/components/subscribers/SubscribersView';

export default function SubscribersPage() {
  return (
    <AppShell>
      <SubscribersView />
    </AppShell>
  );
}
