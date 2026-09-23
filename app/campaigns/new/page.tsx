'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import CreateCampaignView from '@/components/campaigns/CreateCampaignView';

export default function NewCampaignPage() {
  return (
    <AppShell>
      <CreateCampaignView />
    </AppShell>
  );
}
