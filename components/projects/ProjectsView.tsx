'use client';

import React, { useState } from 'react';
import { useMailingStore } from '@/lib/store';
import { Project, ProjectKey } from '@/types';
import SmtpModal from './SmtpModal';
import {
  FolderKanban,
  Plus,
  Server,
  Globe,
  Users,
  Send,
  Code,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Shield,
  Key,
  ListOrdered,
  Clock,
  Trash2,
} from 'lucide-react';

interface ProjectsViewProps {
  onOpenCreateCampaignForProject?: (project: Project) => void;
}

export default function ProjectsView({ onOpenCreateCampaignForProject }: ProjectsViewProps) {
  const {
    projects,
    createProject,
    organizations,
    projectKeys,
    createProjectKey,
    revokeProjectKey,
    mailingLists,
    hasPermission,
  } = useMailingStore();

  const [activeTab, setActiveTab] = useState<'projects' | 'keys' | 'lists'>('projects');

  const [selectedProjectForSmtp, setSelectedProjectForSmtp] = useState<Project | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateKeyModalOpen, setIsCreateKeyModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeSnippetProject, setActiveSnippetProject] = useState<Project | null>(null);

  // New Project Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id || 'org-1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Key Form
  const [keyName, setKeyName] = useState('');
  const [keyProjectId, setKeyProjectId] = useState(projects[0]?.id || '');

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setIsSubmitting(true);
    try {
      await createProject({
        name,
        description,
        websiteUrl: websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`,
        organizationId,
      });
      setIsCreateModalOpen(false);
      setName('');
      setDescription('');
      setWebsiteUrl('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName) return;
    try {
      await createProjectKey({
        name: keyName,
        project_id: keyProjectId || projects[0]?.id || 'prj-saas',
        projectId: keyProjectId || projects[0]?.id || 'prj-saas',
        status: 'active',
      });
      setIsCreateKeyModalOpen(false);
      setKeyName('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2 font-[family-name:var(--font-inter)]">
              <FolderKanban className="w-5 h-5 text-[#6094d4]" />
              <span>Proyek, Project Keys & Integrasi</span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#edf4fc] text-[#335c94] border border-[#d6e5f7] font-semibold uppercase font-mono">
              ERD: projects & project_keys
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-[family-name:var(--font-roboto)]">
            Kelola koneksi web landing page perusahaan, kredensial SMTP, dan kunci API sinkronisasi.
          </p>
        </div>

        <div className="flex items-center gap-2 font-[family-name:var(--font-inter)]">
          {activeTab === 'projects' && hasPermission('canCreateProject') && (
            <button
              id="btn-add-project"
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Proyek Baru</span>
            </button>
          )}

          {activeTab === 'keys' && (
            <button
              type="button"
              onClick={() => setIsCreateKeyModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate Project Key</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-[family-name:var(--font-inter)]">
        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`pb-2.5 px-3 font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'projects'
              ? 'border-[#6094d4] text-[#335c94]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderKanban className="w-3.5 h-3.5" />
          <span>Proyek Landing Page ({projects.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('keys')}
          className={`pb-2.5 px-3 font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'keys'
              ? 'border-[#6094d4] text-[#335c94]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>API Keys (project_keys: {projectKeys.length})</span>
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
          <span>Mailing Lists Proyek ({mailingLists.length})</span>
        </button>
      </div>

      {/* TAB 1: PROJECTS */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-[family-name:var(--font-roboto)]">
          {projects.map((proj) => {
            const isSmtpVerified = !!proj.smtp?.isVerified;
            return (
              <div
                key={proj.id}
                className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#6094d4] transition-colors"
              >
                <div>
                  {/* Title & Status */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 font-[family-name:var(--font-inter)]">
                        {proj.name}
                      </h3>
                      <a
                        href={proj.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#335c94] hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Globe className="w-3 h-3 text-[#6094d4]" />
                        <span>{proj.websiteUrl}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                      </a>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold uppercase ${
                        isSmtpVerified
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {isSmtpVerified ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      <span>{isSmtpVerified ? 'SMTP Terhubung' : 'SMTP Belum Verif'}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {proj.description || 'Proyek landing page yang mengumpulkan lead subscriber baru.'}
                  </p>

                  {/* Metrics Stats */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#6094d4]" />
                      <div>
                        <div className="font-bold text-slate-800">
                          {proj.subscriberCount}
                        </div>
                        <div className="text-[10px] text-slate-400">Total Subscribers</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-[#6094d4]" />
                      <div>
                        <div className="font-bold text-slate-800">
                          {proj.activeCampaignsCount}
                        </div>
                        <div className="text-[10px] text-slate-400">Campaign Aktif</div>
                      </div>
                    </div>
                  </div>

                  {/* API Key Box */}
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                      <span className="font-medium flex items-center gap-1">
                        <Code className="w-3.5 h-3.5 text-[#6094d4]" />
                        <span>Public API Key Sinkronisasi</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(proj.apiKey || `pk_live_${proj.id}`, proj.id)}
                        className="text-[11px] text-[#335c94] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedKey === proj.id ? 'Tersalin!' : 'Salin Key'}</span>
                      </button>
                    </div>
                    <code className="block p-1.5 bg-white border border-slate-200 rounded text-[11px] font-mono text-slate-700 truncate">
                      {proj.apiKey || `pk_live_${proj.id}`}
                    </code>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs font-[family-name:var(--font-inter)]">
                  <button
                    type="button"
                    onClick={() => setSelectedProjectForSmtp(proj)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-[#edf4fc] hover:border-[#d6e5f7] transition-colors cursor-pointer"
                  >
                    <Server className="w-3.5 h-3.5 text-[#6094d4]" />
                    <span>Konfigurasi SMTP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSnippetProject(proj)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Kode Integrasi HTML</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: PROJECT KEYS (project_keys) */}
      {activeTab === 'keys' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden font-[family-name:var(--font-roboto)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] font-[family-name:var(--font-inter)]">
                <tr>
                  <th className="py-3.5 px-4">Nama Key</th>
                  <th className="py-3.5 px-4">Key Hash (Masked)</th>
                  <th className="py-3.5 px-4">Proyek Terkait</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Terakhir Digunakan</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projectKeys.map((pk) => {
                  const proj = projects.find((p) => p.id === pk.projectId);
                  return (
                    <tr key={pk.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 font-[family-name:var(--font-inter)]">{pk.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">id: {pk.id}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {pk.keyHash}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {proj?.name || pk.projectId}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            pk.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {pk.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {pk.lastUsedAt ? new Date(pk.lastUsedAt).toLocaleDateString() : 'Belum pernah'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {pk.status === 'active' && (
                          <button
                            type="button"
                            onClick={() => revokeProjectKey(pk.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Revoke / Nonaktifkan Key"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MAILING LISTS PROYEK */}
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
                  <th className="py-3.5 px-4">Deskripsi</th>
                  <th className="py-3.5 px-4">Tanggal Dibuat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mailingLists.map((list) => {
                  const proj = projects.find((p) => p.id === list.project_id);
                  return (
                    <tr key={list.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-800 font-[family-name:var(--font-inter)]">
                        {list.name}
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
                      <td className="py-3.5 px-4 text-slate-500 max-w-sm truncate">
                        {list.description || '-'}
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

      {/* Integration Code Snippet Modal */}
      {activeSnippetProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800 font-[family-name:var(--font-inter)]">
                Integrasi Landing Page: {activeSnippetProject.name}
              </h3>
              <button
                type="button"
                onClick={() => setActiveSnippetProject(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-500 font-[family-name:var(--font-roboto)]">
              Sisipkan script form subscribe berikut di landing page proyek Anda:
            </p>

            <pre className="p-3 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre">
{`<form action="https://api.mailing.io/v1/subscribe" method="POST">
  <input type="hidden" name="project_key" value="${activeSnippetProject.apiKey || `pk_live_${activeSnippetProject.id}`}" />
  <input type="email" name="email" required placeholder="Masukkan email Anda" />
  <button type="submit">Subscribe</button>
</form>`}
            </pre>

            <div className="flex justify-end gap-2 pt-2 font-[family-name:var(--font-inter)]">
              <button
                type="button"
                onClick={() => handleCopy(`<form action="https://api.mailing.io/v1/subscribe" method="POST">\n  <input type="hidden" name="project_key" value="${activeSnippetProject.apiKey || `pk_live_${activeSnippetProject.id}`}" />\n  <input type="email" name="email" required placeholder="Masukkan email Anda" />\n  <button type="submit">Subscribe</button>\n</form>`, 'snippet')}
                className="px-3.5 py-2 text-xs font-semibold bg-[#6094d4] hover:bg-[#5285c5] text-white rounded-lg cursor-pointer shadow-xs"
              >
                {copiedKey === 'snippet' ? 'Tersalin ke Clipboard!' : 'Salin Kode'}
              </button>
              <button
                type="button"
                onClick={() => setActiveSnippetProject(null)}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-[family-name:var(--font-inter)]">
              Tambah Proyek Landing Page Baru
            </h3>
            <p className="text-xs text-slate-500 font-[family-name:var(--font-roboto)]">
              Daftarkan proyek baru untuk mengintegrasikan form subscriber dan konfigurasi SMTP.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-3 pt-2 font-[family-name:var(--font-roboto)]">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Proyek *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: FinTech Mobile App"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  URL Website / Landing Page
                </label>
                <input
                  type="text"
                  placeholder="https://finedge.app"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Deskripsi Proyek
                </label>
                <textarea
                  rows={2}
                  placeholder="Fokus kampanye atau deskripsi landing page..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Organisasi Pemilik *
                </label>
                <select
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 font-[family-name:var(--font-inter)]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold bg-[#6094d4] hover:bg-[#5285c5] text-white rounded-lg cursor-pointer shadow-xs"
                >
                  {isSubmitting ? 'Membuat...' : 'Buat Proyek'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Key Modal */}
      {isCreateKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-[family-name:var(--font-inter)]">
              Generate Project Key Baru
            </h3>
            <p className="text-xs text-slate-500 font-[family-name:var(--font-roboto)]">
              ERD: project_keys (name, project_id, key_hash, status).
            </p>

            <form onSubmit={handleCreateKey} className="space-y-3 pt-2 font-[family-name:var(--font-roboto)]">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Key Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Production Web Server Form"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Proyek Terkait
                </label>
                <select
                  value={keyProjectId}
                  onChange={(e) => setKeyProjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 font-[family-name:var(--font-inter)]">
                <button
                  type="button"
                  onClick={() => setIsCreateKeyModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-[#6094d4] hover:bg-[#5285c5] text-white rounded-lg cursor-pointer shadow-xs"
                >
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SMTP Config Modal */}
      {selectedProjectForSmtp && (
        <SmtpModal
          isOpen={!!selectedProjectForSmtp}
          onClose={() => setSelectedProjectForSmtp(null)}
          project={selectedProjectForSmtp}
        />
      )}
    </div>
  );
}
