'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import UsersView from '@/components/admin/UsersView';

export default function UsersPage() {
  return (
    <AppShell>
      <UsersView />
    </AppShell>
  );
}
