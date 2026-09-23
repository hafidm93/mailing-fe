'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import CampaignsView from '@/components/campaigns/CampaignsView';

export default function CampaignsPage() {
  return (
    <AppShell>
      <CampaignsView />
    </AppShell>
  );
}
