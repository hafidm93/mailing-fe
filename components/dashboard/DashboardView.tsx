'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMailingStore } from '@/lib/store';
import {
  FolderKanban,
  Mail,
  UserCheck,
  UserX,
  TrendingUp,
  MousePointerClick,
  Send,
  ArrowUpRight,
  Sparkles,
  Layers,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateToSubscribers?: () => void;
  onNavigateToCampaigns?: () => void;
  onNavigateToProjects?: () => void;
  onOpenCreateCampaign?: () => void;
  onOpenBulkSend?: () => void;
}

export default function DashboardView({
  onNavigateToSubscribers,
  onNavigateToCampaigns,
  onNavigateToProjects,
  onOpenCreateCampaign,
  onOpenBulkSend,
}: DashboardViewProps) {
  const router = useRouter();
  const {
    analytics,
    selectedProjectId,
    selectedProject,
    subscribers,
    campaigns,
    hasPermission,
  } = useMailingStore();

  const handleGoSubscribers = () => {
    if (onNavigateToSubscribers) onNavigateToSubscribers();
    else router.push('/subscribers');
  };

  const handleGoCampaigns = () => {
    if (onNavigateToCampaigns) onNavigateToCampaigns();
    else router.push('/campaigns');
  };

  const handleGoProjects = () => {
    if (onNavigateToProjects) onNavigateToProjects();
    else router.push('/projects');
  };

  const handleGoCreateCampaign = () => {
    if (onOpenCreateCampaign) onOpenCreateCampaign();
    else router.push('/campaigns/new');
  };

  const maxGrowthSub = Math.max(...analytics.monthlyGrowth.map((m) => m.subscribers), 100);

  const recentSubs = subscribers.slice(0, 5);
  const recentCamps = campaigns.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner / Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800">
              Ringkasan Analitik Marketing
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#edf4fc] text-[#2c558c] font-medium border border-[#d6e5f7]">
              Live BE Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {selectedProjectId === 'all'
              ? 'Memantau performa pengiriman email dan data subscriber di seluruh proyek landing page.'
              : `Menampilkan metrik untuk proyek: ${selectedProject?.name}`}
          </p>
        </div>

        {/* Quick Action CTA buttons */}
        <div className="flex items-center gap-2">
          {hasPermission('canSendBulkCampaign') && (
            <button
              id="btn-dash-bulk-send"
              type="button"
              onClick={onOpenBulkSend}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-[#6094d4] text-[#335c94] hover:bg-[#edf4fc] transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#6094d4]" />
              <span>Kirim Bulk Email</span>
            </button>
          )}

          {hasPermission('canCreateCampaign') && (
            <button
              id="btn-dash-create-campaign"
              type="button"
              onClick={handleGoCreateCampaign}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Buat Campaign Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Row: 4 Essential Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div
          onClick={handleGoProjects}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs cursor-pointer hover:border-[#6094d4] transition-colors group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">
              Total Proyek Terhubung
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#edf4fc] flex items-center justify-center text-[#6094d4] group-hover:bg-[#6094d4] group-hover:text-white transition-colors">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {analytics.totalProjects}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span>Web & Landing Page Aktif</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-[#6094d4] ml-auto" />
          </div>
        </div>

        {/* Total Email Data / Subscribers */}
        <div
          onClick={handleGoSubscribers}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs cursor-pointer hover:border-[#6094d4] transition-colors group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">
              Total Data Email
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#edf4fc] flex items-center justify-center text-[#6094d4] group-hover:bg-[#6094d4] group-hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {analytics.totalSubscribers.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">+{analytics.activeSubscribers} aktif terverifikasi</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-[#6094d4] ml-auto" />
          </div>
        </div>

        {/* Active Subscribers */}
        <div
          onClick={handleGoSubscribers}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs cursor-pointer hover:border-[#6094d4] transition-colors group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">
              User Subscribers
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {analytics.activeSubscribers.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span>
              {analytics.totalSubscribers > 0
                ? `${Math.round((analytics.activeSubscribers / analytics.totalSubscribers) * 100)}% Rasio Sehat`
                : '100% Rasio'}
            </span>
          </div>
        </div>

        {/* Total Campaigns Sent */}
        <div
          onClick={handleGoCampaigns}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs cursor-pointer hover:border-[#6094d4] transition-colors group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">
              Campaign Terkirim
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#edf4fc] flex items-center justify-center text-[#6094d4] group-hover:bg-[#6094d4] group-hover:text-white transition-colors">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {analytics.totalCampaignsSent}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span>{analytics.averageOpenRate}% Rata-rata Buka</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-[#6094d4] ml-auto" />
          </div>
        </div>

        {/* Unsubscribers & Bounces */}
        <div
          onClick={handleGoSubscribers}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs cursor-pointer hover:border-[#6094d4] transition-colors group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">
              Unsubscribers & Bounced
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {analytics.unsubscribedCount + analytics.bouncedCount}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span>{analytics.unsubscribedCount} unsub / {analytics.bouncedCount} bounce</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts & Diagrams Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscriber Growth Diagram (SVG Bar Chart - Clean, No Gradients!) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#6094d4]" />
                <span>Pertumbuhan Data Subscriber (Tren Bulanan)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Peningkatan jumlah email yang masuk melalui integrasi landing page
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#6094d4]" />
                <span className="text-slate-600">Subscriber</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-200" />
                <span className="text-slate-600">Unsubscribe</span>
              </div>
            </div>
          </div>

          {/* Clean Flat Bar Diagram */}
          <div className="pt-4 pb-2">
            <div className="h-52 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-200 px-2">
              {analytics.monthlyGrowth.map((item) => {
                const subHeightPct = Math.max(8, Math.round((item.subscribers / maxGrowthSub) * 100));
                const unsubHeightPct = Math.max(4, Math.round((item.unsubscribes / maxGrowthSub) * 100));

                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-10">
                      +{item.subscribers} subs / -{item.unsubscribes} unsubs
                    </div>

                    <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-full">
                      {/* Subscriber Bar */}
                      <div
                        style={{ height: `${subHeightPct}%` }}
                        className="w-1/2 bg-[#6094d4] hover:bg-[#5285c5] rounded-t-sm transition-all"
                      />
                      {/* Unsubscribe Bar */}
                      <div
                        style={{ height: `${unsubHeightPct}%` }}
                        className="w-1/2 bg-slate-200 rounded-t-sm transition-all"
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-500 mt-2">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Rata-rata pertumbuhan organik: <strong className="text-slate-700">+24.8%</strong> per bulan</span>
            <span>Update backend: <strong className="text-[#335c94]">Real-time async polling</strong></span>
          </div>
        </div>

        {/* Email Engagement & Deliverability */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-1">
              <MousePointerClick className="w-4 h-4 text-[#6094d4]" />
              <span>Efektivitas Pengiriman</span>
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Rata-rata interaksi email dari campaign yang terkirim
            </p>

            <div className="space-y-4">
              {/* Open Rate */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700">Average Open Rate</span>
                  <span className="font-bold text-[#335c94]">
                    {analytics.averageOpenRate}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${analytics.averageOpenRate}%` }}
                    className="h-full bg-[#6094d4] rounded-full"
                  />
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Benchmark industri B2B: ~21%</div>
              </div>

              {/* Click Rate */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700">Click-Through Rate (CTR)</span>
                  <span className="font-bold text-emerald-600">
                    {analytics.averageClickRate}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${analytics.averageClickRate}%` }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Penerima yang mengklik tautan kampanye</div>
              </div>

              {/* Delivery Rate */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700">SMTP Deliverability</span>
                  <span className="font-bold text-slate-800">98.4%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div style={{ width: '98.4%' }} className="h-full bg-slate-700 rounded-full" />
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Tingkat pengiriman sukses ke inbox tujuan</div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 rounded-lg bg-[#f8fafc] border border-slate-200 text-xs">
            <div className="font-semibold text-slate-700 mb-0.5">
              Kesehatan SMTP Terjaga
            </div>
            <p className="text-[11px] text-slate-500">
              IP sender terverifikasi dengan SPF, DKIM, dan DMARC pada seluruh proyek.
            </p>
          </div>
        </div>
      </div>

      {/* Projects Distribution & Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Breakdown */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#6094d4]" />
                <span>Distribusi Data Per Proyek Landing Page</span>
              </h2>
              <p className="text-xs text-slate-500">
                Data subscriber yang terkumpul dari masing-masing proyek
              </p>
            </div>
            <button
              type="button"
              onClick={handleGoProjects}
              className="text-xs font-medium text-[#335c94] hover:underline cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {analytics.projectBreakdown.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-3">
                  <div className="font-medium text-slate-800 truncate">
                    {item.projectName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Open Rate: {item.openRate}%
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-semibold text-slate-800">
                    {item.subscriberCount}
                  </span>
                  <span className="text-slate-400 ml-1">subs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Campaigns Table */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Send className="w-4 h-4 text-[#6094d4]" />
                <span>Campaign Terbaru</span>
              </h2>
              <p className="text-xs text-slate-500">
                Aktivitas pengiriman email promosi terakhir
              </p>
            </div>
            <button
              type="button"
              onClick={handleGoCampaigns}
              className="text-xs font-medium text-[#335c94] hover:underline cursor-pointer"
            >
              Kelola Campaign
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentCamps.map((cmp) => {
              const isSent = cmp.status === 'sent';
              const isDraft = cmp.status === 'draft';
              return (
                <div key={cmp.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-3">
                    <div className="font-medium text-slate-800 truncate">
                      {cmp.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {cmp.projectName} &bull; {cmp.recipientCount} target
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        isSent
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isDraft
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-[#edf4fc] text-[#2c558c] border border-[#d6e5f7]'
                      }`}
                    >
                      {cmp.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
