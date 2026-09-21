'use client';

import React, { useState } from 'react';
import { MailingProvider, useMailingStore } from '@/lib/store';
import Navbar from '@/components/layout/Navbar';
import Sidebar, { NavSection } from '@/components/layout/Sidebar';
import LoginForm from '@/components/auth/LoginForm';
import DashboardView from '@/components/dashboard/DashboardView';
import SubscribersView from '@/components/subscribers/SubscribersView';
import CampaignsView from '@/components/campaigns/CampaignsView';
import ProjectsView from '@/components/projects/ProjectsView';
import OrganizationsView from '@/components/organizations/OrganizationsView';
import UsersView from '@/components/admin/UsersView';
import AccessPolicyView from '@/components/admin/AccessPolicyView';
import CreateCampaignView from '@/components/campaigns/CreateCampaignView';
import BulkSendModal from '@/components/campaigns/BulkSendModal';
import { EmailTemplate, Project } from '@/types';

function MainDashboardApp() {
  const { isAuthenticated, currentUser, isLoadingAuth } = useMailingStore();

  // Navigation State
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Campaign Creator State (Full Page)
  const [initialTemplateForCampaign, setInitialTemplateForCampaign] = useState<EmailTemplate | null>(null);
  const [initialProjectForCampaign, setInitialProjectForCampaign] = useState<Project | null>(null);

  const [isBulkSendOpen, setIsBulkSendOpen] = useState(false);
  const [bulkSendRecipientIds, setBulkSendRecipientIds] = useState<string[]>([]);

  // Open campaign creator with optional template (Full Page)
  const handleOpenCreateCampaign = (template?: EmailTemplate) => {
    setInitialTemplateForCampaign(template || null);
    setInitialProjectForCampaign(null);
    setCurrentSection('create-campaign');
  };

  // Open campaign creator for a specific project (Full Page)
  const handleOpenCreateCampaignForProject = (project: Project) => {
    setInitialTemplateForCampaign(null);
    setInitialProjectForCampaign(project);
    setCurrentSection('create-campaign');
  };

  // Open bulk send with specific recipients selected from Subscribers table
  const handleOpenBulkSendWithRecipients = (recipientIds: string[]) => {
    setBulkSendRecipientIds(recipientIds);
    setIsBulkSendOpen(true);
  };

  const handleOpenBulkSend = () => {
    setBulkSendRecipientIds([]);
    setIsBulkSendOpen(true);
  };

  if (isLoadingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#6094d4] border-t-transparent animate-spin" />
          <div className="text-xs font-medium text-slate-500">Memuat Sistem Mailing BE...</div>
        </div>
      </div>
    );
  }

  // If not logged in, show clean login screen
  if (!isAuthenticated || !currentUser) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-700 flex transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenCreateCampaign={() => handleOpenCreateCampaign()}
          onOpenBulkSend={handleOpenBulkSend}
        />

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentSection === 'dashboard' && (
            <DashboardView
              onNavigateToSubscribers={() => setCurrentSection('subscribers')}
              onNavigateToCampaigns={() => setCurrentSection('campaigns')}
              onNavigateToProjects={() => setCurrentSection('projects')}
              onOpenCreateCampaign={() => handleOpenCreateCampaign()}
              onOpenBulkSend={handleOpenBulkSend}
            />
          )}

          {currentSection === 'subscribers' && (
            <SubscribersView
              onOpenBulkSendWithRecipients={handleOpenBulkSendWithRecipients}
            />
          )}

          {(currentSection === 'campaigns' || currentSection === 'templates') && (
            <CampaignsView
              onOpenCreateCampaign={handleOpenCreateCampaign}
              onOpenBulkSend={handleOpenBulkSend}
            />
          )}

          {currentSection === 'projects' && (
            <ProjectsView
              onOpenCreateCampaignForProject={handleOpenCreateCampaignForProject}
            />
          )}

          {currentSection === 'organizations' && <OrganizationsView />}

          {currentSection === 'users' && <UsersView />}

          {currentSection === 'access-policy' && <AccessPolicyView />}

          {currentSection === 'create-campaign' && (
            <CreateCampaignView
              onBack={() => setCurrentSection('campaigns')}
              initialTemplate={initialTemplateForCampaign}
              initialProject={initialProjectForCampaign}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <BulkSendModal
        isOpen={isBulkSendOpen}
        onClose={() => setIsBulkSendOpen(false)}
        preSelectedRecipientIds={bulkSendRecipientIds}
      />
    </div>
  );
}

export default function Page() {
  return (
    <MailingProvider>
      <MainDashboardApp />
    </MailingProvider>
  );
}
