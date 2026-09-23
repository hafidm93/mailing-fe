'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import AccessPolicyView from '@/components/admin/AccessPolicyView';

export default function RolesPage() {
  return (
    <AppShell>
      <AccessPolicyView />
    </AppShell>
  );
}
