'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMailingStore } from '@/lib/store';
import { EmailTemplate } from '@/types';
import {
  FileText,
  Plus,
  Eye,
  Sparkles,
  Layers,
  Calendar,
  CheckCircle2,
  Code,
  FolderDot,
} from 'lucide-react';

export default function TemplatesView() {
  const router = useRouter();
  const { templates, projects, selectedProjectId, hasPermission } = useMailingStore();
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [filterProject, setFilterProject] = useState(selectedProjectId || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter((tpl) => {
    const tplPid = tpl.project_id || tpl.projectId;
    if (filterProject !== 'all' && tplPid && tplPid !== filterProject) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSubject = tpl.subject ? tpl.subject.toLowerCase().includes(q) : false;
      if (!tpl.name.toLowerCase().includes(q) && !matchSubject) {
        return false;
      }
    }
    return true;
  });

  const handleUseTemplate = (tpl: EmailTemplate) => {
    router.push('/campaigns/new');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2 font-[family-name:var(--font-inter)]">
              <FileText className="w-5 h-5 text-[#6094d4]" />
              <span>Template & Builder Email</span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#edf4fc] text-[#335c94] border border-[#d6e5f7] font-semibold uppercase font-mono">
              email_templates
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-[family-name:var(--font-roboto)]">
            Katalog template email siap pakai, versi dokumen, dan integrasi drag-and-drop builder.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasPermission('canManageTemplates') && (
            <button
              type="button"
              onClick={() => router.push('/campaigns/new')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs font-[family-name:var(--font-inter)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Rancang Template Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          placeholder="Cari judul template, subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-72 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
        />

        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4] cursor-pointer"
        >
          <option value="all">Semua Proyek Landing Page</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <div className="ml-auto text-xs text-slate-500 font-medium">
          Ditemukan <span className="font-bold text-slate-800">{filteredTemplates.length}</span> template
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:border-[#6094d4] transition-colors flex flex-col"
          >
            {/* Header Badge */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#edf4fc] text-[#335c94] border border-[#d6e5f7]">
                {tpl.category || tpl.type || 'TEMPLATE'}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <FolderDot className="w-3 h-3 text-[#6094d4]" />
                {projects.find((p) => p.id === (tpl.project_id || tpl.projectId))?.name || 'Default Project'}
              </span>
            </div>

            {/* Template Body Preview Card */}
            <div className="p-5 flex-1 space-y-3">
              <h3 className="font-bold text-slate-800 text-sm font-[family-name:var(--font-inter)]">
                {tpl.name}
              </h3>
              <p className="text-xs text-slate-500 font-[family-name:var(--font-roboto)] line-clamp-2">
                Subject: <span className="font-medium text-slate-700">{tpl.subject}</span>
              </p>

              {/* Version & Metadata badges */}
              <div className="pt-2 flex flex-wrap gap-2 text-[10px] text-slate-500 font-mono">
                <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                  version: 1.0.0
                </span>
                <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                  id: {tpl.id}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setPreviewTemplate(tpl)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-white transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Preview</span>
              </button>

              <button
                type="button"
                onClick={() => handleUseTemplate(tpl)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#6094d4] hover:bg-[#5285c5] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs font-[family-name:var(--font-inter)]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gunakan di Campaign</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-base text-slate-800 font-[family-name:var(--font-inter)]">
                  Preview: {previewTemplate.name}
                </h3>
                <p className="text-xs text-slate-500 font-[family-name:var(--font-roboto)]">
                  Subject: {previewTemplate.subject}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="p-1 text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div
              className="p-4 bg-slate-50 border border-slate-200 rounded-lg max-h-[60vh] overflow-y-auto font-[family-name:var(--font-roboto)]"
              dangerouslySetInnerHTML={{
                __html: (previewTemplate.htmlContent || '')
                  .replace(/\{\{subscriber\.name\}\}/g, 'Pengguna Terhormat')
                  .replace(/\{\{project\.name\}\}/g, 'Perusahaan Anda')
                  .replace(/\{\{unsubscribe_url\}\}/g, '#'),
              }}
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreviewTemplate(null);
                  handleUseTemplate(previewTemplate);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs font-[family-name:var(--font-inter)]"
              >
                Gunakan Template Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
