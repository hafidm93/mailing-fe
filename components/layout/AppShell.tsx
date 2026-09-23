'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import BulkSendModal from '@/components/campaigns/BulkSendModal';
import LoginView from '@/components/auth/LoginView';
import { useMailingStore } from '@/lib/store';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { isAuthenticated } = useMailingStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBulkSendOpen, setIsBulkSendOpen] = useState(false);
  const router = useRouter();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const handleOpenCreateCampaign = () => {
    router.push('/campaigns/new');
  };

  return (
    <div className="min-h-screen bg-white text-slate-700 flex flex-col font-[family-name:var(--font-roboto)]">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onOpenCreateCampaign={handleOpenCreateCampaign}
          onOpenBulkSend={() => setIsBulkSendOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-white max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Bulk Send Modal */}
      <BulkSendModal
        isOpen={isBulkSendOpen}
        onClose={() => setIsBulkSendOpen(false)}
      />
    </div>
  );
}
