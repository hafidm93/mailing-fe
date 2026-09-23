'use client';

import React, { useState, useMemo } from 'react';
import { useMailingStore } from '@/lib/store';
import { Contact, MailingList, Subscription, SubscriberStatus, ContactSource } from '@/types';
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
  ListOrdered,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface SubscribersViewProps {
  onOpenBulkSendWithRecipients?: (selectedIds: string[]) => void;
}

export default function SubscribersView({ onOpenBulkSendWithRecipients }: SubscribersViewProps) {
  const {
    contacts,
    subscribers,
    mailingLists,
    subscriptions,
    projects,
    selectedProjectId,
    addContact,
    createMailingList,
    addSubscription,
    updateSubscriberStatus,
    deleteSubscriber,
    hasPermission,
  } = useMailingStore();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'contacts' | 'lists' | 'subscriptions'>('contacts');

  // Filters for Contacts
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>(selectedProjectId || 'all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  // Modals
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isAddListModalOpen, setIsAddListModalOpen] = useState(false);
  const [isAddSubModalOpen, setIsAddSubModalOpen] = useState(false);
  const [detailContact, setDetailContact] = useState<Contact | null>(null);

  // New Contact Form
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newProjectId, setNewProjectId] = useState(projects[0]?.id || '');
  const [newSource, setNewSource] = useState<ContactSource>('web_form');
  const [newTags, setNewTags] = useState('landing-page, lead');
  const [newListAssignmentId, setNewListAssignmentId] = useState(mailingLists[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New List Form
  const [newListName, setNewListName] = useState('');
  const [newListSlug, setNewListSlug] = useState('');
  const [newListProjectId, setNewListProjectId] = useState(projects[0]?.id || '');
  const [newListDescription, setNewListDescription] = useState('');

  // New Subscription Form
  const [newSubContactId, setNewSubContactId] = useState(contacts[0]?.id || '');
  const [newSubListId, setNewSubListId] = useState(mailingLists[0]?.id || '');

  // Filtered Contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      const cPid = c.project_id || c.projectId;
      if (projectFilter !== 'all' && cPid !== projectFilter) return false;
      if (sourceFilter !== 'all' && c.source !== sourceFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchEmail = c.email.toLowerCase().includes(q);
        const matchName = (c.name || '').toLowerCase().includes(q);
        const matchTags = (c.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!matchEmail && !matchName && !matchTags) return false;
      }
      return true;
    });
  }, [contacts, statusFilter, projectFilter, sourceFilter, searchQuery]);

  // Select all handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedContactIds(filteredContacts.map((c) => c.id));
    } else {
      setSelectedContactIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Add Contact Submit
  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    setIsSubmitting(true);
    try {
      const created = await addContact({
        email: newEmail,
        name: newName || newEmail.split('@')[0],
        project_id: newProjectId || projects[0]?.id,
        source: newSource,
        status: 'subscribed',
        tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      });

      // Link to mailing list if selected
      if (newListAssignmentId && created?.id) {
        await addSubscription(created.id, newListAssignmentId);
      }

      setIsAddContactModalOpen(false);
      setNewEmail('');
      setNewName('');
      setNewTags('landing-page, lead');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add List Submit
  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName) return;
    setIsSubmitting(true);
    try {
      await createMailingList({
        name: newListName,
        slug: newListSlug || newListName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        project_id: newListProjectId || projects[0]?.id,
        description: newListDescription,
        status: 'active',
      });
      setIsAddListModalOpen(false);
      setNewListName('');
      setNewListSlug('');
      setNewListDescription('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add Subscription Submit
  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubContactId || !newSubListId) return;
    setIsSubmitting(true);
    try {
      await addSubscription(newSubContactId, newSubListId);
      setIsAddSubModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Email', 'Email Normalized', 'Nama', 'Status', 'Source', 'Proyek', 'Created At', 'Tags'];
    const rows = filteredContacts.map((c) => {
      const proj = projects.find((p) => p.id === c.project_id);
      return [
        c.id,
        c.email,
        c.email_normalized,
        `"${c.name || ''}"`,
        c.status,
        c.source,
        `"${proj?.name || c.project_id}"`,
        c.created_at,
        `"${(c.tags || []).join(', ')}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `contacts_erd_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2 font-[family-name:var(--font-inter)]">
              <Users className="w-5 h-5 text-[#6094d4]" />
              <span>Manajemen Kontak & Daftar Email</span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#edf4fc] text-[#335c94] border border-[#d6e5f7] font-semibold uppercase font-mono">
              ERD: contacts & mailing_lists
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-[family-name:var(--font-roboto)]">
            Data kontak terpusat, pengelompokan segmen mailing list, dan relasi status subscription.
          </p>
        </div>

        <div className="flex items-center gap-2 font-[family-name:var(--font-inter)]">
          {hasPermission('canExportSubscribers') && activeTab === 'contacts' && (
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

          {hasPermission('canAddSubscriber') && activeTab === 'contacts' && (
            <button
              id="btn-add-contact"
              type="button"
              onClick={() => setIsAddContactModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Kontak (Contact)</span>
            </button>
          )}

          {activeTab === 'lists' && (
            <button
              type="button"
              onClick={() => setIsAddListModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Mailing List Baru</span>
            </button>
          )}

          {activeTab === 'subscriptions' && (
            <button
              type="button"
              onClick={() => setIsAddSubModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Assign Subscription Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs matching ERD tables */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-[family-name:var(--font-inter)]">
        <button
          type="button"
          onClick={() => setActiveTab('contacts')}
          className={`pb-2.5 px-3 font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'contacts'
              ? 'border-[#6094d4] text-[#335c94]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Tabel Kontak (contacts: {contacts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lists')}
          className={`pb-2.5 px-3 font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'lists'
              ? 'border-[#6094d4] text-[#335c94]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>Mailing Lists (mailing_lists: {mailingLists.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('subscriptions')}
          className={`pb-2.5 px-3 font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'subscriptions'
              ? 'border-[#6094d4] text-[#335c94]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Status Berlangganan (subscriptions: {subscriptions.length})</span>
        </button>
      </div>

      {/* TAB 1: CONTACTS */}
      {activeTab === 'contacts' && (
        <>
          {/* Filter and Search Bar */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 font-[family-name:var(--font-roboto)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari email, nama, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4] cursor-pointer"
                >
                  <option value="all">Semua Status Kontak</option>
                  <option value="subscribed">Subscribed (Aktif)</option>
                  <option value="unsubscribed">Unsubscribed (Berhenti)</option>
                  <option value="bounced">Bounced (Gagal Kirim)</option>
                  <option value="complaint">Complaint (Spam)</option>
                </select>
              </div>

              {/* Project Filter */}
              <div>
                <select
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4] cursor-pointer"
                >
                  <option value="all">Semua Proyek Terdaftar</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Source Filter */}
              <div>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4] cursor-pointer"
                >
                  <option value="all">Semua Asal Data (Source)</option>
                  <option value="web_form">Web Landing Form</option>
                  <option value="api">REST API</option>
                  <option value="import">CSV / Manual Import</option>
                  <option value="manual">Dashboard Manual</option>
                </select>
              </div>
            </div>

            {/* Bulk Selection Bar */}
            {selectedContactIds.length > 0 && (
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-[#edf4fc] p-2.5 rounded-lg border border-[#d6e5f7]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#6094d4] text-white flex items-center justify-center font-bold text-[10px]">
                    {selectedContactIds.length}
                  </span>
                  <span className="font-semibold text-[#2c558c]">kontak terpilih</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasPermission('canSendBulkCampaign') && (
                    <button
                      type="button"
                      onClick={() => onOpenBulkSendWithRecipients?.(selectedContactIds)}
                      className="px-2.5 py-1.5 bg-[#6094d4] hover:bg-[#5285c5] text-white rounded font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>Kirim Email Massal ke Target</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedContactIds([])}
                    className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-200 rounded cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Contacts Data Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-[family-name:var(--font-roboto)]">
                <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] font-[family-name:var(--font-inter)]">
                  <tr>
                    <th className="py-3 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={filteredContacts.length > 0 && selectedContactIds.length === filteredContacts.length}
                        onChange={handleSelectAll}
                        className="rounded border-slate-300 text-[#6094d4] focus:ring-[#6094d4] cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4">Email & Nama Kontak</th>
                    <th className="py-3 px-4">Normalized Email</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Proyek Asal</th>
                    <th className="py-3 px-4">Mailing Lists</th>
                    <th className="py-3 px-4">Dibuat Pada</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <Mail className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-semibold text-slate-600">Tidak ada kontak yang sesuai filter.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map((contact) => {
                      const isSelected = selectedContactIds.includes(contact.id);
                      const proj = projects.find((p) => p.id === contact.project_id);
                      const contactSubs = subscriptions.filter((s) => s.contact_id === contact.id);
                      const assignedLists = mailingLists.filter((l) =>
                        contactSubs.some((s) => s.mailing_list_id === l.id)
                      );

                      return (
                        <tr
                          key={contact.id}
                          className={`hover:bg-[#f8fafc] transition-colors ${isSelected ? 'bg-[#edf4fc]' : ''}`}
                        >
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(contact.id)}
                              className="rounded border-slate-300 text-[#6094d4] focus:ring-[#6094d4] cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-800">{contact.email}</div>
                            <div className="text-[11px] text-slate-500">{contact.name || '-'}</div>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                            {contact.email_normalized}
                          </td>
                          <td className="py-3 px-4">
                            {contact.status === 'subscribed' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Subscribed</span>
                              </span>
                            )}
                            {contact.status === 'unsubscribed' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                <XCircle className="w-3 h-3" />
                                <span>Unsubscribed</span>
                              </span>
                            )}
                            {contact.status === 'bounced' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Bounced</span>
                              </span>
                            )}
                            {contact.status === 'complaint' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                <span>Complaint</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[11px] px-2 py-0.5 rounded font-mono bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                              {contact.source}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-700 font-medium">
                            {proj?.name || contact.project_id}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {assignedLists.length > 0 ? (
                                assignedLists.map((l) => (
                                  <span
                                    key={l.id}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-[#edf4fc] text-[#335c94] border border-[#d6e5f7] font-medium"
                                  >
                                    {l.name}
                                  </span>
                                ))
                              ) : (
                                <span className="text-slate-400 text-[11px] italic">Belum ada list</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                            {contact.created_at || contact.joinedAt
                              ? new Date(contact.created_at || contact.joinedAt || '').toLocaleDateString()
                              : '-'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setDetailContact(contact)}
                              className="p-1 rounded text-slate-400 hover:text-[#6094d4] hover:bg-[#edf4fc] transition-colors cursor-pointer"
                              title="Lihat Detail Kontak"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: MAILING LISTS */}
      {activeTab === 'lists' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden font-[family-name:var(--font-roboto)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] font-[family-name:var(--font-inter)]">
                <tr>
                  <th className="py-3.5 px-4">Nama List</th>
                  <th className="py-3.5 px-4">Slug Identifier</th>
                  <th className="py-3.5 px-4">Proyek Terkait</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Deskripsi Segmen</th>
                  <th className="py-3.5 px-4">Subscribers Terdaftar</th>
                  <th className="py-3.5 px-4">Tanggal Dibuat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mailingLists.map((list) => {
                  const proj = projects.find((p) => p.id === list.project_id);
                  const memberCount = subscriptions.filter((s) => s.mailing_list_id === list.id && s.status === 'active').length;
                  return (
                    <tr key={list.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 font-[family-name:var(--font-inter)]">{list.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">id: {list.id}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {list.slug}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {proj?.name || list.project_id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {list.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                        {list.description || '-'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <span className="px-2 py-0.5 rounded bg-[#edf4fc] text-[#335c94] border border-[#d6e5f7]">
                          {memberCount} kontak aktif
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {list.created_at || list.createdAt
                          ? new Date(list.created_at || list.createdAt || '').toLocaleDateString()
                          : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SUBSCRIPTIONS */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden font-[family-name:var(--font-roboto)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] font-[family-name:var(--font-inter)]">
                <tr>
                  <th className="py-3.5 px-4">ID Langganan</th>
                  <th className="py-3.5 px-4">Kontak (Email)</th>
                  <th className="py-3.5 px-4">Mailing List Terkait</th>
                  <th className="py-3.5 px-4">Status Langganan</th>
                  <th className="py-3.5 px-4">Tanggal Subscribed</th>
                  <th className="py-3.5 px-4">Tanggal Unsubscribed</th>
                  <th className="py-3.5 px-4">Alasan Berhenti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscriptions.map((sub) => {
                  const contact = contacts.find((c) => c.id === sub.contact_id);
                  const list = mailingLists.find((l) => l.id === sub.mailing_list_id);
                  return (
                    <tr key={sub.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {sub.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {contact?.email || sub.contact_id}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {list?.name || sub.mailing_list_id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            sub.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(sub.subscribed_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {sub.unsubscribed_at ? new Date(sub.unsubscribed_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 italic text-[11px]">
                        {sub.unsubscribe_reason || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Tambah Kontak Baru (contacts) */}
      {isAddContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-[family-name:var(--font-inter)]">
              Tambah Kontak Baru (contacts)
            </h3>
            <p className="text-xs text-slate-500 font-[family-name:var(--font-roboto)]">
              Sesuai skema ERD contacts: email, email_normalized, name, source, project_id, status.
            </p>

            <form onSubmit={handleCreateContact} className="space-y-3 pt-2 font-[family-name:var(--font-roboto)]">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Kontak *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
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
                  placeholder="Budi Setiawan"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Proyek Terkait (project_id) *
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
                  Asal Data (source)
                </label>
                <select
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value as ContactSource)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                >
                  <option value="web_form">Formulir Web Landing Page</option>
                  <option value="api">Integrasi REST API</option>
                  <option value="import">Import Manual / CSV</option>
                  <option value="manual">Manual Admin Entry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Assign ke Mailing List (subscriptions)
                </label>
                <select
                  value={newListAssignmentId}
                  onChange={(e) => setNewListAssignmentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                >
                  <option value="">-- Tanpa List Langsung --</option>
                  {mailingLists.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tags (Pisahkan koma)
                </label>
                <input
                  type="text"
                  placeholder="promo, lead, event"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 font-[family-name:var(--font-inter)]">
                <button
                  type="button"
                  onClick={() => setIsAddContactModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Kontak'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tambah Mailing List (mailing_lists) */}
      {isAddListModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-[family-name:var(--font-inter)]">
              Buat Mailing List Baru
            </h3>
            <p className="text-xs text-slate-500 font-[family-name:var(--font-roboto)]">
              ERD: mailing_lists (name, slug, project_id, description, status).
            </p>

            <form onSubmit={handleCreateList} className="space-y-3 pt-2 font-[family-name:var(--font-roboto)]">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Mailing List *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Newsletter Bulanan"
                  value={newListName}
                  onChange={(e) => {
                    setNewListName(e.target.value);
                    if (!newListSlug) {
                      setNewListSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Slug Identifier *
                </label>
                <input
                  type="text"
                  required
                  placeholder="newsletter-bulanan"
                  value={newListSlug}
                  onChange={(e) => setNewListSlug(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Proyek Terkait
                </label>
                <select
                  value={newListProjectId}
                  onChange={(e) => setNewListProjectId(e.target.value)}
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
                  Deskripsi
                </label>
                <textarea
                  rows={2}
                  placeholder="Segmen pelanggan yang tertarik dengan konten buletin promo."
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 font-[family-name:var(--font-inter)]">
                <button
                  type="button"
                  onClick={() => setIsAddListModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
                >
                  Simpan List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Subscription Baru (subscriptions) */}
      {isAddSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-[family-name:var(--font-inter)]">
              Assign Subscription Baru
            </h3>
            <p className="text-xs text-slate-500 font-[family-name:var(--font-roboto)]">
              Hubungkan kontak dengan target mailing list sesuai tabel subscriptions di ERD.
            </p>

            <form onSubmit={handleCreateSubscription} className="space-y-3 pt-2 font-[family-name:var(--font-roboto)]">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Pilih Kontak (contact_id) *
                </label>
                <select
                  value={newSubContactId}
                  onChange={(e) => setNewSubContactId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                >
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.email} ({c.name || 'Tanpa Nama'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Pilih Mailing List (mailing_list_id) *
                </label>
                <select
                  value={newSubListId}
                  onChange={(e) => setNewSubListId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                >
                  {mailingLists.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 font-[family-name:var(--font-inter)]">
                <button
                  type="button"
                  onClick={() => setIsAddSubModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
                >
                  Simpan Relasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Detail Contact */}
      {detailContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800 font-[family-name:var(--font-inter)]">
                  Detail Data Kontak (contacts)
                </h3>
                <p className="text-xs text-slate-500 font-mono font-[family-name:var(--font-roboto)]">
                  id: {detailContact.id}
                </p>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-semibold uppercase ${
                  detailContact.status === 'subscribed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {detailContact.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-[family-name:var(--font-roboto)]">
              <div className="p-3 bg-[#f8fafc] border border-slate-100 rounded-lg">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Email Asli</div>
                <div className="font-semibold text-slate-800 mt-0.5">{detailContact.email}</div>
              </div>
              <div className="p-3 bg-[#f8fafc] border border-slate-100 rounded-lg">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Normalized Email</div>
                <div className="font-mono text-slate-700 mt-0.5">{detailContact.email_normalized}</div>
              </div>
              <div className="p-3 bg-[#f8fafc] border border-slate-100 rounded-lg">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Nama Lengkap</div>
                <div className="font-semibold text-slate-800 mt-0.5">{detailContact.name || '-'}</div>
              </div>
              <div className="p-3 bg-[#f8fafc] border border-slate-100 rounded-lg">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Source</div>
                <div className="font-mono text-slate-700 mt-0.5 uppercase">{detailContact.source}</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end font-[family-name:var(--font-inter)]">
              <button
                type="button"
                onClick={() => setDetailContact(null)}
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
