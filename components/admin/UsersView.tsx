'use client';

import React, { useState } from 'react';
import { useMailingStore } from '@/lib/store';
import { User, Role } from '@/types';
import {
  Users2,
  Plus,
  Shield,
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  Mail,
  ShieldAlert,
  KeyRound,
  Laptop,
  Clock,
} from 'lucide-react';

export default function UsersView() {
  const { users, currentUser, createUser, updateUser, userSessions, organizations } = useMailingStore();

  const [activeTab, setActiveTab] = useState<'users' | 'sessions'>('users');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // New User Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('marketing');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit User Form State
  const [editRole, setEditRole] = useState<Role>('marketing');
  const [editStatus, setEditStatus] = useState<User['status']>('active');

  // RBAC Guard
  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-xl space-y-3 font-[family-name:var(--font-roboto)]">
        <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-800 font-[family-name:var(--font-inter)]">Akses Dibatasi</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Manajemen pengguna dashboard hanya dapat diakses oleh Administrator sistem.
        </p>
      </div>
    );
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setIsSubmitting(true);
    try {
      await createUser({
        name,
        email,
        role,
        status: 'active',
        organizationId: currentUser?.organizationId || 'org-1',
      });
      setIsAddModalOpen(false);
      setName('');
      setEmail('');
      setRole('marketing');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSubmitting(true);
    try {
      await updateUser({
        ...editingUser,
        role: editRole,
        status: editStatus,
      });
      setEditingUser(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditRole(user.role || 'marketing');
    setEditStatus(user.status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2 font-[family-name:var(--font-inter)]">
              <Users2 className="w-5 h-5 text-[#6094d4]" />
              <span>Manajemen Pengguna & Sesi Aktif</span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#edf4fc] text-[#335c94] border border-[#d6e5f7] font-semibold uppercase font-mono">
              ERD: users & user_sessions
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-[family-name:var(--font-roboto)]">
            Kelola akun internal tim marketing, hak akses role administrator, dan riwayat user sessions.
          </p>
        </div>

        {activeTab === 'users' && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#6094d4] hover:bg-[#5285c5] text-white transition-colors cursor-pointer shadow-xs font-[family-name:var(--font-inter)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah User Baru</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-[family-name:var(--font-inter)]">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`pb-2.5 px-3 font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'border-[#6094d4] text-[#335c94]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users2 className="w-3.5 h-3.5" />
          <span>Pengguna (users: {users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sessions')}
          className={`pb-2.5 px-3 font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
            activeTab === 'sessions'
              ? 'border-[#6094d4] text-[#335c94]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Sesi Login (user_sessions: {userSessions.length})</span>
        </button>
      </div>

      {/* TAB 1: USERS */}
      {activeTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden font-[family-name:var(--font-roboto)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] font-[family-name:var(--font-inter)]">
                <tr>
                  <th className="py-3 px-4">Nama & Email</th>
                  <th className="py-3 px-4">Role Akses</th>
                  <th className="py-3 px-4">Organisasi</th>
                  <th className="py-3 px-4">Status Akun</th>
                  <th className="py-3 px-4">Terdaftar</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const isCurrent = u.id === currentUser?.id;
                  const org = organizations.find((o) => o.id === u.organizationId);
                  return (
                    <tr key={u.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 flex items-center gap-2 font-[family-name:var(--font-inter)]">
                          <span>{u.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#edf4fc] text-[#335c94] font-normal">
                              (Anda)
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase ${
                            u.role === 'admin'
                              ? 'bg-[#edf4fc] text-[#335c94] border border-[#d6e5f7]'
                              : u.role === 'marketing'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          <span>{u.role}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {org?.name || u.organizationId || '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        {u.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Aktif</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Nonaktif</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => openEditModal(u)}
                          className="p-1 rounded text-slate-400 hover:text-[#6094d4] hover:bg-[#edf4fc] transition-colors cursor-pointer"
                          title="Edit Pengguna"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: USER SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden font-[family-name:var(--font-roboto)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] font-[family-name:var(--font-inter)]">
                <tr>
                  <th className="py-3 px-4">ID Sesi</th>
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">User Agent / Perangkat</th>
                  <th className="py-3 px-4">Waktu Login</th>
                  <th className="py-3 px-4">Kadaluarsa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userSessions.map((s) => {
                  const user = users.find((u) => u.id === s.user_id);
                  return (
                    <tr key={s.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {s.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 font-[family-name:var(--font-inter)]">{user?.name || s.user_id}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{user?.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {s.ip_address}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 flex items-center gap-1.5 mt-2">
                        <Laptop className="w-3.5 h-3.5 text-[#6094d4]" />
                        <span>{s.user_agent}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(s.created_at).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(s.expires_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-[family-name:var(--font-inter)]">
              Tambah Pengguna Dashboard Baru
            </h3>
            <p className="text-xs text-slate-500 font-[family-name:var(--font-roboto)]">
              Buat akun akses staf untuk mengelola kampanye email dan subscriber.
            </p>

            <form onSubmit={handleAddUser} className="space-y-3 pt-2 font-[family-name:var(--font-roboto)]">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sarah Oktaviana"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Akun *
                </label>
                <input
                  type="email"
                  required
                  placeholder="sarah@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Role Akses *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                >
                  <option value="marketing">Marketing (Kirim Campaign, Template & Kontak)</option>
                  <option value="viewer">Viewer (Hanya Melihat Metrik & Subscriber)</option>
                  <option value="admin">Administrator (Akses Penuh Semua Menu)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 font-[family-name:var(--font-inter)]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold bg-[#6094d4] hover:bg-[#5285c5] text-white rounded-lg cursor-pointer shadow-xs"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-800 font-[family-name:var(--font-inter)]">
              Ubah Role & Status: {editingUser.name}
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-3 pt-2 font-[family-name:var(--font-roboto)]">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Role Akses
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as Role)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                >
                  <option value="marketing">Marketing</option>
                  <option value="viewer">Viewer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Status Akun
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#6094d4]"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 font-[family-name:var(--font-inter)]">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold bg-[#6094d4] hover:bg-[#5285c5] text-white rounded-lg cursor-pointer shadow-xs"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
