'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Globe,
  Radio,
} from 'lucide-react';

export type NavSection =
  | 'dashboard'
  | 'subscribers'
  | 'campaigns'
  | 'templates'
  | 'projects'
  | 'sending-domains'
  | 'organizations'
  | 'users'
  | 'access-policy'
  | 'create-campaign';

interface SidebarProps {
  currentSection?: NavSection;
  onSelectSection?: (section: NavSection) => void;
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
  const pathname = usePathname();

  const isAdmin = currentUser?.role === 'admin';

  interface MenuItem {
    id: NavSection;
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    visible: boolean;
    badge?: string;
    sublabel?: string;
  }

  const mainMenuItems: MenuItem[] = [
    {
      id: 'dashboard',
      href: '/home',
      label: 'Dashboard',
      icon: LayoutDashboard,
      visible: hasPermission('canViewDashboard'),
      sublabel: 'Metriks & Ringkasan',
    },
    {
      id: 'subscribers',
      href: '/subscribers',
      label: 'Contacts & Lists',
      icon: Users,
      visible: hasPermission('canViewSubscribers'),
      sublabel: 'contacts & mailing_lists',
    },
    {
      id: 'campaigns',
      href: '/campaigns',
      label: 'Campaign Email',
      icon: Send,
      visible: hasPermission('canCreateCampaign') || hasPermission('canSendBulkCampaign'),
      sublabel: 'campaigns & recipients',
    },
    {
      id: 'templates',
      href: '/templates',
      label: 'Template & Builder',
      icon: FileText,
      visible: hasPermission('canManageTemplates'),
      sublabel: 'email_templates',
    },
    {
      id: 'projects',
      href: '/projects',
      label: 'Proyek & Integrasi',
      icon: FolderKanban,
      visible: hasPermission('canViewProjects'),
      sublabel: 'projects & project_keys',
    },
    {
      id: 'sending-domains',
      href: '/sending-domains',
      label: 'Sending Domains',
      icon: Globe,
      visible: hasPermission('canViewProjects') || isAdmin,
      sublabel: 'domains & identities',
    },
  ];

  const adminMenuItems: MenuItem[] = [
    {
      id: 'organizations',
      href: '/organizations',
      label: 'Organisasi',
      icon: Building2,
      visible: isAdmin,
      sublabel: 'organization',
    },
    {
      id: 'users',
      href: '/users',
      label: 'Pengguna & Sesi',
      icon: UserCog,
      visible: isAdmin,
      sublabel: 'users & user_sessions',
    },
    {
      id: 'access-policy',
      href: '/roles',
      label: 'Roles & RBAC',
      icon: ShieldCheck,
      visible: isAdmin,
      sublabel: 'roles & permissions',
    },
  ];

  const isItemActive = (item: MenuItem) => {
    if (pathname) {
      if (item.href === '/home' && (pathname === '/home' || pathname === '/')) return true;
      if (item.href === '/subscribers' && (pathname === '/subscribers' || pathname.startsWith('/subscribers') || pathname.startsWith('/contacts'))) return true;
      if (item.href === '/campaigns' && (pathname === '/campaigns' || pathname.startsWith('/campaigns'))) return true;
      if (item.href === '/templates' && (pathname === '/templates' || pathname.startsWith('/templates'))) return true;
      if (item.href === '/projects' && (pathname === '/projects' || pathname.startsWith('/projects'))) return true;
      if (item.href === '/sending-domains' && (pathname === '/sending-domains' || pathname.startsWith('/sending-domains'))) return true;
      if (item.href === '/organizations' && (pathname === '/organizations' || pathname.startsWith('/organizations'))) return true;
      if (item.href === '/users' && (pathname === '/users' || pathname.startsWith('/users'))) return true;
      if (item.href === '/roles' && (pathname === '/roles' || pathname.startsWith('/roles') || pathname.startsWith('/access-policy'))) return true;
    }
    if (currentSection) {
      if (currentSection === item.id) return true;
      if (currentSection === 'create-campaign' && item.id === 'campaigns') return true;
    }
    return false;
  };

  const handleNavClick = (item: MenuItem) => {
    if (onSelectSection) {
      onSelectSection(item.id);
    }
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
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
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200 bg-white">
          <Link
            href="/home"
            onClick={onClose}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#6094d4] text-white flex items-center justify-center font-bold shadow-xs">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-slate-800 flex items-center gap-1.5 font-[family-name:var(--font-inter)]">
                <span>Mailing</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-sm bg-[#edf4fc] text-[#335c94] border border-[#d6e5f7]">
                  ERD v1
                </span>
              </div>
              <div className="text-[10px] text-slate-400">Marketing & System Hub</div>
            </div>
          </Link>
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
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-[family-name:var(--font-inter)]">
              Menu Utama
            </div>
            <nav className="space-y-1">
              {mainMenuItems
                .filter((item) => item.visible)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = isItemActive(item);
                  return (
                    <Link
                      key={item.id}
                      id={`nav-item-${item.id}`}
                      href={item.href}
                      onClick={() => handleNavClick(item)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#edf4fc] text-[#335c94] font-semibold border border-[#d6e5f7]'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-[#6094d4]' : 'text-slate-400'
                          }`}
                        />
                        <div className="text-left">
                          <span className="block leading-tight">{item.label}</span>
                          {item.sublabel && (
                            <span className="text-[10px] font-normal text-slate-400 block leading-none mt-0.5 font-mono">
                              {item.sublabel}
                            </span>
                          )}
                        </div>
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
                    </Link>
                  );
                })}
            </nav>
          </div>

          {/* Admin Management Section (Admin Only) */}
          {isAdmin && (
            <div>
              <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between font-[family-name:var(--font-inter)]">
                <span>Kelola Sistem</span>
                <span className="text-[9px] px-1 bg-[#edf4fc] text-[#335c94] rounded font-medium border border-[#d6e5f7]">
                  Admin
                </span>
              </div>
              <nav className="space-y-1">
                {adminMenuItems
                  .filter((item) => item.visible)
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = isItemActive(item);
                    return (
                      <Link
                        key={item.id}
                        id={`nav-item-${item.id}`}
                        href={item.href}
                        onClick={() => handleNavClick(item)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${
                          isActive
                            ? 'bg-[#edf4fc] text-[#335c94] font-semibold border border-[#d6e5f7]'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-[#6094d4]' : 'text-slate-400'
                            }`}
                          />
                          <div className="text-left">
                            <span className="block leading-tight">{item.label}</span>
                            {item.sublabel && (
                              <span className="text-[10px] font-normal text-slate-400 block leading-none mt-0.5 font-mono">
                                {item.sublabel}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
              </nav>
            </div>
          )}
        </div>

        {/* Footer / User Profile Summary */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full bg-[#6094d4] text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
              {currentUser?.full_name?.charAt(0) || currentUser?.username?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold text-slate-800 truncate">
                {currentUser?.full_name || currentUser?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-slate-500 font-mono truncate">
                {currentUser?.email_normalized || currentUser?.email || 'admin@domain.com'}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
