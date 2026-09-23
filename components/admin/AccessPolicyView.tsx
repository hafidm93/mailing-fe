'use client';

import React, { useState } from 'react';
import { useMailingStore } from '@/lib/store';
import { AccessPolicy, Role } from '@/types';
import {
  ShieldCheck,
  Save,
  CheckCircle2,
  ShieldAlert,
  RotateCcw,
  Shield,
  Key,
  Users2,
  Lock,
} from 'lucide-react';

export default function AccessPolicyView() {
  const {
    accessPolicies,
    updateAccessPolicy,
    currentUser,
    roles,
    permissions,
    rolesPermissions,
    userRoleAssignments,
    users,
    projects,
  } = useMailingStore();

  const [activeTab, setActiveTab] = useState<'matrix' | 'erd'>('matrix');
  const [localPolicies, setLocalPolicies] = useState<AccessPolicy[]>(accessPolicies);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // RBAC Guard
  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-xl space-y-3 font-[family-name:var(--font-roboto)]">
        <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-800 font-[family-name:var(--font-inter)]">Akses Dibatasi</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Pengaturan kebijakan hak akses (Access Policy RBAC) hanya dapat dikelola oleh Administrator sistem.
        </p>
      </div>
    );
  }

  const permissionLabels: { key: keyof AccessPolicy['permissions']; label: string; desc: string }[] = [
    {
      key: 'canViewDashboard',
      label: 'Akses Ringkasan Dashboard',
      desc: 'Melihat metrik analitik total subscriber dan performa open rate.',
    },
    {
      key: 'canViewSubscribers',
      label: 'Melihat Daftar Subscribers & Contacts',
      desc: 'Membuka tabel data subscriber dan filter status.',
    },
    {
      key: 'canExportSubscribers',
      label: 'Export Data Subscribers (CSV)',
      desc: 'Mengunduh data subscriber ke format spreadsheet.',
    },
    {
      key: 'canAddSubscriber',
      label: 'Tambah Subscriber / Contact Manual',
      desc: 'Menambahkan email subscriber baru secara langsung.',
    },
    {
      key: 'canDeleteSubscriber',
      label: 'Hapus Subscriber',
      desc: 'Menghapus data subscriber dari database.',
    },
    {
      key: 'canCreateCampaign',
      label: 'Membuat & Mengedit Campaign',
      desc: 'Menggunakan visual builder email dan simpan draf.',
    },
    {
      key: 'canSendBulkCampaign',
      label: 'Eksekusi Pengiriman Bulk Email',
      desc: 'Mengirim promosi massal melalui antrian backend.',
    },
    {
      key: 'canManageTemplates',
      label: 'Kelola Template Desain Email',
      desc: 'Melihat dan mendesain template email visual & block builder.',
    },
    {
      key: 'canViewProjects',
      label: 'Melihat Daftar Proyek Web',
      desc: 'Membuka daftar landing page dan token integrasi form.',
    },
    {
      key: 'canCreateProject',
      label: 'Tambah Proyek Landing Page',
      desc: 'Mendaftarkan website baru dan kunci API sinkronisasi.',
    },
    {
      key: 'canConfigureSmtp',
      label: 'Konfigurasi Server SMTP & Providers',
      desc: 'Ubah host, port, kredensial, dan test handshake SMTP.',
    },
    {
      key: 'canManageOrganizations',
      label: 'Kelola Organisasi / Holding',
      desc: 'Melihat dan membuat holding company.',
    },
    {
      key: 'canManageUsers',
      label: 'Kelola Akun Staf Dashboard',
      desc: 'Tambah staf baru dan tentukan role mereka.',
    },
    {
      key: 'canEditPolicies',
      label: 'Ubah Kebijakan Akses (RBAC Matrix)',
      desc: 'Mengubah matriks izin untuk setiap role.',
    },
  ];

  const handleToggle = (role: Role, permKey: keyof AccessPolicy['permissions']) => {
    setLocalPolicies((prev) =>
      prev.map((pol) => {
        if (pol.role === role) {
          return {
            ...pol,
            permissions: {
              ...pol.permissions,
              [permKey]: !pol.permissions[permKey],
            },
          };
        }
        return pol;
      })
    );
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      for (const pol of localPolicies) {
        await updateAccessPolicy(pol.role, pol.permissions);
      }
      setSaveStatus('Kebijakan hak akses (RBAC) berhasil diperbarui dan diterapkan ke semua sesi.');
    } catch (e) {
      setSaveStatus('Gagal menyimpan kebijakan.');
    } finally {
      setIsSaving(false);
    }
  };

  const getPolicyForRole = (role: Role) => {
    return localPolicies.find((p) => p.role === role);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2 font-[family-name:var(--font-inter)]">
              <ShieldCheck className="w-5 h-5 text-[#6094d4]" />
              <span>Kebijakan Hak Akses & Matriks RBAC</span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#edf4fc] text-[#335c94] border border-[#d6e5f7] font-semibold uppercase font-mono">
              ERD: roles, permissions & assignments
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-[family-name:var(--font-roboto)]">
            Tentukan otorisasi fitur dan batasan operasional untuk masing-masing peran (Administrator, Marketing, Sales/Viewer).
          </p>
        </div>

        {activeTab === 'matrix' && (
          <div className="flex items-center gap-2 font-[family-name:var(--font-inter)]">
            <button
              type="button"
              onClick={() => setLocalPolicies(accessPolicies)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Kebijakan'}</span>
            </button>
          </div>
        )}
      </div>

      {saveStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-[family-name:var(--font-roboto)]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-[family-name:var(--font-inter)]">
        <button
          type="button"
          onClick={() => setActiveTab('matrix')}
          className={`pb-2.5 px-3 font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'matrix'
              ? 'border-[#6094d4] text-[#335c94]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Matriks Hak Akses (Matrix Policy)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('erd')}
          className={`pb-2.5 px-3 font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'erd'
              ? 'border-[#6094d4] text-[#335c94]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>Tabel Entitas ERD (roles, permissions, assignments)</span>
        </button>
      </div>

      {/* TAB 1: PERMISSION MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden font-[family-name:var(--font-roboto)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px] font-[family-name:var(--font-inter)]">
                <tr>
                  <th className="py-3 px-4">Hak Akses Fitur (Capability)</th>
                  <th className="py-3 px-4 text-center w-28">
                    <div className="text-[#335c94] font-bold">Admin</div>
                    <div className="text-[10px] lowercase text-slate-400 font-normal">Full Control</div>
                  </th>
                  <th className="py-3 px-4 text-center w-28">
                    <div className="text-emerald-700 font-bold">Marketing</div>
                    <div className="text-[10px] lowercase text-slate-400 font-normal">Campaign & Lead</div>
                  </th>
                  <th className="py-3 px-4 text-center w-28">
                    <div className="text-amber-700 font-bold">Sales / Viewer</div>
                    <div className="text-[10px] lowercase text-slate-400 font-normal">View Data</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissionLabels.map((perm) => {
                  const adminPolicy = getPolicyForRole('admin');
                  const marketingPolicy = getPolicyForRole('marketing');
                  const salesPolicy = getPolicyForRole('sales');

                  return (
                    <tr key={perm.key} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 font-[family-name:var(--font-inter)]">{perm.label}</div>
                        <div className="text-[11px] text-slate-500">{perm.desc}</div>
                      </td>

                      {/* Admin Toggle */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={!!adminPolicy?.permissions[perm.key]}
                          onChange={() => handleToggle('admin', perm.key)}
                          className="rounded border-slate-300 text-[#6094d4] focus:ring-[#6094d4] cursor-pointer w-4 h-4 accent-[#6094d4]"
                        />
                      </td>

                      {/* Marketing Toggle */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={!!marketingPolicy?.permissions[perm.key]}
                          onChange={() => handleToggle('marketing', perm.key)}
                          className="rounded border-slate-300 text-[#6094d4] focus:ring-[#6094d4] cursor-pointer w-4 h-4 accent-[#6094d4]"
                        />
                      </td>

                      {/* Sales Toggle */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={!!salesPolicy?.permissions[perm.key]}
                          onChange={() => handleToggle('sales', perm.key)}
                          className="rounded border-slate-300 text-[#6094d4] focus:ring-[#6094d4] cursor-pointer w-4 h-4 accent-[#6094d4]"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ERD ENTITY TABLES */}
      {activeTab === 'erd' && (
        <div className="space-y-6 font-[family-name:var(--font-roboto)]">
          {/* 1. roles table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 font-[family-name:var(--font-inter)] flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#6094d4]" />
                <span>Tabel roles</span>
              </h3>
              <span className="font-mono text-[11px] text-slate-400">Total: {roles.length} roles</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] font-[family-name:var(--font-inter)]">
                  <tr>
                    <th className="py-2.5 px-4">Role ID</th>
                    <th className="py-2.5 px-4">Nama Role</th>
                    <th className="py-2.5 px-4">Deskripsi</th>
                    <th className="py-2.5 px-4">Tanggal Dibuat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {roles.map((r) => (
                    <tr key={r.id} className="hover:bg-[#f8fafc]">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{r.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800 font-[family-name:var(--font-inter)]">{r.name}</td>
                      <td className="py-3 px-4 text-slate-600">{r.description}</td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{new Date(r.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. permissions table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 font-[family-name:var(--font-inter)] flex items-center gap-1.5">
                <Key className="w-4 h-4 text-[#6094d4]" />
                <span>Tabel permissions</span>
              </h3>
              <span className="font-mono text-[11px] text-slate-400">Total: {permissions.length} permissions</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] font-[family-name:var(--font-inter)]">
                  <tr>
                    <th className="py-2.5 px-4">Permission ID</th>
                    <th className="py-2.5 px-4">Nama Permission</th>
                    <th className="py-2.5 px-4">Deskripsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {permissions.map((p) => (
                    <tr key={p.id} className="hover:bg-[#f8fafc]">
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500">{p.id}</td>
                      <td className="py-2.5 px-4 font-mono font-medium text-slate-700">{p.name}</td>
                      <td className="py-2.5 px-4 text-slate-600">{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. user_role_assignments table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 font-[family-name:var(--font-inter)] flex items-center gap-1.5">
                <Users2 className="w-4 h-4 text-[#6094d4]" />
                <span>Tabel user_role_assignments</span>
              </h3>
              <span className="font-mono text-[11px] text-slate-400">Total: {userRoleAssignments.length} assignments</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] font-[family-name:var(--font-inter)]">
                  <tr>
                    <th className="py-2.5 px-4">Pengguna (user_id)</th>
                    <th className="py-2.5 px-4">Role (role_id)</th>
                    <th className="py-2.5 px-4">Scope Proyek (project_id)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userRoleAssignments.map((ura, idx) => {
                    const u = users.find((usr) => usr.id === ura.user_id);
                    const r = roles.find((rol) => rol.id === ura.role_id);
                    const p = projects.find((prj) => prj.id === ura.project_id);
                    return (
                      <tr key={idx} className="hover:bg-[#f8fafc]">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800 font-[family-name:var(--font-inter)]">{u?.name || ura.user_id}</div>
                          <div className="font-mono text-[10px] text-slate-400">{u?.email}</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-[#335c94]">
                          {r?.name || ura.role_id}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {p?.name || (ura.project_id ? ura.project_id : 'Semua Proyek (Global Scope)')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
