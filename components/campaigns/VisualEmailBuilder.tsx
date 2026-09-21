'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  Monitor,
  Code2,
  Eye,
  Type,
  Heading,
  Columns,
  SquareCheck,
  Minus,
  Sparkles,
  Send,
  CheckCircle2,
} from 'lucide-react';

interface VisualEmailBuilderProps {
  initialHtml: string;
  initialMjml?: string;
  onChangeHtml: (html: string) => void;
  projectName?: string;
}

export default function VisualEmailBuilder({
  initialHtml,
  initialMjml,
  onChangeHtml,
  projectName = 'SaaS Platform',
}: VisualEmailBuilderProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'preview'>('visual');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [htmlContent, setHtmlContent] = useState<string>(initialHtml);
  const [mjmlContent, setMjmlContent] = useState<string>(
    initialMjml || `<mjml><mj-body><mj-text>Konten MJML</mj-text></mj-body></mjml>`
  );

  // Test email send state
  const [testEmail, setTestEmail] = useState('');
  const [testSentStatus, setTestSentStatus] = useState<string | null>(null);
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleHtmlChange = (newVal: string) => {
    setHtmlContent(newVal);
    onChangeHtml(newVal);
  };

  // Insert Variable helper
  const insertVariable = (variable: string) => {
    const updated = htmlContent + `\n<p style="font-size:14px; color:#334155;">${variable}</p>`;
    handleHtmlChange(updated);
  };

  // Insert standard block into HTML
  const insertBlock = (type: string) => {
    let blockSnippet = '';
    switch (type) {
      case 'heading':
        blockSnippet = `<h2 style="font-family: Inter, sans-serif; font-size: 22px; font-weight: 700; color: #0f172a; margin: 24px 0 12px 0;">Judul Bagian Baru</h2>`;
        break;
      case 'text':
        blockSnippet = `<p style="font-family: Roboto, sans-serif; font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px 0;">Tuliskan pesan promosi atau edukasi yang informatif untuk {{subscriber.name}} di sini.</p>`;
        break;
      case 'button':
        blockSnippet = `<div style="margin: 20px 0; text-align: left;"><a href="https://example.com" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Tombol Aksi Utama &rarr;</a></div>`;
        break;
      case 'divider':
        blockSnippet = `<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;" />`;
        break;
      case 'columns':
        blockSnippet = `<table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;"><tr><td width="48%" style="vertical-align: top; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;"><h4 style="margin: 0 0 6px 0; font-size: 15px; color: #0f172a;">Kolom 1</h4><p style="margin: 0; font-size: 13px; color: #475569;">Poin penawaran pertama.</p></td><td width="4%"></td><td width="48%" style="vertical-align: top; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;"><h4 style="margin: 0 0 6px 0; font-size: 15px; color: #0f172a;">Kolom 2</h4><p style="margin: 0; font-size: 13px; color: #475569;">Poin penawaran kedua.</p></td></tr></table>`;
        break;
      default:
        break;
    }

    if (blockSnippet) {
      handleHtmlChange(htmlContent + '\n' + blockSnippet);
    }
  };

  // Simulated Test Send
  const handleSendTestEmail = async () => {
    if (!testEmail) return;
    setIsSendingTest(true);
    setTestSentStatus(null);
    await new Promise((r) => setTimeout(r, 600));
    setIsSendingTest(false);
    setTestSentStatus(`Preview email berhasil dikirim ke ${testEmail}`);
  };

  // Preview rendered HTML with simulated dynamic variables replaced
  const renderedPreview = htmlContent
    .replace(/\{\{subscriber\.name\}\}/g, 'Rizky Firmansyah')
    .replace(/\{\{subscriber\.email\}\}/g, 'rizky.f@example.com')
    .replace(/\{\{project\.name\}\}/g, projectName)
    .replace(/\{\{unsubscribe_url\}\}/g, '#unsubscribe');

  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border-b border-slate-200 text-xs">
        {/* Editor Modes */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-[#6094d4] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Builder</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'code'
                ? 'bg-[#6094d4] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Kode HTML / MJML</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-[#6094d4] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>

        {/* Device Mode Switcher */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              deviceMode === 'desktop'
                ? 'bg-[#6094d4] text-white'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
            title="Desktop Mode"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              deviceMode === 'mobile'
                ? 'bg-[#6094d4] text-white'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
            title="Mobile Mode"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Variables Inserter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[11px] font-medium hidden sm:inline">Variabel:</span>
          <select
            onChange={(e) => {
              if (e.target.value) {
                insertVariable(e.target.value);
                e.target.value = '';
              }
            }}
            className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#6094d4]"
          >
            <option value="">+ Sisipkan Tag Dinamis</option>
            <option value="{{subscriber.name}}">&#123;&#123;subscriber.name&#125;&#125; (Nama)</option>
            <option value="{{subscriber.email}}">&#123;&#123;subscriber.email&#125;&#125; (Email)</option>
            <option value="{{project.name}}">&#123;&#123;project.name&#125;&#125; (Nama Proyek)</option>
            <option value="{{unsubscribe_url}}">&#123;&#123;unsubscribe_url&#125;&#125; (Unsubscribe)</option>
          </select>
        </div>
      </div>

      {/* Editor Body */}
      <div className="p-4 bg-slate-50 min-h-[440px] flex gap-4">
        {/* Left Block Palette (Active in Visual mode) */}
        {activeTab === 'visual' && (
          <div className="w-48 shrink-0 bg-white p-3 rounded-lg border border-slate-200 space-y-2 hidden md:block">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Blok Komponen
            </div>
            <button
              type="button"
              onClick={() => insertBlock('heading')}
              className="w-full text-left p-2 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-xs text-slate-700 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Heading className="w-3.5 h-3.5 text-[#6094d4]" />
              <span>Header / Judul</span>
            </button>
            <button
              type="button"
              onClick={() => insertBlock('text')}
              className="w-full text-left p-2 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-xs text-slate-700 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Type className="w-3.5 h-3.5 text-[#6094d4]" />
              <span>Paragraf Teks</span>
            </button>
            <button
              type="button"
              onClick={() => insertBlock('button')}
              className="w-full text-left p-2 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-xs text-slate-700 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <SquareCheck className="w-3.5 h-3.5 text-[#6094d4]" />
              <span>Tombol CTA</span>
            </button>
            <button
              type="button"
              onClick={() => insertBlock('columns')}
              className="w-full text-left p-2 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-xs text-slate-700 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Columns className="w-3.5 h-3.5 text-[#6094d4]" />
              <span>2 Kolom Fitur</span>
            </button>
            <button
              type="button"
              onClick={() => insertBlock('divider')}
              className="w-full text-left p-2 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-xs text-slate-700 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Minus className="w-3.5 h-3.5 text-[#6094d4]" />
              <span>Garis Pemisah</span>
            </button>
          </div>
        )}

        {/* Center Canvas */}
        <div className="flex-1 flex justify-center overflow-auto">
          {activeTab === 'code' ? (
            <div className="w-full space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Editor Kode HTML Email
                </label>
                <textarea
                  value={htmlContent}
                  onChange={(e) => handleHtmlChange(e.target.value)}
                  rows={14}
                  className="w-full p-3 font-mono text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Definisi MJML (Opsional)
                </label>
                <textarea
                  value={mjmlContent}
                  onChange={(e) => setMjmlContent(e.target.value)}
                  rows={6}
                  className="w-full p-3 font-mono text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>
            </div>
          ) : (
            <div
              className={`bg-white text-slate-900 shadow-sm rounded-lg overflow-hidden border border-slate-200 transition-all ${
                deviceMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-[640px]'
              }`}
            >
              {/* Device Frame Header */}
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>Mode Tampilan: {deviceMode === 'mobile' ? 'Mobile Phone' : 'Desktop Email Client'}</span>
                <span className="text-[10px] text-[#335c94] font-semibold">Variabel Terisi Otomatis</span>
              </div>

              {/* Rendered HTML Container */}
              <div
                className="p-4"
                dangerouslySetInnerHTML={{ __html: renderedPreview }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Send Test Email Simulator */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <input
            type="email"
            placeholder="Kirim tes email ke: marketing@contoh.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800 placeholder-slate-400 w-64 focus:outline-none focus:ring-1 focus:ring-[#6094d4]"
          />
          <button
            type="button"
            onClick={handleSendTestEmail}
            disabled={isSendingTest || !testEmail}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded font-medium flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Send className="w-3 h-3" />
            <span>{isSendingTest ? 'Mengirim...' : 'Kirim Tes'}</span>
          </button>
        </div>

        {testSentStatus && (
          <div className="text-emerald-700 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{testSentStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
}
