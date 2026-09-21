'use client';

import React, { useEffect, useRef, useState } from 'react';
import grapesjs, { Editor } from 'grapesjs';
import { Sparkles, Code2, AlertCircle, RefreshCw } from 'lucide-react';

interface GrapesJsEditorProps {
  initialHtml: string;
  onChangeHtml: (html: string) => void;
  projectName?: string;
}

export default function GrapesJsEditor({
  initialHtml,
  onChangeHtml,
  projectName = 'Proyek Bisnis',
}: GrapesJsEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const onChangeHtmlRef = useRef(onChangeHtml);
  useEffect(() => {
    onChangeHtmlRef.current = onChangeHtml;
  }, [onChangeHtml]);

  useEffect(() => {
    if (!containerRef.current || !blocksRef.current) return;
    if (editorRef.current) return;

    try {
      // Initialize GrapesJS for Email Canvas
      const editor = grapesjs.init({
        container: containerRef.current,
        fromElement: false,
        height: '620px',
        width: 'auto',
        storageManager: false,
        noticeOnUnload: false,
        panels: {
          defaults: [
            {
              id: 'basic-actions',
              el: '.gjs-actions',
              buttons: [],
            },
          ],
        },
        components:
          initialHtml ||
          `<div style="font-family: Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; color: #334155;">
            <h1 style="font-family: Inter, sans-serif; font-size: 26px; color: #1e293b; margin-top: 0;">Selamat Datang di Buletin ${projectName}</h1>
            <p style="font-size: 15px; line-height: 1.6; color: #475569;">Halo <b>{{subscriber.name}}</b>, terima kasih telah menjadi bagian dari komunitas kami.</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="https://example.com" style="background-color: #6094d4; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Kunjungi Situs Web</a>
            </div>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center;">Anda menerima email ini karena terdaftar di ${projectName}. <a href="{{unsubscribe_url}}" style="color: #6094d4;">Unsubscribe</a></p>
          </div>`,
        blockManager: {
          appendTo: blocksRef.current,
          blocks: [
            // Heading Levels H1 to H6
            {
              id: 'h1',
              label: '<div class="font-bold text-xs">H1 Judul Utama</div>',
              category: 'Tipografi Headings',
              content:
                '<h1 style="font-family: Inter, sans-serif; font-size: 28px; font-weight: 700; color: #1e293b; margin: 20px 0 10px 0;">Judul Utama H1</h1>',
            },
            {
              id: 'h2',
              label: '<div class="font-bold text-xs">H2 Subjudul</div>',
              category: 'Tipografi Headings',
              content:
                '<h2 style="font-family: Inter, sans-serif; font-size: 22px; font-weight: 600; color: #1e293b; margin: 16px 0 8px 0;">Subjudul H2</h2>',
            },
            {
              id: 'h3',
              label: '<div class="font-semibold text-xs">H3 Bagian</div>',
              category: 'Tipografi Headings',
              content:
                '<h3 style="font-family: Inter, sans-serif; font-size: 18px; font-weight: 600; color: #1e293b; margin: 14px 0 6px 0;">Judul Bagian H3</h3>',
            },
            {
              id: 'h4',
              label: '<div class="font-semibold text-xs">H4 Minor</div>',
              category: 'Tipografi Headings',
              content:
                '<h4 style="font-family: Inter, sans-serif; font-size: 16px; font-weight: 600; color: #1e293b; margin: 12px 0 6px 0;">Judul Minor H4</h4>',
            },
            {
              id: 'h5',
              label: '<div class="font-medium text-xs">H5 Kecil</div>',
              category: 'Tipografi Headings',
              content:
                '<h5 style="font-family: Inter, sans-serif; font-size: 14px; font-weight: 600; color: #334155; margin: 10px 0 4px 0;">Header Kecil H5</h5>',
            },
            {
              id: 'h6',
              label: '<div class="font-medium text-xs">H6 Label</div>',
              category: 'Tipografi Headings',
              content:
                '<h6 style="font-family: Inter, sans-serif; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin: 8px 0 4px 0;">Label Khusus H6</h6>',
            },
            // Paragraph with text tools
            {
              id: 'text-paragraph',
              label: '<div class="text-xs">Paragraf Teks</div>',
              category: 'Teks & Konten',
              content:
                '<p style="font-family: Roboto, sans-serif; font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px 0;">Tuliskan pesan promosi, berita, atau pengumuman penting bagi pelanggan Anda di sini.</p>',
            },
            // Button CTA
            {
              id: 'btn-cta',
              label: '<div class="text-xs font-semibold text-[#335c94]">Tombol CTA</div>',
              category: 'Aksi & Tombol',
              content:
                '<div style="text-align: center; margin: 20px 0;"><a href="https://example.com" style="background-color: #6094d4; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-family: Inter, sans-serif;">Daftar Sekarang &rarr;</a></div>',
            },
            // Image from URL
            {
              id: 'img-url',
              label: '<div class="text-xs">Gambar dari URL</div>',
              category: 'Media & Gambar',
              content:
                '<div style="text-align: center; margin: 18px 0;"><img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80" alt="Banner Penawaran" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #e2e8f0;" /></div>',
            },
            // 2 Columns Grid
            {
              id: 'grid-2-col',
              label: '<div class="text-xs">2 Kolom Grid</div>',
              category: 'Struktur Layout',
              content:
                '<table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; border-collapse: collapse;"><tr><td width="48%" style="vertical-align: top; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;"><h4 style="margin: 0 0 6px 0; font-family: Inter, sans-serif; color: #1e293b;">Keunggulan 1</h4><p style="margin: 0; font-size: 13px; color: #475569; font-family: Roboto, sans-serif;">Deskripsi manfaat utama pertama yang diberikan kepada pelanggan.</p></td><td width="4%"></td><td width="48%" style="vertical-align: top; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;"><h4 style="margin: 0 0 6px 0; font-family: Inter, sans-serif; color: #1e293b;">Keunggulan 2</h4><p style="margin: 0; font-size: 13px; color: #475569; font-family: Roboto, sans-serif;">Deskripsi manfaat utama kedua yang relevan dan solutif.</p></td></tr></table>',
            },
            // 3 Columns Grid
            {
              id: 'grid-3-col',
              label: '<div class="text-xs">3 Kolom Grid</div>',
              category: 'Struktur Layout',
              content:
                '<table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; border-collapse: collapse;"><tr><td width="31%" style="vertical-align: top; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center;"><h4 style="margin: 0 0 4px 0; font-size: 14px; font-family: Inter, sans-serif; color: #1e293b;">Poin A</h4><p style="margin: 0; font-size: 12px; color: #64748b;">Rincian poin A.</p></td><td width="3%"></td><td width="31%" style="vertical-align: top; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center;"><h4 style="margin: 0 0 4px 0; font-size: 14px; font-family: Inter, sans-serif; color: #1e293b;">Poin B</h4><p style="margin: 0; font-size: 12px; color: #64748b;">Rincian poin B.</p></td><td width="3%"></td><td width="31%" style="vertical-align: top; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center;"><h4 style="margin: 0 0 4px 0; font-size: 14px; font-family: Inter, sans-serif; color: #1e293b;">Poin C</h4><p style="margin: 0; font-size: 12px; color: #64748b;">Rincian poin C.</p></td></tr></table>',
            },
            // Separator / Divider
            {
              id: 'divider',
              label: '<div class="text-xs">Garis Pembatas</div>',
              category: 'Struktur Layout',
              content:
                '<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />',
            },
            // Spacer
            {
              id: 'spacer-box',
              label: '<div class="text-xs">Spacer Kosong</div>',
              category: 'Struktur Layout',
              content:
                '<div style="height: 32px; line-height: 32px;">&nbsp;</div>',
            },
            // Highlight Box
            {
              id: 'highlight-box',
              label: '<div class="text-xs font-semibold text-[#335c94]">Kotak Sorotan</div>',
              category: 'Konten Spesial',
              content:
                '<div style="padding: 16px; background: #edf4fc; border: 1px solid #d6e5f7; border-radius: 8px; margin: 18px 0;"><h4 style="margin: 0 0 6px 0; color: #1e293b; font-family: Inter, sans-serif;">Pemberitahuan Penting</h4><p style="margin: 0; font-size: 13px; color: #334155; line-height: 1.5;">Gunakan kode promo <b>DISKON50</b> saat checkout sebelum akhir bulan.</p></div>',
            },
            // Footer Unsubscribe
            {
              id: 'footer-unsub',
              label: '<div class="text-xs">Footer Unsubscribe</div>',
              category: 'Kepatuhan & Footer',
              content:
                '<div style="text-align: center; padding: 24px 16px; font-size: 12px; color: #94a3b8; font-family: Roboto, sans-serif; border-top: 1px solid #e2e8f0; margin-top: 32px;"><p style="margin: 0 0 6px 0;">Anda menerima email ini dari <b>{{project.name}}</b>.</p><p style="margin: 0;"><a href="{{unsubscribe_url}}" style="color: #6094d4; text-decoration: underline;">Berhenti Berlangganan (Unsubscribe)</a></p></div>',
            },
          ],
        },
      });

      // Synchronize editor updates back to parent state
      editor.on('update', () => {
        const html = editor.getHtml();
        const css = editor.getCss();
        const combined = css ? `<style>${css}</style>\n${html}` : html;
        onChangeHtmlRef.current(combined);
      });

      editorRef.current = editor;
      editor.on('load', () => {
        setIsReady(true);
      });
      // Fallback in case load already fired
      setTimeout(() => {
        setIsReady(true);
      }, 50);
    } catch (err: unknown) {
      console.error('GrapesJS initialization error:', err);
      const msg = err instanceof Error ? err.message : 'Gagal memuat canvas GrapesJS';
      setTimeout(() => {
        setInitError(msg);
      }, 0);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [initialHtml, projectName]);

  const handleInsertVariableToGrapes = (varName: string) => {
    if (!editorRef.current) return;
    editorRef.current.addComponents(
      `<span style="color: #335c94; font-weight: 600;">${varName}</span>`
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* GrapesJS Top Control Bar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#6094d4]" />
            <span>GrapesJS Canvas Engine</span>
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#edf4fc] text-[#335c94] border border-[#d6e5f7]">
            Drag & Drop Aktif
          </span>
        </div>

        {/* Dynamic Tag Injector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[11px] hidden sm:inline">Sisipkan Variabel:</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleInsertVariableToGrapes('{{subscriber.name}}')}
              className="px-2 py-1 bg-white hover:bg-[#edf4fc] border border-slate-200 rounded text-[11px] text-slate-700 font-mono transition-colors cursor-pointer"
            >
              + Nama
            </button>
            <button
              type="button"
              onClick={() => handleInsertVariableToGrapes('{{subscriber.email}}')}
              className="px-2 py-1 bg-white hover:bg-[#edf4fc] border border-slate-200 rounded text-[11px] text-slate-700 font-mono transition-colors cursor-pointer"
            >
              + Email
            </button>
            <button
              type="button"
              onClick={() => handleInsertVariableToGrapes('{{unsubscribe_url}}')}
              className="px-2 py-1 bg-white hover:bg-[#edf4fc] border border-slate-200 rounded text-[11px] text-slate-700 font-mono transition-colors cursor-pointer"
            >
              + Unsubscribe
            </button>
          </div>
        </div>
      </div>

      {initError && (
        <div className="p-4 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{initError}. Anda dapat tetap merancang email menggunakan Visual Block Builder bawaan di tab sebelah.</span>
        </div>
      )}

      {/* Editor Split: Palette Blocks on Left & Grapes Canvas on Right */}
      <div className="flex flex-col lg:flex-row min-h-[620px] bg-slate-50">
        {/* Left Palette: GrapesJS Block Manager Container */}
        <div className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 p-4 shrink-0 overflow-y-auto max-h-[620px]">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Katalog Blok GrapesJS</span>
          </div>
          <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
            Tarik (drag) blok di bawah ke dalam canvas email di sebelah kanan:
          </p>
          <div ref={blocksRef} className="gjs-custom-blocks space-y-2" />
        </div>

        {/* Right Canvas */}
        <div className="flex-1 bg-slate-100 p-4 overflow-auto">
          <div
            ref={containerRef}
            className="w-full min-h-[580px] bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
}
