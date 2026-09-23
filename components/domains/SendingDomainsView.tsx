'use client';

import React, { useState } from 'react';
import { useMailingStore } from '@/lib/store';
import { SendingDomain, EmailProvider, EmailIdentity } from '@/types';
import {
  Globe,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Server,
  Mail,
  Shield,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';

export default function SendingDomainsView() {
  const {
    sendingDomains,
    emailProviders,
    emailIdentities,
    projects,
    addSendingDomain,
    addEmailProvider,
    addEmailIdentity,
    hasPermission,
  } = useMailingStore();

  const [activeTab, setActiveTab] = useState<'domains' | 'providers' | 'identities'>('domains');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Modal States
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);

  // New Domain Form
  const [newDomainName, setNewDomainName] = useState('');
  const [newDomainProjectId, setNewDomainProjectId] = useState(projects[0]?.id || '');
  const [newDomainProviderId, setNewDomainProviderId] = useState(emailProviders[0]?.id || '');

  // New Provider Form
  const [newProviderName, setNewProviderName] = useState('');
  const [newProviderType, setNewProviderType] = useState<'smtp' | 'resend' | 'sendgrid' | 'ses'>('smtp');
  const [newProviderHost, setNewProviderHost] = useState('smtp.mailgun.org');
  const [newProviderPort, setNewProviderPort] = useState(587);

  // New Identity Form
  const [newIdentityEmail, setNewIdentityEmail] = useState('');
  const [newIdentityName, setNewIdentityName] = useState('');
  const [newIdentityReplyTo, setNewIdentityReplyTo] = useState('');
  const [newIdentityProjectId, setNewIdentityProjectId] = useState(projects[0]?.id || '');

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  const handleCreateDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainName) return;
    const pId = newDomainProjectId || projects[0]?.id || 'prj-saas';
    const provId = newDomainProviderId || emailProviders[0]?.id || 'prov-smtp-1';
    addSendingDomain({
      domain: newDomainName.replace(/^https?:\/\//, ''),
      project_id: pId,
      provider_id: provId,
      projectId: pId,
      providerId: provId,
      dkimVerified: true,
      spfVerified: true,
      dmarcVerified: true,
      status: 'verified',
    });
    setNewDomainName('');
    setIsDomainModalOpen(false);
  };

  const handleCreateProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProviderName) return;
    addEmailProvider({
      name: newProviderName,
      type: newProviderType,
      config: {
        host: newProviderHost,
        port: newProviderPort,
        username: 'postmaster@example.com',
        tls: true,
      },
      status: 'active',
    });
    setNewProviderName('');
    setIsProviderModalOpen(false);
  };

  const handleCreateIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdentityEmail) return;
    const pId = newIdentityProjectId || projects[0]?.id || 'prj-saas';
    addEmailIdentity({
      project_id: pId,
      projectId: pId,
      from_email: newIdentityEmail,
      fromEmail: newIdentityEmail,
      from_name: newIdentityName || 'Marketing Team',
      fromName: newIdentityName || 'Marketing Team',
      reply_to: newIdentityReplyTo || newIdentityEmail,
      replyTo: newIdentityReplyTo || newIdentityEmail,
      status: 'verified',
    });
    setNewIdentityEmail('');
    setNewIdentityName('');
    setIsIdentityModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2 font-[family-name:var(--font-inter)]">
              <Globe className="w-5 h-5 text-[#6094d4]" />
              <span>Sending Domains & Email Providers</span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#edf4fc] text-[#335c94] border border-[#d6e5f7] font-semibold uppercase font-mono">
              ERD: Infrastructure
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-[family-name:var(--font-roboto)]">
            Konfigurasi domain pengiriman, verifikasi DNS (DKIM, SPF, DMARC), email providers, dan identitas sender.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'domains' && (
            <button
              type="button"
              onClick={() => setIsDomainModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs font-[family-name:var(--font-inter)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Sending Domain</span>
            </button>
          )}

          {activeTab === 'providers' && (
            <button
              type="button"
              onClick={() => setIsProviderModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs font-[family-name:var(--font-inter)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Provider</span>
            </button>
          )}

          {activeTab === 'identities' && (
            <button
              type="button"
              onClick={() => setIsIdentityModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs font-[family-name:var(--font-inter)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Identitas Sender</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-[family-name:var(--font-inter)]">
        <button
          type="button"
          onClick={() => setActiveTab('domains')}
          className={`pb-2.5 px-3 font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'domains'
              ? 'border-[#6094d4] text-[#335c94]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Sending Domains ({sendingDomains.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('providers')}
          className={`pb-2.5 px-3 font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'providers'
              ? 'border-[#6094d4] text-[#335c94]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Email Providers ({emailProviders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('identities')}
          className={`pb-2.5 px-3 font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'identities'
              ? 'border-[#6094d4] text-[#335c94]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Email Identities ({emailIdentities.length})</span>
        </button>
      </div>

      {/* Tab 1: Sending Domains */}
      {activeTab === 'domains' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-[family-name:var(--font-roboto)]">
              <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] font-[family-name:var(--font-inter)]">
                <tr>
                  <th className="py-3 px-4">Domain Pengirim</th>
                  <th className="py-3 px-4">Proyek Terkait</th>
                  <th className="py-3 px-4">Email Provider</th>
                  <th className="py-3 px-4">DKIM Status</th>
                  <th className="py-3 px-4">SPF Status</th>
                  <th className="py-3 px-4">DMARC Status</th>
                  <th className="py-3 px-4">Overall Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sendingDomains.map((dom) => {
                  const proj = projects.find((p) => p.id === dom.projectId);
                  const prov = emailProviders.find((p) => p.id === dom.providerId);
                  return (
                    <tr key={dom.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 font-mono flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-[#6094d4]" />
                          <span>{dom.domain}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">id: {dom.id}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {proj?.name || dom.projectId}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono">
                        {prov?.name || dom.providerId}
                      </td>
                      <td className="py-3.5 px-4">
                        {dom.dkimVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Valid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <AlertCircle className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {dom.spfVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Valid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <AlertCircle className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {dom.dmarcVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Valid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <AlertCircle className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {dom.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Email Providers */}
      {activeTab === 'providers' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-[family-name:var(--font-roboto)]">
              <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] font-[family-name:var(--font-inter)]">
                <tr>
                  <th className="py-3 px-4">Nama Provider</th>
                  <th className="py-3 px-4">Tipe Engine</th>
                  <th className="py-3 px-4">Host Server</th>
                  <th className="py-3 px-4">Port</th>
                  <th className="py-3 px-4">TLS Encryption</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {emailProviders.map((prov) => (
                  <tr key={prov.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5 font-[family-name:var(--font-inter)]">
                        <Server className="w-3.5 h-3.5 text-[#6094d4]" />
                        <span>{prov.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">id: {prov.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="uppercase font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {prov.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {prov.config?.host || 'api.provider.com'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {prov.config?.port || '443'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Enabled
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {prov.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Email Identities */}
      {activeTab === 'identities' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-[family-name:var(--font-roboto)]">
              <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] font-[family-name:var(--font-inter)]">
                <tr>
                  <th className="py-3 px-4">From Email</th>
                  <th className="py-3 px-4">From Name</th>
                  <th className="py-3 px-4">Reply-To</th>
                  <th className="py-3 px-4">Proyek Terkait</th>
                  <th className="py-3 px-4">Status Identitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {emailIdentities.map((iden) => {
                  const proj = projects.find((p) => p.id === iden.projectId);
                  return (
                    <tr key={iden.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-800 font-mono">
                        {iden.fromEmail}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {iden.fromName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {iden.replyTo}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {proj?.name || iden.projectId}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {iden.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Domain Modal */}
      {isDomainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-[family-name:var(--font-inter)]">
              Tambah Sending Domain Baru
            </h3>
            <p className="text-xs text-slate-500 font-[family-name:var(--font-roboto)]">
              Daftarkan domain yang akan digunakan untuk mengirimkan email campaign.
            </p>

            <form onSubmit={handleCreateDomain} className="space-y-3 pt-2 font-[family-name:var(--font-roboto)]">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Domain *
                </label>
                <input
                  type="text"
                  required
                  placeholder="marketing.domain.com"
                  value={newDomainName}
                  onChange={(e) => setNewDomainName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Proyek Terkait
                </label>
                <select
                  value={newDomainProjectId}
                  onChange={(e) => setNewDomainProjectId(e.target.value)}
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
                  Email Provider
                </label>
                <select
                  value={newDomainProviderId}
                  onChange={(e) => setNewDomainProviderId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                >
                  {emailProviders.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.name} ({prov.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 font-[family-name:var(--font-inter)]">
                <button
                  type="button"
                  onClick={() => setIsDomainModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
                >
                  Simpan Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Provider Modal */}
      {isProviderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-[family-name:var(--font-inter)]">
              Tambah Email Provider Baru
            </h3>

            <form onSubmit={handleCreateProvider} className="space-y-3 pt-2 font-[family-name:var(--font-roboto)]">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Provider *
                </label>
                <input
                  type="text"
                  required
                  placeholder="AWS SES Production"
                  value={newProviderName}
                  onChange={(e) => setNewProviderName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tipe Provider
                </label>
                <select
                  value={newProviderType}
                  onChange={(e) => setNewProviderType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                >
                  <option value="smtp">Standard SMTP Server</option>
                  <option value="resend">Resend API</option>
                  <option value="sendgrid">Twilio SendGrid</option>
                  <option value="ses">Amazon SES</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Host Server
                </label>
                <input
                  type="text"
                  placeholder="email-smtp.us-east-1.amazonaws.com"
                  value={newProviderHost}
                  onChange={(e) => setNewProviderHost(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Port
                </label>
                <input
                  type="number"
                  value={newProviderPort}
                  onChange={(e) => setNewProviderPort(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 font-[family-name:var(--font-inter)]">
                <button
                  type="button"
                  onClick={() => setIsProviderModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
                >
                  Simpan Provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Identity Modal */}
      {isIdentityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-[family-name:var(--font-inter)]">
              Tambah Identitas Sender Baru
            </h3>

            <form onSubmit={handleCreateIdentity} className="space-y-3 pt-2 font-[family-name:var(--font-roboto)]">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  From Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="newsletter@domain.com"
                  value={newIdentityEmail}
                  onChange={(e) => setNewIdentityEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  From Name
                </label>
                <input
                  type="text"
                  placeholder="Nama Pengirim / Perusahaan"
                  value={newIdentityName}
                  onChange={(e) => setNewIdentityName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Reply-To Email
                </label>
                <input
                  type="email"
                  placeholder="support@domain.com"
                  value={newIdentityReplyTo}
                  onChange={(e) => setNewIdentityReplyTo(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 font-[family-name:var(--font-inter)]">
                <button
                  type="button"
                  onClick={() => setIsIdentityModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs"
                >
                  Simpan Identitas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
