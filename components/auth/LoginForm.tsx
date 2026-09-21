'use client';

import React, { useState } from 'react';
import { useMailingStore } from '@/lib/store';
import { Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Role } from '@/types';

export default function LoginForm() {
  const { login, quickSwitchRole } = useMailingStore();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await login(username, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Login gagal.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan koneksi server.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role: Role, uname: string, pass: string) => {
    setUsername(uname);
    setPassword(pass);
    setErrorMsg(null);
    quickSwitchRole(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 transition-colors">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#6094d4] text-white mb-3 shadow-xs">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Mailing System Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Platform pengiriman campaign email & manajemen subscriber
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800">
              Masuk ke Akun Anda
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Gunakan kredensial yang telah didaftarkan oleh Administrator.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="login-username-input"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: admin atau marketing"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6094d4] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="login-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6094d4] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              id="btn-login-submit"
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-[#6094d4] hover:bg-[#5285c5] active:bg-[#4678b8] text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6094d4]" />
              <span>Pilih Role Demo (1-Click Login):</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="btn-quick-admin"
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin', 'admin123')}
                className="py-2 px-2.5 rounded-lg border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] bg-white text-left transition-colors cursor-pointer group"
              >
                <div className="text-xs font-semibold text-slate-800 group-hover:text-[#335c94]">
                  Admin
                </div>
                <div className="text-[10px] text-slate-500 truncate">Akses Penuh</div>
              </button>

              <button
                id="btn-quick-marketing"
                type="button"
                onClick={() => handleQuickLogin('marketing', 'marketing', 'marketing123')}
                className="py-2 px-2.5 rounded-lg border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] bg-white text-left transition-colors cursor-pointer group"
              >
                <div className="text-xs font-semibold text-slate-800 group-hover:text-[#335c94]">
                  Marketing
                </div>
                <div className="text-[10px] text-slate-500 truncate">Campaign & Mails</div>
              </button>

              <button
                id="btn-quick-sales"
                type="button"
                onClick={() => handleQuickLogin('sales', 'sales', 'sales123')}
                className="py-2 px-2.5 rounded-lg border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] bg-white text-left transition-colors cursor-pointer group"
              >
                <div className="text-xs font-semibold text-slate-800 group-hover:text-[#335c94]">
                  Sales
                </div>
                <div className="text-[10px] text-slate-500 truncate">Data Subscriber</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security footnote */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#6094d4]" />
          <span>Role-Based Access Control (RBAC) & Async Backend API Active</span>
        </div>
      </div>
    </div>
  );
}
