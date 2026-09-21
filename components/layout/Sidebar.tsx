'use client';

import React from 'react';
import { useMailingStore } from '@/lib/store';
import {
  LayoutDashboard,
  Users,
  Send,
  FileText,
  FolderKanban,
  Building2,
  UserCog,
  ShieldCheck,
  Mail,
  X,
  Sparkles,
} from 'lucide-react';

export type NavSection =
  | 'dashboard'
  | 'subscribers'
  | 'campaigns'
  | 'templates'
  | 'projects'
  | 'organizations'
  | 'users'
  | 'access-policy'
  | 'create-campaign';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  currentSection,
  onSelectSection,
  isOpen,
  onClose,
}: SidebarProps) {
  const { currentUser, hasPermission } = useMailingStore();

  const isAdmin = currentUser?.role === 'admin';

  interface MenuItem {
    id: NavSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    visible: boolean;
    badge?: string;
  }

  const mainMenuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      visible: hasPermission('canViewDashboard'),
    },
    {
      id: 'subscribers',
      label: 'Data Subscribers',
      icon: Users,
      visible: hasPermission('canViewSubscribers'),
    },
    {
      id: 'campaigns',
      label: 'Campaign Email',
      icon: Send,
      visible: hasPermission('canCreateCampaign') || hasPermission('canSendBulkCampaign'),
    },
    {
      id: 'templates',
      label: 'Template & Builder',
      icon: FileText,
      visible: hasPermission('canManageTemplates'),
    },
    {
      id: 'projects',
      label: 'Proyek & SMTP',
      icon: FolderKanban,
      visible: hasPermission('canViewProjects'),
    },
  ];

  const adminMenuItems: MenuItem[] = [
    {
      id: 'organizations',
      label: 'Organisasi',
      icon: Building2,
      visible: isAdmin,
    },
    {
      id: 'users',
      label: 'Pengguna (Users)',
      icon: UserCog,
      visible: isAdmin,
    },
    {
      id: 'access-policy',
      label: 'Access Policy (RBAC)',
      icon: ShieldCheck,
      visible: isAdmin,
    },
  ];

  const handleItemClick = (section: NavSection) => {
    onSelectSection(section);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#6094d4] text-white flex items-center justify-center font-bold">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-slate-800 flex items-center gap-1.5">
                <span>Mailing</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-sm bg-[#edf4fc] text-[#3e6ba6]">
                  BE Sync
                </span>
              </div>
              <div className="text-[10px] text-slate-400">Marketing & Sales Hub</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Menu Section */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Marketing Menu
            </div>
            <nav className="space-y-1">
              {mainMenuItems
                .filter((item) => item.visible)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    currentSection === item.id ||
                    (currentSection === 'create-campaign' && item.id === 'campaigns');
                  return (
                    <button
                      key={item.id}
                      id={`nav-item-${item.id}`}
                      type="button"
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#edf4fc] text-[#2c558c] font-semibold border border-[#d6e5f7]'
                          : 'text-slate-600 hover:bg-[#f8fafc] hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? 'text-[#6094d4]' : 'text-slate-400'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-[#6094d4] text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
            </nav>
          </div>

          {/* Admin Management Section (Admin Only) */}
          {isAdmin && (
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Administrator</span>
                <span className="text-[9px] px-1 bg-[#edf4fc] text-[#3e6ba6] rounded font-medium">
                  Admin Only
                </span>
              </div>
              <nav className="space-y-1">
                {adminMenuItems
                  .filter((item) => item.visible)
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = currentSection === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`nav-item-${item.id}`}
                        type="button"
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#edf4fc] text-[#2c558c] font-semibold border border-[#d6e5f7]'
                            : 'text-slate-600 hover:bg-[#f8fafc] hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 ${
                              isActive ? 'text-[#6094d4]' : 'text-slate-400'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
              </nav>
            </div>
          )}

          {/* Visual Helper Notice */}
          <div className="mx-2 p-3 rounded-lg bg-[#f8fafc] border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#6094d4]" />
              <span>Async Mailing BE</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Semua dispatch email dan sinkronisasi subscriber diproses secara asynchronous.
            </p>
          </div>
        </div>

        {/* Current User Role Footer */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-7 h-7 rounded-md bg-[#6094d4] text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {currentUser?.name?.substring(0, 1) || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-800 truncate">
                {currentUser?.name || 'User'}
              </div>
              <div className="text-[10px] text-slate-400 capitalize">
                Role: {currentUser?.role}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
