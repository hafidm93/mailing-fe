'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import OrganizationsView from '@/components/organizations/OrganizationsView';

export default function OrganizationsPage() {
  return (
    <AppShell>
      <OrganizationsView />
    </AppShell>
  );
}
