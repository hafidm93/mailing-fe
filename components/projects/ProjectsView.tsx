'use client';

import React, { useState } from 'react';
import { useMailingStore } from '@/lib/store';
import { Project } from '@/types';
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
} from 'lucide-react';

interface ProjectsViewProps {
  onOpenCreateCampaignForProject?: (project: Project) => void;
}

export default function ProjectsView({ onOpenCreateCampaignForProject }: ProjectsViewProps) {
  const { projects, createProject, organizations, hasPermission } = useMailingStore();

  const [selectedProjectForSmtp, setSelectedProjectForSmtp] = useState<Project | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeSnippetProject, setActiveSnippetProject] = useState<Project | null>(null);

  // New Project Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id || 'org-1');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-[#6094d4]" />
            <span>Daftar Proyek & Integrasi Landing Page</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola koneksi web landing page perusahaan, kredensial SMTP, dan kunci API sinkronisasi.
          </p>
        </div>

        {hasPermission('canCreateProject') && (
          <button
            id="btn-add-project"
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Proyek Baru</span>
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((proj) => {
          const isSmtpVerified = proj.smtp.isVerified;
          return (
            <div
              key={proj.id}
              className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#6094d4] transition-colors"
            >
              <div>
                {/* Title & Status */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">
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

                {/* API Key Snippet */}
                <div className="mt-3 flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono">
                  <span className="text-slate-500 truncate mr-2">API Key: {proj.apiKey}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(proj.apiKey, proj.id)}
                    className="text-[#335c94] hover:text-[#2c558c] flex items-center gap-1 font-sans text-xs cursor-pointer shrink-0 font-medium"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedKey === proj.id ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSnippetProject(proj)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#335c94] cursor-pointer"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Kode Integrasi Form</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProjectForSmtp(proj)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-[#edf4fc] hover:text-[#335c94] cursor-pointer"
                  >
                    <Server className="w-3.5 h-3.5 text-[#6094d4]" />
                    <span>Setup SMTP</span>
                  </button>

                  {hasPermission('canCreateCampaign') && (
                    <button
                      type="button"
                      onClick={() => onOpenCreateCampaignForProject?.(proj)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#6094d4] hover:bg-[#5285c5] text-white rounded-lg text-xs font-medium cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Buat Campaign</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Landing Page Integration Code Snippet Modal */}
      {activeSnippetProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 overflow-y-auto">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-base text-slate-800">
                  Integrasi Web: {activeSnippetProject.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Pasang endpoint ini di landing page perusahaan untuk auto-sync subscriber.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveSnippetProject(null)}
                className="p-1 text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Snippet Display */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  JavaScript Fetch Script (Tambahkan ke Form Landing Page):
                </label>
                <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto">
                  <pre>{`// Kirim subscriber baru ke Mailing BE
async function submitNewsletter(email, name) {
  const response = await fetch('/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${activeSnippetProject.apiKey}'
    },
    body: JSON.stringify({
      email: email,
      name: name,
      projectId: '${activeSnippetProject.id}',
      tags: ['landing-page', 'web-lead']
    })
  });
  return await response.json();
}`}</pre>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  cURL Endpoint Test:
                </label>
                <div className="p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto">
                  <code>{`curl -X POST /api/subscribers \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@gmail.com","name":"Budi","projectId":"${activeSnippetProject.id}"}'`}</code>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveSnippetProject(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white cursor-pointer shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal (Admin Only) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-800">
              Tambah Proyek Landing Page Baru
            </h3>
            <p className="text-xs text-slate-500">
              Daftarkan proyek baru untuk mengintegrasikan form subscriber dan konfigurasi SMTP.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-3 pt-2">
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

              <div className="pt-3 flex items-center justify-end gap-2">
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
