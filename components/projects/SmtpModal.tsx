'use client';

import React, { useState } from 'react';
import { Project, SmtpConfig } from '@/types';
import { useMailingStore } from '@/lib/store';
import {
  ShieldCheck,
  X,
  Server,
  Key,
  Mail,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCw,
} from 'lucide-react';

interface SmtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export default function SmtpModal({ isOpen, onClose, project }: SmtpModalProps) {
  const { updateProject, testProjectSmtp } = useMailingStore();

  const [host, setHost] = useState(project?.smtp?.host || 'smtp.resend.com');
  const [port, setPort] = useState(project?.smtp?.port || 587);
  const [secure, setSecure] = useState(project?.smtp?.secure ?? true);
  const [user, setUser] = useState(project?.smtp?.user || '');
  const [pass, setPass] = useState(project?.smtp?.pass || '');
  const [fromName, setFromName] = useState(project?.smtp?.fromName || '');
  const [fromEmail, setFromEmail] = useState(project?.smtp?.fromEmail || '');

  // SMTP Test State
  const [testingStatus, setTestingStatus] = useState<
    'idle' | 'testing' | 'success' | 'failed'
  >('idle');
  const [testLog, setTestLog] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !project) return null;

  const handleTestConnection = async () => {
    setTestingStatus('testing');
    setTestLog(null);
    try {
      const res = await testProjectSmtp({
        host,
        port: Number(port),
        secure,
        user,
        pass,
        fromName,
        fromEmail,
        isVerified: false,
      });

      if (res.success) {
        setTestingStatus('success');
        setTestLog(res.message);
      } else {
        setTestingStatus('failed');
        setTestLog(res.message);
      }
    } catch (e) {
      setTestingStatus('failed');
      setTestLog('Handshake timeout ke host SMTP.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedSmtp: SmtpConfig = {
        host,
        port: Number(port),
        secure,
        user,
        pass,
        fromName,
        fromEmail,
        isVerified: testingStatus === 'success' || !!project.smtp?.isVerified,
        lastTestedAt: new Date().toISOString(),
      };

      await updateProject({
        ...project,
        smtp: updatedSmtp,
      });

      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Server className="w-4 h-4 text-[#6094d4]" />
              <span>Konfigurasi SMTP: {project.name}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Setup server pengiriman email (Mailgun, Sendgrid, Resend, Postmark, dsb).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                SMTP Host Server *
              </label>
              <input
                type="text"
                required
                placeholder="smtp.resend.com"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Port
              </label>
              <input
                type="number"
                required
                placeholder="587"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Username / API Key
              </label>
              <input
                type="text"
                placeholder="apikey atau resend"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Password / Secret Token
              </label>
              <input
                type="password"
                placeholder="••••••••••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                From Name (Nama Pengirim) *
              </label>
              <input
                type="text"
                required
                placeholder="Tim Marketing"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                From Email (Alamat Pengirim) *
              </label>
              <input
                type="email"
                required
                placeholder="noreply@domain.com"
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
              />
            </div>
          </div>

          {/* Secure SSL checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="checkbox-smtp-secure"
              checked={secure}
              onChange={(e) => setSecure(e.target.checked)}
              className="rounded text-[#6094d4] focus:ring-[#6094d4]"
            />
            <label
              htmlFor="checkbox-smtp-secure"
              className="text-xs text-slate-700 cursor-pointer"
            >
              Aktifkan Enkripsi TLS/SSL (Direkomendasikan untuk keamanan port 587/465)
            </label>
          </div>

          {/* Test connection button & output */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">
                Uji Koneksi Server
              </span>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingStatus === 'testing'}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {testingStatus === 'testing' ? (
                  <RotateCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
                <span>{testingStatus === 'testing' ? 'Memeriksa...' : 'Test SMTP Connection'}</span>
              </button>
            </div>

            {testLog && (
              <div
                className={`p-2.5 rounded text-[11px] flex items-start gap-2 ${
                  testingStatus === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {testingStatus === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                )}
                <div>{testLog}</div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold bg-[#6094d4] hover:bg-[#5285c5] text-white rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi SMTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
