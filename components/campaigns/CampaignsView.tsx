'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMailingStore } from '@/lib/store';
import { Campaign, EmailTemplate } from '@/types';
import {
  Send,
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  MousePointerClick,
  Mail,
  Copy,
  FolderDot,
  Eye,
} from 'lucide-react';

interface CampaignsViewProps {
  onOpenCreateCampaign?: (template?: EmailTemplate) => void;
  onOpenBulkSend?: () => void;
}

export default function CampaignsView({
  onOpenCreateCampaign,
  onOpenBulkSend,
}: CampaignsViewProps) {
  const router = useRouter();
  const { campaigns, templates, projects, selectedProjectId, hasPermission } = useMailingStore();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates'>('campaigns');
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  const handleCreate = (template?: EmailTemplate) => {
    if (onOpenCreateCampaign) {
      onOpenCreateCampaign(template);
    } else {
      router.push('/campaigns/new');
    }
  };

  const filteredCampaigns =
    selectedProjectId === 'all'
      ? campaigns
      : campaigns.filter((c) => c.projectId === selectedProjectId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Send className="w-5 h-5 text-[#6094d4]" />
            <span>Manajemen Campaign & Template Email</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rancang template visual, kelola draf promosi, dan eksekusi pengiriman pesan massal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasPermission('canSendBulkCampaign') && (
            <button
              id="btn-campaign-bulk-send"
              type="button"
              onClick={onOpenBulkSend}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[#6094d4] text-[#335c94] hover:bg-[#edf4fc] transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#6094d4]" />
              <span>Kirim Bulk Campaign</span>
            </button>
          )}

          {hasPermission('canCreateCampaign') && (
            <button
              id="btn-campaign-create"
              type="button"
              onClick={() => handleCreate()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Campaign Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('campaigns')}
          className={`pb-2.5 px-3 font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'campaigns'
              ? 'border-[#6094d4] text-[#335c94]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Daftar Campaign ({filteredCampaigns.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`pb-2.5 px-3 font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'templates'
              ? 'border-[#6094d4] text-[#335c94]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Template Email ({templates.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'campaigns' ? (
        /* Campaigns Table */
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Nama Campaign & Subject</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Proyek</th>
                  <th className="py-3 px-4">Penerima</th>
                  <th className="py-3 px-4">Performa Open & Click</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCampaigns.map((camp) => {
                  const sentCount = camp.sentCount || 0;
                  const openCount = camp.openCount || 0;
                  const clickCount = camp.clickCount || 0;
                  const openRate =
                    sentCount > 0 ? Math.round((openCount / sentCount) * 100) : 0;
                  const clickRate =
                    openCount > 0 ? Math.round((clickCount / openCount) * 100) : 0;

                  return (
                    <tr
                      key={camp.id}
                      className="hover:bg-[#f8fafc] transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {camp.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">
                          {camp.subject}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {camp.status === 'sent' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Terkirim</span>
                          </span>
                        )}
                        {camp.status === 'draft' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            <Clock className="w-3 h-3" />
                            <span>Draft</span>
                          </span>
                        )}
                        {camp.status === 'scheduled' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#edf4fc] text-[#2c558c] border border-[#d6e5f7]">
                            <Clock className="w-3 h-3" />
                            <span>Terjadwal</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {camp.projectName}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {sentCount > 0 ? sentCount : (camp.recipientCount || 0)} target
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {camp.targetSegment || 'Semua Subscriber'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {sentCount > 0 ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 font-semibold text-slate-700">
                              <span>Open: {openRate}%</span>
                              <span className="text-slate-400 text-[10px]">({openCount})</span>
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Click: {clickRate}% ({clickCount})
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Belum ada metrik</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-500">
                        {camp.sent_at
                          ? `Terkirim: ${new Date(camp.sent_at).toLocaleDateString('id-ID')}`
                          : camp.createdAt
                            ? `Dibuat: ${new Date(camp.createdAt).toLocaleDateString('id-ID')}`
                            : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {hasPermission('canSendBulkCampaign') && (
                          <button
                            type="button"
                            onClick={onOpenBulkSend}
                            className="px-2.5 py-1 text-xs font-medium text-[#335c94] hover:bg-[#edf4fc] rounded transition-colors cursor-pointer"
                          >
                            Kirim Ulang
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
      ) : (
        /* Templates Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-[#6094d4] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#edf4fc] text-[#2c558c] border border-[#d6e5f7] uppercase">
                    {tpl.category}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Update: {tpl.updatedAt ? new Date(tpl.updatedAt).toLocaleDateString() : '-'}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 mb-1">
                  {tpl.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {tpl.description}
                </p>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 truncate mb-4">
                  Subject: {tpl.subject}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(tpl)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#6094d4] cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                {hasPermission('canCreateCampaign') && (
                  <button
                    type="button"
                    onClick={() => handleCreate(tpl)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#6094d4] hover:bg-[#5285c5] text-white rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gunakan Template</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-base text-slate-800">
                  Preview: {previewTemplate.name}
                </h3>
                <p className="text-xs text-slate-500">Subject: {previewTemplate.subject}</p>
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
              className="p-4 bg-slate-50 border border-slate-200 rounded-lg max-h-[60vh] overflow-y-auto"
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
                className="px-4 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Tutup
              </button>
              {hasPermission('canCreateCampaign') && (
                <button
                  type="button"
                  onClick={() => {
                    const tpl = previewTemplate || undefined;
                    setPreviewTemplate(null);
                    handleCreate(tpl);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white cursor-pointer shadow-xs"
                >
                  Buat Campaign dari Template Ini &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
