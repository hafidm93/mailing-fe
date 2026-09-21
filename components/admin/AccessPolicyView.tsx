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
} from 'lucide-react';

export default function AccessPolicyView() {
  const { accessPolicies, updateAccessPolicy, currentUser } = useMailingStore();

  const [localPolicies, setLocalPolicies] = useState<AccessPolicy[]>(accessPolicies);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // RBAC Guard
  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-xl space-y-3">
        <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-800">Akses Dibatasi</h2>
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
      label: 'Melihat Daftar Subscribers',
      desc: 'Membuka tabel data subscriber dan filter status.',
    },
    {
      key: 'canExportSubscribers',
      label: 'Export Data Subscribers (CSV)',
      desc: 'Mengunduh data subscriber ke format spreadsheet.',
    },
    {
      key: 'canAddSubscriber',
      label: 'Tambah Subscriber Manual',
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
      desc: 'Melihat dan mendesain template email visual & MJML.',
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
      label: 'Konfigurasi Server SMTP',
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
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#6094d4]" />
              <span>Matriks Kebijakan Akses (RBAC Policy)</span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#edf4fc] text-[#335c94] border border-[#d6e5f7] font-semibold uppercase">
              Admin Only
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Atur batas kemampuan dan menu yang dapat diakses oleh Administrator, Marketing, dan Sales.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan Kebijakan'}</span>
        </button>
      </div>

      {saveStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Fitur / Hak Akses</th>
                <th className="py-3 px-4 text-center w-36">
                  <div className="text-[#335c94] font-bold">Admin</div>
                  <div className="text-[10px] lowercase text-slate-400 font-normal">
                    Pengelola Sistem
                  </div>
                </th>
                <th className="py-3 px-4 text-center w-36">
                  <div className="text-emerald-700 font-bold">Marketing</div>
                  <div className="text-[10px] lowercase text-slate-400 font-normal">
                    Campaign & Leads
                  </div>
                </th>
                <th className="py-3 px-4 text-center w-36">
                  <div className="text-amber-700 font-bold">Sales</div>
                  <div className="text-[10px] lowercase text-slate-400 font-normal">
                    View Data & Analytics
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionLabels.map((perm) => {
                const adminPolicy = getPolicyForRole('admin');
                const marketingPolicy = getPolicyForRole('marketing');
                const salesPolicy = getPolicyForRole('sales');

                return (
                  <tr
                    key={perm.key}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">
                        {perm.label}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {perm.desc}
                      </div>
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
    </div>
  );
}
