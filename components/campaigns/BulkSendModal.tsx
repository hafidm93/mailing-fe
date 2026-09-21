'use client';

import React, { useState, useMemo } from 'react';
import { useMailingStore } from '@/lib/store';
import { Campaign, Subscriber } from '@/types';
import {
  Send,
  X,
  CheckCircle2,
  Users,
  ShieldCheck,
  FolderDot,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface BulkSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedRecipientIds?: string[];
}

export default function BulkSendModal({
  isOpen,
  onClose,
  preSelectedRecipientIds = [],
}: BulkSendModalProps) {
  const { campaigns, projects, subscribers, sendBulkCampaign } = useMailingStore();

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    campaigns[0]?.id || ''
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    campaigns[0]?.projectId || projects[0]?.id || ''
  );
  const [audienceMode, setAudienceMode] = useState<'all' | 'custom'>(
    preSelectedRecipientIds.length > 0 ? 'custom' : 'all'
  );
  const [selectedSubIds, setSelectedSubIds] = useState<string[]>(
    preSelectedRecipientIds
  );

  // Sending progress state
  const [isSending, setIsSending] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [sendResult, setSendResult] = useState<{
    success: boolean;
    sentCount: number;
    message: string;
  } | null>(null);

  // Selected Campaign & Project
  const campaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];
  const project = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Eligible subscribers for this project
  const projectSubscribers = subscribers.filter(
    (s) => s.projectId === selectedProjectId && s.status === 'subscribed'
  );

  const finalRecipientIds = useMemo(() => {
    if (audienceMode === 'all') {
      return projectSubscribers.map((s) => s.id);
    }
    return selectedSubIds.length > 0
      ? selectedSubIds
      : projectSubscribers.map((s) => s.id);
  }, [audienceMode, projectSubscribers, selectedSubIds]);

  if (!isOpen) return null;

  const handleToggleSub = (id: string) => {
    setSelectedSubIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleStartSending = async () => {
    if (!campaign || finalRecipientIds.length === 0) return;
    setIsSending(true);
    setProgressPercent(0);
    setSendResult(null);

    try {
      const res = await sendBulkCampaign(
        campaign.id,
        finalRecipientIds,
        (percent, batch, total) => {
          setProgressPercent(percent);
          setCurrentBatch(batch);
          setTotalBatches(total);
        }
      );
      setSendResult(res);
    } catch (e) {
      setSendResult({
        success: false,
        sentCount: 0,
        message: 'Gagal mengirim batch email melalui SMTP.',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Send className="w-5 h-5 text-[#6094d4]" />
              <span>Kirim Bulk Email Campaign</span>
            </h2>
            <p className="text-xs text-slate-500">
              Kirim promosi, update, atau event ke seluruh / sebagian subscriber terpilih.
            </p>
          </div>
          {!isSending && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {sendResult ? (
            /* Result Screen */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Bulk Campaign Berhasil Dikirim!
                </h3>
                <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  {sendResult.message}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <div>
                  <div className="text-slate-400 font-medium">Terkirim</div>
                  <div className="font-bold text-slate-800 text-base">
                    {sendResult.sentCount}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Bounced</div>
                  <div className="font-bold text-slate-800 text-base">0</div>
                </div>
                <div>
                  <div className="text-slate-400 font-medium">Status BE</div>
                  <div className="font-bold text-emerald-600 text-base">
                    Dispatched
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#6094d4] hover:bg-[#5285c5] text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
                >
                  Selesai & Tutup
                </button>
              </div>
            </div>
          ) : isSending ? (
            /* Sending Progress Screen */
            <div className="py-8 space-y-6 text-center">
              <div className="w-14 h-14 rounded-full bg-[#edf4fc] text-[#6094d4] flex items-center justify-center mx-auto animate-pulse">
                <Send className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Sedang Mengirim Email Massal...
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Memproses batch {currentBatch} dari {totalBatches} ke server SMTP: {project.smtp.host}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Progres Pengiriman</span>
                  <span className="text-[#335c94]">{progressPercent}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className="h-full bg-[#6094d4] transition-all duration-300"
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5 animate-spin text-[#6094d4]" />
                <span>Mempertahankan reputasi domain dengan antrian otomatis async backend</span>
              </div>
            </div>
          ) : (
            /* Selection & Confirmation Screen */
            <>
              {/* Step 1: Pick Campaign */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  1. Pilih Campaign Email:
                </label>
                <select
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4] cursor-pointer"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} &mdash; Subject: &ldquo;{c.subject}&rdquo;
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Pick Project */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  2. Pilih Proyek Web / Landing Page Target:
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4] cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.subscriberCount} data terdaftar)
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3: Audience Mode (All vs Selected) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  3. Target Penerima:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAudienceMode('all')}
                    className={`p-3 rounded-lg border text-left text-xs cursor-pointer ${
                      audienceMode === 'all'
                        ? 'border-[#6094d4] bg-[#edf4fc] text-[#2c558c]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-semibold flex items-center justify-between">
                      <span>Semua Subscriber Aktif</span>
                      {audienceMode === 'all' && <CheckCircle2 className="w-4 h-4 text-[#6094d4]" />}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Kirim ke seluruh {projectSubscribers.length} subscriber pada proyek ini.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAudienceMode('custom')}
                    className={`p-3 rounded-lg border text-left text-xs cursor-pointer ${
                      audienceMode === 'custom'
                        ? 'border-[#6094d4] bg-[#edf4fc] text-[#2c558c]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-semibold flex items-center justify-between">
                      <span>Pilih Manual ({selectedSubIds.length} terpilih)</span>
                      {audienceMode === 'custom' && <CheckCircle2 className="w-4 h-4 text-[#6094d4]" />}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Pilih sebagian subscriber tertentu dari daftar.
                    </div>
                  </button>
                </div>

                {/* Custom selection table when custom mode selected */}
                {audienceMode === 'custom' && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg max-h-40 overflow-y-auto space-y-1 text-xs">
                    {projectSubscribers.map((sub) => {
                      const isChecked = selectedSubIds.includes(sub.id);
                      return (
                        <label
                          key={sub.id}
                          className="flex items-center gap-2 p-1.5 hover:bg-white rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSub(sub.id)}
                            className="rounded text-[#6094d4] focus:ring-[#6094d4]"
                          />
                          <span className="font-medium text-slate-800 truncate">
                            {sub.email}
                          </span>
                          <span className="text-[10px] text-slate-400">({sub.name})</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SMTP Dispatch Diagnostics Card */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-[#6094d4]" />
                    <span>Konfigurasi SMTP Pengirim</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      project.smtp.isVerified
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {project.smtp.isVerified ? 'SMTP Verified' : 'Unverified'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                  <div>
                    Host: <strong className="text-slate-700">{project.smtp.host}</strong>
                  </div>
                  <div>
                    From: <strong className="text-slate-700">{project.smtp.fromEmail}</strong>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!sendResult && !isSending && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Total Target: <strong className="text-slate-800">{finalRecipientIds.length}</strong> penerima
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleStartSending}
                disabled={finalRecipientIds.length === 0}
                className="px-5 py-2 bg-[#6094d4] hover:bg-[#5285c5] disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Mulai Kirim Bulk Email Sekarang</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
