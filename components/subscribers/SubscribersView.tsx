'use client';

import React, { useState, useMemo } from 'react';
import { useMailingStore } from '@/lib/store';
import { Subscriber, SubscriberStatus } from '@/types';
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Mail,
  MoreHorizontal,
  FolderDot,
  Trash2,
  Send,
  Calendar,
  Eye,
  Check,
} from 'lucide-react';

interface SubscribersViewProps {
  onOpenBulkSendWithRecipients?: (selectedIds: string[]) => void;
}

export default function SubscribersView({ onOpenBulkSendWithRecipients }: SubscribersViewProps) {
  const {
    subscribers,
    projects,
    selectedProjectId,
    addSubscriber,
    updateSubscriberStatus,
    deleteSubscriber,
    hasPermission,
  } = useMailingStore();

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>(selectedProjectId || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailSubscriber, setDetailSubscriber] = useState<Subscriber | null>(null);

  // New Subscriber Form State
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newProjectId, setNewProjectId] = useState(projects[0]?.id || '');
  const [newTags, setNewTags] = useState('landing-page, lead');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered subscribers
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((s) => {
      // Status filter
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      // Project filter
      if (projectFilter !== 'all' && s.projectId !== projectFilter) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchEmail = s.email.toLowerCase().includes(q);
        const matchName = s.name.toLowerCase().includes(q);
        const matchTags = s.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchEmail && !matchName && !matchTags) return false;
      }
      return true;
    });
  }, [subscribers, statusFilter, projectFilter, searchQuery]);

  // Select all handler
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredSubscribers.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Add Subscriber Submit
  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    setIsSubmitting(true);
    try {
      await addSubscriber({
        email: newEmail,
        name: newName || newEmail.split('@')[0],
        projectId: newProjectId || projects[0]?.id,
        status: 'subscribed',
        tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      setIsAddModalOpen(false);
      setNewEmail('');
      setNewName('');
      setNewTags('landing-page, lead');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Email', 'Nama', 'Status', 'Proyek', 'Tanggal Join', 'Tags', 'Total Email', 'Open Rate'];
    const rows = filteredSubscribers.map((s) => [
      s.email,
      `"${s.name}"`,
      s.status,
      `"${s.projectName}"`,
      new Date(s.joinedAt).toLocaleDateString(),
      `"${s.tags.join(', ')}"`,
      s.totalEmailsReceived,
      `${s.openRate}%`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `subscribers_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#6094d4]" />
            <span>Manajemen Data Subscribers</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data pengguna yang telah subscribe melalui web landing page terintegrasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasPermission('canExportSubscribers') && (
            <button
              id="btn-export-subscribers"
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-[#edf4fc] hover:border-[#d6e5f7] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#6094d4]" />
              <span>Export CSV</span>
            </button>
          )}

          {hasPermission('canAddSubscriber') && (
            <button
              id="btn-add-subscriber"
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Subscriber</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              id="input-subscriber-search"
              type="text"
              placeholder="Cari email, nama, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              id="filter-subscriber-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4] cursor-pointer"
            >
              <option value="all">Semua Status (Subscribed & Unsub)</option>
              <option value="subscribed">Subscribed (Aktif)</option>
              <option value="unsubscribed">Unsubscribed (Berhenti)</option>
              <option value="bounced">Bounced (Gagal)</option>
            </select>
          </div>

          {/* Project Filter */}
          <div>
            <select
              id="filter-subscriber-project"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4] cursor-pointer"
            >
              <option value="all">Semua Proyek Landing Page</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status count summary pill */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-lg text-xs">
            <span className="text-slate-500">Hasil:</span>
            <span className="font-semibold text-slate-800">
              {filteredSubscribers.length} dari {subscribers.length} data
            </span>
          </div>
        </div>

        {/* Selected Items Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-[#edf4fc] p-2.5 rounded-lg border border-[#d6e5f7]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#6094d4] text-white flex items-center justify-center font-bold text-[10px]">
                {selectedIds.length}
              </span>
              <span className="font-medium text-[#2c558c]">
                subscriber terpilih
              </span>
            </div>
            <div className="flex items-center gap-2">
              {hasPermission('canSendBulkCampaign') && (
                <button
                  type="button"
                  onClick={() => onOpenBulkSendWithRecipients?.(selectedIds)}
                  className="px-2.5 py-1.5 bg-[#6094d4] hover:bg-[#5285c5] text-white rounded font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Kirim Email Khusus</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-200 rounded cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Subscribers Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredSubscribers.length > 0 &&
                      selectedIds.length === filteredSubscribers.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-[#6094d4] focus:ring-[#6094d4] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Email & Nama</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Proyek Asal</th>
                <th className="py-3 px-4">Tags</th>
                <th className="py-3 px-4">Open Rate</th>
                <th className="py-3 px-4">Tanggal Bergabung</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Mail className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-slate-600">
                      Tidak ada data subscriber yang sesuai dengan filter.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Coba ganti filter status atau pencarian email.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => {
                  const isSelected = selectedIds.includes(sub.id);
                  return (
                    <tr
                      key={sub.id}
                      className={`hover:bg-[#f8fafc] transition-colors ${
                        isSelected ? 'bg-[#edf4fc]' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(sub.id)}
                          className="rounded border-slate-300 text-[#6094d4] focus:ring-[#6094d4] cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">
                          {sub.email}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {sub.name}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {sub.status === 'subscribed' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Subscribed</span>
                          </span>
                        )}
                        {sub.status === 'unsubscribed' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            <XCircle className="w-3 h-3" />
                            <span>Unsubscribed</span>
                          </span>
                        )}
                        {sub.status === 'bounced' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Bounced</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {sub.projectName}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {sub.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-[#edf4fc] text-[#2c558c] border border-[#d6e5f7]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        <div className="flex items-center gap-2">
                          <span>{sub.openRate}%</span>
                          <span className="text-[10px] text-slate-400">({sub.totalEmailsReceived} email)</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(sub.joinedAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setDetailSubscriber(sub)}
                            className="p-1 rounded text-slate-400 hover:text-[#6094d4] hover:bg-[#edf4fc] transition-colors"
                            title="Detail Subscriber"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Toggle Status */}
                          <button
                            type="button"
                            onClick={() =>
                              updateSubscriberStatus(
                                sub.id,
                                sub.status === 'subscribed' ? 'unsubscribed' : 'subscribed'
                              )
                            }
                            className="p-1 rounded text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title={
                              sub.status === 'subscribed'
                                ? 'Ubah ke Unsubscribed'
                                : 'Aktifkan kembali sebagai Subscribed'
                            }
                          >
                            {sub.status === 'subscribed' ? (
                              <XCircle className="w-4 h-4" />
                            ) : (
                              <Check className="w-4 h-4 text-emerald-600" />
                            )}
                          </button>

                          {hasPermission('canDeleteSubscriber') && (
                            <button
                              type="button"
                              onClick={() => deleteSubscriber(sub.id)}
                              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Hapus Subscriber"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subscriber Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-800">
              Tambah Data Subscriber Baru
            </h3>
            <p className="text-xs text-slate-500">
              Tambahkan data email pengguna secara manual ke sistem mailing backend.
            </p>

            <form onSubmit={handleAddSubscriber} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Subscriber *
                </label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Nama Pengguna"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Proyek Landing Page Terkait *
                </label>
                <select
                  value={newProjectId}
                  onChange={(e) => setNewProjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tags (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="promo, early-bird, lead"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Subscriber'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscriber Detail Modal */}
      {detailSubscriber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Profil Subscriber
                </h3>
                <p className="text-xs text-slate-500">{detailSubscriber.email}</p>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-semibold uppercase ${
                  detailSubscriber.status === 'subscribed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {detailSubscriber.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#f8fafc] border border-slate-100 rounded-lg">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Nama Lengkap</div>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {detailSubscriber.name}
                </div>
              </div>
              <div className="p-3 bg-[#f8fafc] border border-slate-100 rounded-lg">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Proyek Asal</div>
                <div className="font-semibold text-slate-800 mt-0.5 truncate">
                  {detailSubscriber.projectName}
                </div>
              </div>
              <div className="p-3 bg-[#f8fafc] border border-slate-100 rounded-lg">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Total Email Diterima</div>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {detailSubscriber.totalEmailsReceived} email
                </div>
              </div>
              <div className="p-3 bg-[#f8fafc] border border-slate-100 rounded-lg">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Open Rate Engagement</div>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {detailSubscriber.openRate}%
                </div>
              </div>
            </div>

            {detailSubscriber.bounceReason && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 rounded-lg">
                <span className="font-semibold">Alasan Bounce SMTP: </span>
                {detailSubscriber.bounceReason}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailSubscriber(null)}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
