'use client';

import React, { useState } from 'react';
import { useMailingStore } from '@/lib/store';
import { EmailTemplate } from '@/types';
import VisualEmailBuilder from './VisualEmailBuilder';
import { X, Sparkles, Send, FileText, Check } from 'lucide-react';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTemplate?: EmailTemplate | null;
}

export default function CreateCampaignModal({
  isOpen,
  onClose,
  initialTemplate,
}: CreateCampaignModalProps) {
  const { projects, templates, createCampaign } = useMailingStore();

  const [name, setName] = useState(
    initialTemplate ? `Campaign: ${initialTemplate.name}` : 'Promo Spesial Kuartal'
  );
  const [subject, setSubject] = useState(
    initialTemplate?.subject || 'Pemberitahuan Menarik untuk {{subscriber.name}}'
  );
  const [previewText, setPreviewText] = useState('Jangan lewatkan penawaran eksklusif minggu ini.');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplate?.id || templates[0]?.id || '');

  const [fromName, setFromName] = useState(projects[0]?.smtp.fromName || 'Marketing Team');
  const [fromEmail, setFromEmail] = useState(projects[0]?.smtp.fromEmail || 'promo@example.com');
  const [htmlContent, setHtmlContent] = useState(
    initialTemplate?.htmlContent || templates[0]?.htmlContent || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectTemplate = (tpl: EmailTemplate) => {
    setSelectedTemplateId(tpl.id);
    setSubject(tpl.subject);
    setHtmlContent(tpl.htmlContent);
  };

  const handleProjectChange = (projId: string) => {
    setProjectId(projId);
    const p = projects.find((proj) => proj.id === projId);
    if (p) {
      setFromName(p.smtp.fromName);
      setFromEmail(p.smtp.fromEmail);
    }
  };

  const handleSubmit = async (isDraft = false) => {
    if (!name || !subject) return;
    setIsSubmitting(true);
    try {
      const proj = projects.find((p) => p.id === projectId) || projects[0];
      await createCampaign({
        name,
        subject,
        previewText,
        fromName,
        fromEmail,
        projectId: proj.id,
        projectName: proj.name,
        templateId: selectedTemplateId,
        htmlContent,
        status: isDraft ? 'draft' : 'scheduled',
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentProject = projects.find((p) => p.id === projectId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#6094d4]" />
              <span>Buat Campaign Email Baru</span>
            </h2>
            <p className="text-xs text-slate-500">
              Rancang pesan marketing menggunakan visual builder dan integrasi template.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Template Selection Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Pilih Template Dasar:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {templates.map((tpl) => {
                const isChosen = selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer flex flex-col justify-between ${
                      isChosen
                        ? 'border-[#6094d4] bg-[#edf4fc] ring-1 ring-[#6094d4]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-800 flex items-center justify-between">
                        <span>{tpl.name}</span>
                        {isChosen && <Check className="w-3.5 h-3.5 text-[#6094d4]" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {tpl.description}
                      </p>
                    </div>
                    <div className="text-[10px] text-[#335c94] font-medium mt-2">
                      Kategori: {tpl.category}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Campaign Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nama Campaign Internal *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Promo Diskon September 2026"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Proyek Web Landing Page Terkait *
              </label>
              <select
                value={projectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4] cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.subscriberCount} subs)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Subject Email *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject yang menarik penerima..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Teks Pratinjau (Preview Text)
              </label>
              <input
                type="text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                placeholder="Kalimat yang muncul di baris preview inbox..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nama Pengirim (From Name)
              </label>
              <input
                type="text"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email Pengirim (From Email)
              </label>
              <input
                type="email"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
              />
            </div>
          </div>

          {/* Section 3: Visual Email Builder Component */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Konten & Desain Visual Email:
            </label>
            <VisualEmailBuilder
              initialHtml={htmlContent}
              onChangeHtml={setHtmlContent}
              projectName={currentProject?.name}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            Batal
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 text-xs font-medium border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Simpan Sebagai Draft
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(false)}
              className="px-5 py-2 text-xs font-semibold bg-[#6094d4] hover:bg-[#5285c5] text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Memproses...' : 'Simpan & Siapkan Pengiriman'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
