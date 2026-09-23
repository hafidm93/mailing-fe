'use client';

import React, { useState } from 'react';
import { useMailingStore } from '@/lib/store';
import { Building2, Plus, Users, FolderKanban, Calendar, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function OrganizationsView() {
  const { organizations, createOrganization, currentUser } = useMailingStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // RBAC Guard (Admin Only)
  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-xl space-y-3">
        <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-800">Akses Dibatasi</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Menu Organisasi hanya dapat diakses dan dikelola oleh pengguna dengan role Administrator.
        </p>
      </div>
    );
  }

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !domain) return;
    setIsSubmitting(true);
    try {
      await createOrganization({
        name,
        domain: domain.replace(/^https?:\/\//, ''),
      });
      setIsModalOpen(false);
      setName('');
      setDomain('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#6094d4]" />
              <span>Manajemen Organisasi (Holding / Company)</span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#edf4fc] text-[#335c94] border border-[#d6e5f7] font-semibold uppercase">
              Admin Only
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Mengelompokkan hak kelola proyek landing page, anggota tim sales, dan marketing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Organisasi</span>
        </button>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {organizations.map((org) => (
          <div
            key={org.id}
            className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {org.name}
                </h3>
                <div className="text-xs font-mono text-[#335c94] mt-0.5">
                  @{org.domain}
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                Terdaftar
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <div>
                <div className="text-slate-400 text-[10px] font-medium">Anggota</div>
                <div className="font-bold text-slate-800 text-sm">
                  {org.memberCount} user
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] font-medium">Proyek</div>
                <div className="font-bold text-slate-800 text-sm">
                  {org.projectsCount} unit
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] font-medium">Dibuat</div>
                <div className="font-bold text-slate-800 text-xs truncate">
                  {org.createdAt || org.created_at
                    ? new Date(org.createdAt || org.created_at || '').toLocaleDateString('id-ID', {
                        month: 'short',
                        year: 'numeric',
                      })
                    : '-'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Organization Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-800">
              Daftarkan Organisasi Baru
            </h3>
            <p className="text-xs text-slate-500">
              Buat wadah holding atau entitas baru untuk proyek web perusahaan.
            </p>

            <form onSubmit={handleCreateOrg} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Organisasi / Perusahaan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Batavia Media Venture"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Domain Utama *
                </label>
                <input
                  type="text"
                  required
                  placeholder="bataviamedia.co.id"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold bg-[#6094d4] hover:bg-[#5285c5] text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Organisasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
