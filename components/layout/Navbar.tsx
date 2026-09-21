'use client';

import React, { useState } from 'react';
import { useMailingStore } from '@/lib/store';
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  FolderDot,
  Plus,
  Shield,
  Send,
  UserCheck,
  ChevronDown,
} from 'lucide-react';
import { Role } from '@/types';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenCreateCampaign: () => void;
  onOpenBulkSend: () => void;
}

export default function Navbar({ onToggleSidebar, onOpenCreateCampaign, onOpenBulkSend }: NavbarProps) {
  const {
    currentUser,
    logout,
    projects,
    selectedProjectId,
    setSelectedProjectId,
    isDarkMode,
    toggleDarkMode,
    quickSwitchRole,
    hasPermission,
  } = useMailingStore();

  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const getRoleBadge = (role?: Role) => {
    switch (role) {
      case 'admin':
        return { label: 'Administrator', bg: 'bg-[#edf4fc] text-[#2c558c] border border-[#d6e5f7]' };
      case 'marketing':
        return { label: 'Marketing', bg: 'bg-[#edf4fc] text-[#2c558c] border border-[#d6e5f7]' };
      case 'sales':
        return { label: 'Sales', bg: 'bg-slate-100 text-slate-700 border border-slate-200' };
      default:
        return { label: 'User', bg: 'bg-slate-100 text-slate-700 border border-slate-200' };
    }
  };

  const badge = getRoleBadge(currentUser?.role);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-slate-200 transition-colors">
      {/* Left side: Hamburger & Project selector */}
      <div className="flex items-center gap-3">
        <button
          id="btn-toggle-sidebar"
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project Selector Dropdown */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <FolderDot className="w-3.5 h-3.5 text-[#6094d4]" />
            <span>Filter Proyek:</span>
          </div>
          <select
            id="select-project-filter"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="text-xs sm:text-sm font-medium bg-white border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#6094d4] cursor-pointer"
          >
            <option value="all">Semua Proyek Landing Page</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right side: Quick actions, Theme Toggle, Role Switcher & Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Send Action (Marketing & Admin) */}
        {hasPermission('canSendBulkCampaign') && (
          <button
            id="btn-navbar-bulk-send"
            type="button"
            onClick={onOpenBulkSend}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#6094d4] text-[#335c94] hover:bg-[#edf4fc] transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-[#6094d4]" />
            <span>Kirim Bulk</span>
          </button>
        )}

        {hasPermission('canCreateCampaign') && (
          <button
            id="btn-navbar-create-campaign"
            type="button"
            onClick={onOpenCreateCampaign}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buat Campaign</span>
            <span className="sm:hidden">Buat</span>
          </button>
        )}

        {/* Dark Mode Toggle */}
        <button
          id="btn-toggle-theme"
          type="button"
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
          title={isDarkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Role Quick Switcher dropdown (For demo testing & verification) */}
        <div className="relative">
          <button
            id="btn-role-switcher"
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full cursor-pointer ${badge.bg}`}
            title="Klik untuk simulasi ganti role (RBAC)"
          >
            <Shield className="w-3 h-3 text-[#6094d4]" />
            <span>{badge.label}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-md py-1 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Ganti Role Pengguna
              </div>
              <button
                type="button"
                onClick={() => {
                  quickSwitchRole('admin');
                  setShowRoleMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#f8fafc] flex items-center justify-between text-slate-700"
              >
                <span>Administrator</span>
                {currentUser?.role === 'admin' && <UserCheck className="w-3.5 h-3.5 text-[#6094d4]" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  quickSwitchRole('marketing');
                  setShowRoleMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#f8fafc] flex items-center justify-between text-slate-700"
              >
                <span>Marketing Lead</span>
                {currentUser?.role === 'marketing' && <UserCheck className="w-3.5 h-3.5 text-[#6094d4]" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  quickSwitchRole('sales');
                  setShowRoleMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#f8fafc] flex items-center justify-between text-slate-700"
              >
                <span>Sales Rep</span>
                {currentUser?.role === 'sales' && <UserCheck className="w-3.5 h-3.5 text-[#6094d4]" />}
              </button>
            </div>
          )}
        </div>

        {/* User Info & Logout */}
        <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#6094d4] text-white flex items-center justify-center text-xs font-semibold select-none">
            {currentUser?.name?.substring(0, 2).toUpperCase() || 'US'}
          </div>
          <button
            id="btn-logout"
            type="button"
            onClick={logout}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Keluar (Logout)"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
