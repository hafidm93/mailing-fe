'use client';

import React, { useState } from 'react';
import { useMailingStore } from '@/lib/store';
import { EmailTemplate, Project } from '@/types';
import BlockEmailEditor from './BlockEmailEditor';
import GrapesJsEditor from './GrapesJsEditor';
import {
  ArrowLeft,
  Sparkles,
  Send,
  Save,
  CheckCircle2,
  Code2,
  Eye,
  Settings2,
  FileText,
  Mail,
  Smartphone,
  Monitor,
  Copy,
  Check,
  Building2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface CreateCampaignViewProps {
  onBack: () => void;
  initialTemplate?: EmailTemplate | null;
  initialProject?: Project | null;
}

export default function CreateCampaignView({
  onBack,
  initialTemplate,
  initialProject,
}: CreateCampaignViewProps) {
  const { projects, templates, createCampaign } = useMailingStore();

  // Campaign Meta State
  const [name, setName] = useState(
    initialTemplate ? `Campaign: ${initialTemplate.name}` : 'Buletin Promo Mingguan'
  );
  const [subject, setSubject] = useState(
    initialTemplate?.subject || 'Penawaran Spesial Pekan Ini untuk {{subscriber.name}}'
  );
  const [previewText, setPreviewText] = useState(
    'Dapatkan diskon eksklusif dan pembaruan fitur terbaru kami.'
  );

  const defaultProj =
    initialProject ||
    projects[0] || {
      id: 'proj-default',
      name: 'Default Project',
      smtp: { fromName: 'Marketing Team', fromEmail: 'newsletter@example.com' },
    };

  const [projectId, setProjectId] = useState(defaultProj.id);
  const [fromName, setFromName] = useState(defaultProj.smtp?.fromName || 'Marketing Team');
  const [fromEmail, setFromEmail] = useState(
    defaultProj.smtp?.fromEmail || 'newsletter@example.com'
  );
  const [targetSegment, setTargetSegment] = useState('Semua Subscriber Aktif');

  // Selected Template
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialTemplate?.id || ''
  );

  // Content state
  const [htmlContent, setHtmlContent] = useState<string>(
    initialTemplate?.htmlContent || templates[0]?.htmlContent || ''
  );
  const [mjmlContent, setMjmlContent] = useState<string>(
    initialTemplate?.mjmlContent || templates[0]?.mjmlContent || ''
  );

  // Editor Tab: 'blocks' | 'grapes' | 'code' | 'preview'
  const [editorMode, setEditorMode] = useState<'blocks' | 'grapes' | 'code' | 'preview'>('blocks');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Accordion state for settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  // Action status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitNotice, setSubmitNotice] = useState<string | null>(null);
  const [testEmailAddress, setTestEmailAddress] = useState('tester@perusahaan.co.id');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testNotice, setTestNotice] = useState<string | null>(null);
  const [isCopiedHtml, setIsCopiedHtml] = useState(false);

  const selectedProject = projects.find((p) => p.id === projectId) || projects[0];

  const handleProjectChange = (id: string) => {
    setProjectId(id);
    const proj = projects.find((p) => p.id === id);
    if (proj?.smtp) {
      setFromName(proj.smtp.fromName);
      setFromEmail(proj.smtp.fromEmail);
    }
  };

  const handleApplyTemplate = (tpl: EmailTemplate) => {
    setSelectedTemplateId(tpl.id);
    setSubject(tpl.subject);
    setHtmlContent(tpl.htmlContent);
    setMjmlContent(tpl.mjmlContent || '');
    setSubmitNotice(`Template "${tpl.name}" berhasil diterapkan.`);
    setTimeout(() => setSubmitNotice(null), 3000);
  };

  const handleSaveCampaign = async (status: 'draft' | 'scheduled') => {
    if (!name.trim() || !subject.trim()) {
      alert('Mohon lengkapi Nama Campaign dan Subjek Email terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createCampaign({
        name,
        subject,
        previewText,
        fromName,
        fromEmail,
        projectId: selectedProject?.id || 'all',
        projectName: selectedProject?.name || 'Project Utama',
        templateId: selectedTemplateId || undefined,
        htmlContent,
        mjmlContent,
        status,
        targetSegment,
      });

      setSubmitNotice(
        status === 'draft'
          ? 'Draft Campaign berhasil disimpan!'
          : 'Campaign berhasil dibuat dan siap dijadwalkan!'
      );

      setTimeout(() => {
        onBack();
      }, 900);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmailAddress) return;
    setIsSendingTest(true);
    setTestNotice(null);
    await new Promise((r) => setTimeout(r, 600));
    setIsSendingTest(false);
    setTestNotice(`Email uji coba berhasil dikirimkan ke ${testEmailAddress}`);
    setTimeout(() => setTestNotice(null), 4000);
  };

  const handleCopyHtml = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(htmlContent);
      setIsCopiedHtml(true);
      setTimeout(() => setIsCopiedHtml(false), 2000);
    }
  };

  // Preview replacement with simulated tags
  const renderedEnvelopePreview = htmlContent
    .replace(/\{\{subscriber\.name\}\}/g, 'Rizky Firmansyah')
    .replace(/\{\{subscriber\.email\}\}/g, 'rizky.firmansyah@example.com')
    .replace(/\{\{project\.name\}\}/g, selectedProject?.name || 'Mailing Platform')
    .replace(/\{\{unsubscribe_url\}\}/g, '#unsubscribe');

  return (
    <div className="space-y-5 pb-16">
      {/* Top Breadcrumb & Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Kembali ke Daftar Campaign"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800 font-heading">
                Buat Campaign Email Baru
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#edf4fc] text-[#335c94] border border-[#d6e5f7]">
                Halaman Penuh
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Rancang pesan marketing visual interaktif, atur target segmen, dan uji kirim.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSaveCampaign('draft')}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveCampaign('scheduled')}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Menyimpan...' : 'Jadwalkan / Kirim'}</span>
          </button>
        </div>
      </div>

      {submitNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{submitNotice}</span>
        </div>
      )}

      {/* Campaign Settings Accordion */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="w-full px-5 py-3.5 bg-slate-50/60 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-[#6094d4]" />
            <span>Pengaturan Metadata & Subjek Campaign</span>
            <span className="text-[11px] font-normal text-slate-500">
              ({selectedProject?.name} &bull; {targetSegment})
            </span>
          </div>
          {isSettingsOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isSettingsOpen && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* Campaign Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Campaign <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Flash Sale Akhir Bulan"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6094d4]"
                />
              </div>

              {/* Target Project */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Proyek Bisnis <span className="text-rose-500">*</span>
                </label>
                <select
                  value={projectId}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6094d4]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.subscriberCount} subscriber)
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Segment */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Segmen</label>
                <select
                  value={targetSegment}
                  onChange={(e) => setTargetSegment(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6094d4]"
                >
                  <option value="Semua Subscriber Aktif">Semua Subscriber Aktif</option>
                  <option value="Pelanggan Baru (30 Hari Terakhir)">
                    Pelanggan Baru (30 Hari Terakhir)
                  </option>
                  <option value="Pengguna VIP">Pengguna VIP</option>
                  <option value="Pengguna Tidak Aktif (Re-engagement)">
                    Pengguna Tidak Aktif (Re-engagement)
                  </option>
                </select>
              </div>

              {/* Subject Line */}
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Subjek Email <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subjek yang menarik penerima..."
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6094d4]"
                  />
                  <button
                    type="button"
                    onClick={() => setSubject((s) => s + ' {{subscriber.name}}')}
                    className="px-2.5 py-1.5 border border-slate-200 hover:bg-[#edf4fc] rounded-lg text-[11px] text-slate-700 font-mono transition-colors cursor-pointer shrink-0"
                    title="Sisipkan Nama Penerima"
                  >
                    + Nama
                  </button>
                </div>
              </div>

              {/* Preheader / Preview Text */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Preview Text (Preheader)
                </label>
                <input
                  type="text"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  placeholder="Teks intisari pada inbox..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6094d4]"
                />
              </div>

              {/* Sender Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Pengirim (From)</label>
                <input
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6094d4]"
                />
              </div>

              {/* Sender Email */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Pengirim (From Email)
                </label>
                <input
                  type="email"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6094d4]"
                />
              </div>

              {/* Load Existing Template Quick Bar */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Terapkan Template Cepat
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => {
                    const t = templates.find((tpl) => tpl.id === e.target.value);
                    if (t) handleApplyTemplate(t);
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6094d4]"
                >
                  <option value="">-- Pilih Template Tersimpan --</option>
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name} ({tpl.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Editor Navigation Bar: Tabs for Visual Blocks / GrapesJS / Code / Real Preview */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setEditorMode('blocks')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              editorMode === 'blocks'
                ? 'bg-[#6094d4] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Visual Block Builder (H1-H6, CTA, Grid)</span>
          </button>

          <button
            type="button"
            onClick={() => setEditorMode('grapes')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              editorMode === 'grapes'
                ? 'bg-[#6094d4] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            <span>GrapesJS Studio Canvas</span>
          </button>

          <button
            type="button"
            onClick={() => setEditorMode('code')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              editorMode === 'code'
                ? 'bg-[#6094d4] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Kode HTML / MJML</span>
          </button>

          <button
            type="button"
            onClick={() => setEditorMode('preview')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              editorMode === 'preview'
                ? 'bg-[#6094d4] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Pratinjau Nyata Inbox</span>
          </button>
        </div>

        {/* Quick Test Send Field */}
        <div className="flex items-center gap-2 text-xs">
          <input
            type="email"
            value={testEmailAddress}
            onChange={(e) => setTestEmailAddress(e.target.value)}
            placeholder="Email pengujian..."
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 w-48 sm:w-56 focus:outline-none focus:ring-1 focus:ring-[#6094d4]"
          />
          <button
            type="button"
            onClick={handleSendTestEmail}
            disabled={isSendingTest || !testEmailAddress}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#6094d4] text-[#335c94] hover:bg-[#edf4fc] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-[#6094d4]" />
            <span>{isSendingTest ? 'Mengirim...' : 'Kirim Uji'}</span>
          </button>
        </div>
      </div>

      {testNotice && (
        <div className="p-3 bg-[#edf4fc] border border-[#d6e5f7] text-[#2c558c] text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#6094d4] shrink-0" />
          <span>{testNotice}</span>
        </div>
      )}

      {/* Editor Content Display */}
      {editorMode === 'blocks' && (
        <BlockEmailEditor
          initialHtml={htmlContent}
          onChangeHtml={setHtmlContent}
          projectName={selectedProject?.name}
        />
      )}

      {editorMode === 'grapes' && (
        <GrapesJsEditor
          initialHtml={htmlContent}
          onChangeHtml={setHtmlContent}
          projectName={selectedProject?.name}
        />
      )}

      {editorMode === 'code' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-800 font-heading">
                Source Code HTML Email
              </h3>
              <p className="text-xs text-slate-500">
                Email HTML yang telah dikompilasi secara responsif dengan table fallbacks untuk semua email client.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyHtml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
            >
              {isCopiedHtml ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin HTML</span>
                </>
              )}
            </button>
          </div>

          <textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            rows={20}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#6094d4]"
          />
        </div>
      )}

      {editorMode === 'preview' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-800 font-heading">
                Pratinjau Nyata Inbox Email Client
              </h3>
              <p className="text-xs text-slate-500">
                Simulasi rendering email di browser / inbox pengguna dengan variabel nyata yang telah dievaluasi.
              </p>
            </div>

            {/* Viewport switch */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 border border-slate-200 rounded-lg">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  previewDevice === 'desktop'
                    ? 'bg-[#6094d4] text-white'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop (640px)</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  previewDevice === 'mobile'
                    ? 'bg-[#6094d4] text-white'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (375px)</span>
              </button>
            </div>
          </div>

          {/* Envelope Frame */}
          <div className="flex justify-center bg-slate-100 p-6 rounded-xl overflow-x-auto">
            <div
              className={`bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden transition-all ${
                previewDevice === 'mobile' ? 'w-[375px]' : 'w-full max-w-[640px]'
              }`}
            >
              {/* Envelope meta header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-800 text-sm font-heading">{subject}</div>
                  <span className="text-[11px] text-slate-400">10:30 WIB</span>
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-700">Dari:</span> {fromName} &lt;{fromEmail}&gt;
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-700">Kepada:</span> Rizky Firmansyah &lt;rizky.firmansyah@example.com&gt;
                </div>
                {previewText && (
                  <div className="text-[11px] text-slate-400 truncate">
                    <span className="font-semibold text-slate-500">Preheader:</span> {previewText}
                  </div>
                )}
              </div>

              {/* Rendered HTML Body */}
              <div
                className="p-6 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: renderedEnvelopePreview }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
