'use client';

import React, { useState, useEffect } from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Type,
  SquareCheck,
  Columns,
  Columns3,
  Minus,
  Image as ImageIcon,
  MoveUp,
  MoveDown,
  Trash2,
  Copy,
  Plus,
  Link,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Maximize2,
  Sparkles,
  Bookmark,
  Share2,
  HelpCircle,
  Eye,
  Check,
  Smartphone,
  Monitor,
} from 'lucide-react';

export type BlockType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'paragraph'
  | 'button'
  | 'image'
  | 'grid2'
  | 'grid3'
  | 'separator'
  | 'spacer'
  | 'callout'
  | 'social'
  | 'unsubscribe';

export interface EmailBlock {
  id: string;
  type: BlockType;
  // Common text properties
  text?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  fontSize?: string;
  // Rich paragraph formatting
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  linkUrl?: string;
  linkText?: string;
  // Button properties
  btnLabel?: string;
  btnUrl?: string;
  btnBgColor?: string;
  btnTextColor?: string;
  btnRadius?: 'sharp' | 'rounded' | 'pill';
  btnFullWidth?: boolean;
  // Image properties
  imageUrl?: string;
  imageAlt?: string;
  imageWidth?: string;
  imageLink?: string;
  imageRadius?: string;
  // Separator properties
  separatorStyle?: 'solid' | 'dashed' | 'dotted';
  separatorColor?: string;
  separatorThickness?: string;
  separatorMargin?: string;
  separatorWidth?: string;
  // Spacer properties
  spacerHeight?: number;
  // Callout properties
  calloutTitle?: string;
  calloutType?: 'info' | 'promo' | 'warning';
  // Grid properties
  col1Title?: string;
  col1Text?: string;
  col1Image?: string;
  col1Btn?: string;
  col1BtnUrl?: string;
  col2Title?: string;
  col2Text?: string;
  col2Image?: string;
  col2Btn?: string;
  col2BtnUrl?: string;
  col3Title?: string;
  col3Text?: string;
  col3Image?: string;
  // Social properties
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
  // Unsubscribe properties
  companyAddress?: string;
  unsubscribeNotice?: string;
}

interface BlockEmailEditorProps {
  initialHtml?: string;
  onChangeHtml: (html: string) => void;
  projectName?: string;
}

const DEFAULT_BLOCKS: EmailBlock[] = [
  {
    id: 'b-header',
    type: 'h1',
    text: 'Kabar Istimewa Pekan Ini untuk Anda',
    align: 'center',
    color: '#1e293b',
  },
  {
    id: 'b-img',
    type: 'image',
    imageUrl:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Promo Kolaborasi',
    align: 'center',
    imageWidth: '100%',
    imageRadius: '8px',
  },
  {
    id: 'b-intro',
    type: 'paragraph',
    text: 'Halo {{subscriber.name}},\n\nTerima kasih telah bergabung bersama kami di {{project.name}}. Kami hadirkan ringkasan produk unggulan serta penawaran menarik khusus subscriber aktif.',
    align: 'left',
    color: '#334155',
    isBold: false,
    fontSize: '15px',
  },
  {
    id: 'b-callout',
    type: 'callout',
    calloutTitle: 'Penawaran Eksklusif Diskon 30%',
    text: 'Gunakan kode kupon MAILING30 untuk mendapatkan potongan harga pada tagihan berikutnya.',
    calloutType: 'promo',
  },
  {
    id: 'b-grid',
    type: 'grid2',
    col1Title: 'Pengiriman Cepat & Aman',
    col1Text: 'Layanan terintegrasi dengan SLA keandalan hingga 99.9%.',
    col1Btn: 'Lihat Fitur &rarr;',
    col1BtnUrl: 'https://example.com/fitur-1',
    col2Title: 'Dukungan Pelanggan 24/7',
    col2Text: 'Tim teknis profesional siap mendampingi kebutuhan kampanye Anda.',
    col2Btn: 'Hubungi Kami &rarr;',
    col2BtnUrl: 'https://example.com/fitur-2',
  },
  {
    id: 'b-cta',
    type: 'button',
    btnLabel: 'Klaim Promo Spesial Anda',
    btnUrl: 'https://example.com/klaim-promo',
    align: 'center',
    btnBgColor: '#6094d4',
    btnTextColor: '#ffffff',
    btnRadius: 'rounded',
  },
  {
    id: 'b-sep',
    type: 'separator',
    separatorStyle: 'solid',
    separatorColor: '#e2e8f0',
    separatorThickness: '1px',
    separatorMargin: '24px',
    separatorWidth: '100%',
  },
  {
    id: 'b-social',
    type: 'social',
    socialLinks: {
      website: 'https://example.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'b-footer',
    type: 'unsubscribe',
    companyAddress: 'Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan, Indonesia',
    unsubscribeNotice:
      'Anda menerima email resmi ini karena berlangganan buletin {{project.name}}.',
  },
];

// Helper to compile blocks into clean, responsive email HTML
export function compileBlocksToHtml(blocks: EmailBlock[], projectName: string = 'Layanan'): string {
  const contentHtml = blocks
    .map((block) => {
      switch (block.type) {
        case 'h1':
          return `<h1 style="font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; font-size: 28px; font-weight: 700; line-height: 1.3; color: ${
            block.color || '#1e293b'
          }; text-align: ${block.align || 'left'}; margin: 20px 0 10px 0;">${block.text || ''}</h1>`;
        case 'h2':
          return `<h2 style="font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; font-size: 22px; font-weight: 600; line-height: 1.35; color: ${
            block.color || '#1e293b'
          }; text-align: ${block.align || 'left'}; margin: 18px 0 8px 0;">${block.text || ''}</h2>`;
        case 'h3':
          return `<h3 style="font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; font-size: 18px; font-weight: 600; line-height: 1.4; color: ${
            block.color || '#1e293b'
          }; text-align: ${block.align || 'left'}; margin: 16px 0 6px 0;">${block.text || ''}</h3>`;
        case 'h4':
          return `<h4 style="font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; font-size: 16px; font-weight: 600; line-height: 1.4; color: ${
            block.color || '#1e293b'
          }; text-align: ${block.align || 'left'}; margin: 14px 0 6px 0;">${block.text || ''}</h4>`;
        case 'h5':
          return `<h5 style="font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14px; font-weight: 600; line-height: 1.4; color: ${
            block.color || '#334155'
          }; text-align: ${block.align || 'left'}; margin: 12px 0 4px 0;">${block.text || ''}</h5>`;
        case 'h6':
          return `<h6 style="font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: ${
            block.color || '#64748b'
          }; text-align: ${block.align || 'left'}; margin: 10px 0 4px 0;">${block.text || ''}</h6>`;

        case 'paragraph': {
          let formattedText = (block.text || '').replace(/\n/g, '<br />');
          if (block.isBold) formattedText = `<b>${formattedText}</b>`;
          if (block.isItalic) formattedText = `<i>${formattedText}</i>`;
          if (block.isUnderline) formattedText = `<u>${formattedText}</u>`;
          if (block.linkUrl) {
            formattedText = `${formattedText} <a href="${block.linkUrl}" style="color: #6094d4; font-weight: 600; text-decoration: underline;">${
              block.linkText || 'Pelajari Selengkapnya &rarr;'
            }</a>`;
          }
          return `<p style="font-family: Roboto, -apple-system, BlinkMacSystemFont, sans-serif; font-size: ${
            block.fontSize || '15px'
          }; line-height: 1.65; color: ${block.color || '#334155'}; text-align: ${
            block.align || 'left'
          }; margin: 0 0 16px 0;">${formattedText}</p>`;
        }

        case 'button': {
          const radiusStyle =
            block.btnRadius === 'pill'
              ? 'border-radius: 9999px;'
              : block.btnRadius === 'sharp'
              ? 'border-radius: 0px;'
              : 'border-radius: 6px;';
          const fullWidthStyle = block.btnFullWidth
            ? 'display: block; width: 100%; box-sizing: border-box; text-align: center;'
            : 'display: inline-block;';

          return `<div style="text-align: ${block.align || 'center'}; margin: 24px 0;">
            <a href="${block.btnUrl || '#'}" style="background-color: ${
            block.btnBgColor || '#6094d4'
          }; color: ${
            block.btnTextColor || '#ffffff'
          }; padding: 13px 28px; text-decoration: none; font-weight: 600; font-size: 15px; font-family: Inter, sans-serif; ${radiusStyle} ${fullWidthStyle}">
              ${block.btnLabel || 'Aksi Utama'}
            </a>
          </div>`;
        }

        case 'image': {
          const imgTag = `<img src="${
            block.imageUrl ||
            'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80'
          }" alt="${block.imageAlt || 'Gambar Email'}" style="max-width: 100%; width: ${
            block.imageWidth || '100%'
          }; height: auto; border-radius: ${
            block.imageRadius || '8px'
          }; border: 1px solid #e2e8f0; display: block; margin: 0 auto;" />`;

          return `<div style="text-align: ${block.align || 'center'}; margin: 18px 0;">
            ${block.imageLink ? `<a href="${block.imageLink}">${imgTag}</a>` : imgTag}
          </div>`;
        }

        case 'grid2':
          return `<table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; border-collapse: collapse;">
            <tr>
              <td width="48%" style="vertical-align: top; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                ${
                  block.col1Image
                    ? `<img src="${block.col1Image}" style="width: 100%; height: auto; border-radius: 6px; margin-bottom: 12px;" />`
                    : ''
                }
                <h4 style="margin: 0 0 6px 0; font-size: 15px; font-family: Inter, sans-serif; color: #1e293b;">${
                  block.col1Title || 'Fitur 1'
                }</h4>
                <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.5; color: #475569; font-family: Roboto, sans-serif;">${
                  block.col1Text || ''
                }</p>
                ${
                  block.col1Btn
                    ? `<a href="${
                        block.col1BtnUrl || '#'
                      }" style="color: #6094d4; font-size: 12px; font-weight: 600; text-decoration: none;">${
                        block.col1Btn
                      }</a>`
                    : ''
                }
              </td>
              <td width="4%"></td>
              <td width="48%" style="vertical-align: top; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                ${
                  block.col2Image
                    ? `<img src="${block.col2Image}" style="width: 100%; height: auto; border-radius: 6px; margin-bottom: 12px;" />`
                    : ''
                }
                <h4 style="margin: 0 0 6px 0; font-size: 15px; font-family: Inter, sans-serif; color: #1e293b;">${
                  block.col2Title || 'Fitur 2'
                }</h4>
                <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.5; color: #475569; font-family: Roboto, sans-serif;">${
                  block.col2Text || ''
                }</p>
                ${
                  block.col2Btn
                    ? `<a href="${
                        block.col2BtnUrl || '#'
                      }" style="color: #6094d4; font-size: 12px; font-weight: 600; text-decoration: none;">${
                        block.col2Btn
                      }</a>`
                    : ''
                }
              </td>
            </tr>
          </table>`;

        case 'grid3':
          return `<table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; border-collapse: collapse;">
            <tr>
              <td width="31%" style="vertical-align: top; padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center;">
                <h4 style="margin: 0 0 4px 0; font-size: 14px; font-family: Inter, sans-serif; color: #1e293b;">${
                  block.col1Title || 'Langkah 1'
                }</h4>
                <p style="margin: 0; font-size: 12px; line-height: 1.45; color: #64748b; font-family: Roboto, sans-serif;">${
                  block.col1Text || ''
                }</p>
              </td>
              <td width="3%"></td>
              <td width="31%" style="vertical-align: top; padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center;">
                <h4 style="margin: 0 0 4px 0; font-size: 14px; font-family: Inter, sans-serif; color: #1e293b;">${
                  block.col2Title || 'Langkah 2'
                }</h4>
                <p style="margin: 0; font-size: 12px; line-height: 1.45; color: #64748b; font-family: Roboto, sans-serif;">${
                  block.col2Text || ''
                }</p>
              </td>
              <td width="3%"></td>
              <td width="31%" style="vertical-align: top; padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center;">
                <h4 style="margin: 0 0 4px 0; font-size: 14px; font-family: Inter, sans-serif; color: #1e293b;">${
                  block.col3Title || 'Langkah 3'
                }</h4>
                <p style="margin: 0; font-size: 12px; line-height: 1.45; color: #64748b; font-family: Roboto, sans-serif;">${
                  block.col3Text || ''
                }</p>
              </td>
            </tr>
          </table>`;

        case 'separator':
          return `<div style="margin: ${block.separatorMargin || '24px'} auto; width: ${
            block.separatorWidth || '100%'
          };">
            <hr style="border: none; border-top: ${block.separatorThickness || '1px'} ${
            block.separatorStyle || 'solid'
          } ${block.separatorColor || '#e2e8f0'}; margin: 0;" />
          </div>`;

        case 'spacer':
          return `<div style="height: ${block.spacerHeight || 28}px; line-height: ${
            block.spacerHeight || 28
          }px;">&nbsp;</div>`;

        case 'callout': {
          const bg = block.calloutType === 'promo' ? '#edf4fc' : '#f8fafc';
          const border = block.calloutType === 'promo' ? '#d6e5f7' : '#e2e8f0';
          return `<div style="padding: 18px; background-color: ${bg}; border: 1px solid ${border}; border-radius: 8px; margin: 18px 0;">
            <h4 style="margin: 0 0 6px 0; font-size: 15px; font-family: Inter, sans-serif; color: #1e293b; font-weight: 700;">${
              block.calloutTitle || 'Sorotan'
            }</h4>
            <p style="margin: 0; font-size: 13.5px; line-height: 1.5; color: #334155; font-family: Roboto, sans-serif;">${
              block.text || ''
            }</p>
          </div>`;
        }

        case 'social': {
          const links = block.socialLinks || {};
          const iconsHtml = [];
          if (links.website)
            iconsHtml.push(
              `<a href="${links.website}" style="color: #6094d4; text-decoration: none; font-size: 12px; margin: 0 8px; font-weight: 600;">Website</a>`
            );
          if (links.twitter)
            iconsHtml.push(
              `<a href="${links.twitter}" style="color: #6094d4; text-decoration: none; font-size: 12px; margin: 0 8px; font-weight: 600;">Twitter/X</a>`
            );
          if (links.instagram)
            iconsHtml.push(
              `<a href="${links.instagram}" style="color: #6094d4; text-decoration: none; font-size: 12px; margin: 0 8px; font-weight: 600;">Instagram</a>`
            );
          if (links.linkedin)
            iconsHtml.push(
              `<a href="${links.linkedin}" style="color: #6094d4; text-decoration: none; font-size: 12px; margin: 0 8px; font-weight: 600;">LinkedIn</a>`
            );

          return `<div style="text-align: center; padding: 16px 0; margin: 16px 0;">
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; font-family: Roboto, sans-serif;">Terhubung dengan kami:</p>
            <div>${iconsHtml.join(' &bull; ')}</div>
          </div>`;
        }

        case 'unsubscribe':
          return `<div style="text-align: center; padding: 24px 16px; font-size: 12px; line-height: 1.6; color: #94a3b8; font-family: Roboto, sans-serif; border-top: 1px solid #e2e8f0; margin-top: 32px;">
            <p style="margin: 0 0 6px 0;">${
              block.unsubscribeNotice || `Anda menerima email ini dari ${projectName}.`
            }</p>
            <p style="margin: 0 0 8px 0;">${
              block.companyAddress || 'Jakarta, Indonesia'
            }</p>
            <p style="margin: 0;">
              <a href="{{unsubscribe_url}}" style="color: #6094d4; text-decoration: underline;">Berhenti Berlangganan (Unsubscribe)</a>
              &bull;
              <a href="#" style="color: #6094d4; text-decoration: underline;">Kelola Preferensi</a>
            </p>
          </div>`;

        default:
          return '';
      }
    })
    .join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: Roboto, -apple-system, BlinkMacSystemFont, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container (Max 600px) -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 28px;">
              ${contentHtml}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

let blockCounter = 1000;
function createNextBlockId(): string {
  blockCounter += 1;
  return `b-${blockCounter}`;
}

export default function BlockEmailEditor({
  initialHtml,
  onChangeHtml,
  projectName = 'Proyek Bisnis',
}: BlockEmailEditorProps) {
  const [blocks, setBlocks] = useState<EmailBlock[]>(DEFAULT_BLOCKS);
  const [selectedBlockId, setSelectedBlockId] = useState<string>(DEFAULT_BLOCKS[0].id);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');

  // Sync to parent HTML whenever blocks change
  useEffect(() => {
    const html = compileBlocksToHtml(blocks, projectName);
    onChangeHtml(html);
  }, [blocks, projectName, onChangeHtml]);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || blocks[0];

  // Block Manipulation Actions
  const handleAddBlock = (type: BlockType, insertIndex?: number) => {
    const newId = createNextBlockId();
    let newBlock: EmailBlock = { id: newId, type };

    switch (type) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        newBlock = {
          ...newBlock,
          text:
            type === 'h1'
              ? 'Judul Utama Baru'
              : type === 'h2'
              ? 'Subjudul Bagian'
              : type === 'h3'
              ? 'Judul Seksi'
              : type === 'h4'
              ? 'Subseksi Minor'
              : type === 'h5'
              ? 'Label Header'
              : 'Keterangan Khusus',
          align: 'left',
          color: '#1e293b',
        };
        break;

      case 'paragraph':
        newBlock = {
          ...newBlock,
          text: 'Tuliskan paragraf teks informatif baru Anda di sini.',
          align: 'left',
          color: '#334155',
          fontSize: '15px',
        };
        break;

      case 'button':
        newBlock = {
          ...newBlock,
          btnLabel: 'Tombol Aksi &rarr;',
          btnUrl: 'https://example.com',
          btnBgColor: '#6094d4',
          btnTextColor: '#ffffff',
          btnRadius: 'rounded',
          align: 'center',
        };
        break;

      case 'image':
        newBlock = {
          ...newBlock,
          imageUrl:
            'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
          imageAlt: 'Gambar Ilustrasi',
          imageWidth: '100%',
          imageRadius: '8px',
          align: 'center',
        };
        break;

      case 'grid2':
        newBlock = {
          ...newBlock,
          col1Title: 'Layanan Pertama',
          col1Text: 'Penjelasan manfaat solusi pertama.',
          col1Btn: 'Pelajari',
          col1BtnUrl: 'https://example.com',
          col2Title: 'Layanan Kedua',
          col2Text: 'Penjelasan manfaat solusi kedua.',
          col2Btn: 'Pelajari',
          col2BtnUrl: 'https://example.com',
        };
        break;

      case 'grid3':
        newBlock = {
          ...newBlock,
          col1Title: 'Langkah 1',
          col1Text: 'Daftar akun gratis',
          col2Title: 'Langkah 2',
          col2Text: 'Verifikasi email',
          col3Title: 'Langkah 3',
          col3Text: 'Mulai kampanye',
        };
        break;

      case 'separator':
        newBlock = {
          ...newBlock,
          separatorStyle: 'solid',
          separatorColor: '#e2e8f0',
          separatorThickness: '1px',
          separatorMargin: '24px',
          separatorWidth: '100%',
        };
        break;

      case 'spacer':
        newBlock = {
          ...newBlock,
          spacerHeight: 28,
        };
        break;

      case 'callout':
        newBlock = {
          ...newBlock,
          calloutTitle: 'Pemberitahuan Terkini',
          text: 'Penting: Pembaruan sistem akan berlangsung malam ini pukul 23:00 WIB.',
          calloutType: 'info',
        };
        break;

      case 'social':
        newBlock = {
          ...newBlock,
          socialLinks: {
            website: 'https://example.com',
            twitter: 'https://twitter.com',
            instagram: 'https://instagram.com',
            linkedin: 'https://linkedin.com',
          },
        };
        break;

      case 'unsubscribe':
        newBlock = {
          ...newBlock,
          companyAddress: 'Jakarta, Indonesia',
          unsubscribeNotice: 'Anda menerima pesan ini karena terdaftar pada mailing list kami.',
        };
        break;
    }

    if (typeof insertIndex === 'number') {
      const copy = [...blocks];
      copy.splice(insertIndex + 1, 0, newBlock);
      setBlocks(copy);
    } else {
      setBlocks([...blocks, newBlock]);
    }
    setSelectedBlockId(newId);
  };

  const handleUpdateBlock = (id: string, updates: Partial<EmailBlock>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const copy = [...blocks];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    setBlocks(copy);
  };

  const handleDuplicateBlock = (block: EmailBlock, index: number) => {
    const duplicated: EmailBlock = {
      ...block,
      id: createNextBlockId(),
    };
    const copy = [...blocks];
    copy.splice(index + 1, 0, duplicated);
    setBlocks(copy);
    setSelectedBlockId(duplicated.id);
  };

  const handleDeleteBlock = (id: string) => {
    if (blocks.length <= 1) return;
    const filtered = blocks.filter((b) => b.id !== id);
    setBlocks(filtered);
    setSelectedBlockId(filtered[0]?.id || '');
  };

  const insertVariableIntoBlock = (varName: string) => {
    if (!selectedBlock) return;
    if (selectedBlock.text !== undefined) {
      handleUpdateBlock(selectedBlock.id, {
        text: (selectedBlock.text || '') + ' ' + varName,
      });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col min-h-[700px]">
      {/* Top Toolbar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#6094d4]" />
            <span>Visual Block Editor</span>
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#edf4fc] text-[#335c94] border border-[#d6e5f7]">
            {blocks.length} Blok Komponen
          </span>
        </div>

        {/* Dynamic Variable Pills */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500 hidden sm:inline">+ Tag Dinamis:</span>
          <button
            type="button"
            onClick={() => insertVariableIntoBlock('{{subscriber.name}}')}
            className="px-2 py-1 bg-white hover:bg-[#edf4fc] border border-slate-200 rounded text-[11px] text-slate-700 font-mono transition-colors cursor-pointer"
            title="Sisipkan Nama Subscriber"
          >
            Nama
          </button>
          <button
            type="button"
            onClick={() => insertVariableIntoBlock('{{subscriber.email}}')}
            className="px-2 py-1 bg-white hover:bg-[#edf4fc] border border-slate-200 rounded text-[11px] text-slate-700 font-mono transition-colors cursor-pointer"
            title="Sisipkan Email"
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => insertVariableIntoBlock('{{project.name}}')}
            className="px-2 py-1 bg-white hover:bg-[#edf4fc] border border-slate-200 rounded text-[11px] text-slate-700 font-mono transition-colors cursor-pointer"
            title="Sisipkan Nama Proyek"
          >
            Proyek
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Viewport Mode Switcher */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setDevicePreview('desktop')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                devicePreview === 'desktop'
                  ? 'bg-[#6094d4] text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
              title="Pratinjau Desktop"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDevicePreview('mobile')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                devicePreview === 'mobile'
                  ? 'bg-[#6094d4] text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
              title="Pratinjau Smartphone"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Workspace 3-Column Layout: Left (Blocks Catalog) | Center (Canvas) | Right (Inspector) */}
      <div className="flex-1 flex flex-col lg:flex-row bg-slate-50 min-h-[640px]">
        {/* Left: Component Catalog Palette */}
        <div className="w-full lg:w-56 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 p-3 shrink-0 space-y-4 overflow-y-auto max-h-[700px]">
          <div>
            <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">
              Judul (Headings H1 - H6)
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleAddBlock('h1')}
                className="p-1.5 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-[11px] text-slate-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Heading1 className="w-3.5 h-3.5 text-[#6094d4]" />
                <span>H1 Utama</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('h2')}
                className="p-1.5 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-[11px] text-slate-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Heading2 className="w-3.5 h-3.5 text-[#6094d4]" />
                <span>H2 Sub</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('h3')}
                className="p-1.5 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-[11px] text-slate-700 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Heading3 className="w-3.5 h-3.5 text-[#6094d4]" />
                <span>H3 Seksi</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('h4')}
                className="p-1.5 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-[11px] text-slate-700 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Heading4 className="w-3.5 h-3.5 text-[#6094d4]" />
                <span>H4 Minor</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('h5')}
                className="p-1.5 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-[11px] text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Heading5 className="w-3.5 h-3.5 text-[#6094d4]" />
                <span>H5 Kecil</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('h6')}
                className="p-1.5 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-[11px] text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Heading6 className="w-3.5 h-3.5 text-[#6094d4]" />
                <span>H6 Label</span>
              </button>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">
              Teks & Media
            </div>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleAddBlock('paragraph')}
                className="w-full text-left p-2 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-xs text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Type className="w-3.5 h-3.5 text-[#6094d4]" />
                <span>Paragraf Teks</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('image')}
                className="w-full text-left p-2 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-xs text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#6094d4]" />
                <span>Gambar dari URL</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('button')}
                className="w-full text-left p-2 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-xs text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <SquareCheck className="w-3.5 h-3.5 text-[#6094d4]" />
                <span>Tombol CTA</span>
              </button>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">
              Struktur Grid & Layout
            </div>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleAddBlock('grid2')}
                className="w-full text-left p-2 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-xs text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Columns className="w-3.5 h-3.5 text-[#6094d4]" />
                <span>2 Kolom Fitur</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('grid3')}
                className="w-full text-left p-2 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-xs text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Columns3 className="w-3.5 h-3.5 text-[#6094d4]" />
                <span>3 Kolom Langkah</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('separator')}
                className="w-full text-left p-2 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-xs text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5 text-[#6094d4]" />
                <span>Garis Pembatas</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('spacer')}
                className="w-full text-left p-2 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-xs text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#6094d4]" />
                <span>Spacer (Ruang Kosong)</span>
              </button>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">
              Fitur Tambahan
            </div>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleAddBlock('callout')}
                className="w-full text-left p-2 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-xs text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#6094d4]" />
                <span>Kotak Sorotan</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('social')}
                className="w-full text-left p-2 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-xs text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#6094d4]" />
                <span>Tautan Sosial</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('unsubscribe')}
                className="w-full text-left p-2 rounded border border-slate-200 hover:border-[#6094d4] hover:bg-[#edf4fc] text-xs text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#6094d4]" />
                <span>Footer Unsubscribe</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center: Live Interactive Canvas */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[700px] flex justify-center items-start">
          <div
            className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all ${
              devicePreview === 'mobile' ? 'w-[375px]' : 'w-full max-w-[620px]'
            }`}
          >
            {/* Simulated Email Envelope Header */}
            <div className="border-b border-slate-100 pb-3 mb-4 text-[11px] text-slate-400 space-y-1">
              <div>
                <span className="font-semibold text-slate-600">Dari:</span> {projectName} &lt;newsletter@{projectName.toLowerCase().replace(/\s+/g, '')}.com&gt;
              </div>
              <div>
                <span className="font-semibold text-slate-600">Kepada:</span> Rizky Firmansyah &lt;rizky@example.com&gt;
              </div>
            </div>

            {/* Render Blocks */}
            <div className="space-y-3">
              {blocks.map((block, index) => {
                const isSelected = block.id === selectedBlockId;

                return (
                  <div
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={`relative group rounded-lg p-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-[#6094d4] bg-[#edf4fc]/20'
                        : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    {/* Action Toolbar on Hover / Selection */}
                    <div
                      className={`absolute -top-3 right-2 z-10 flex items-center gap-1 bg-white border border-slate-200 shadow-xs rounded-md px-1 py-0.5 text-[10px] ${
                        isSelected ? 'flex' : 'hidden group-hover:flex'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveBlock(index, 'up');
                        }}
                        disabled={index === 0}
                        className="p-1 text-slate-500 hover:text-[#6094d4] disabled:opacity-30 cursor-pointer"
                        title="Geser ke Atas"
                      >
                        <MoveUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveBlock(index, 'down');
                        }}
                        disabled={index === blocks.length - 1}
                        className="p-1 text-slate-500 hover:text-[#6094d4] disabled:opacity-30 cursor-pointer"
                        title="Geser ke Bawah"
                      >
                        <MoveDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateBlock(block, index);
                        }}
                        className="p-1 text-slate-500 hover:text-[#6094d4] cursor-pointer"
                        title="Duplikat Blok"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBlock(block.id);
                        }}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                        title="Hapus Blok"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Block Render */}
                    <div>
                      {block.type === 'h1' && (
                        <h1
                          style={{
                            textAlign: block.align || 'left',
                            color: block.color || '#1e293b',
                          }}
                          className="text-2xl font-bold font-heading leading-tight"
                        >
                          {block.text || 'Judul Utama H1'}
                        </h1>
                      )}

                      {block.type === 'h2' && (
                        <h2
                          style={{
                            textAlign: block.align || 'left',
                            color: block.color || '#1e293b',
                          }}
                          className="text-xl font-bold font-heading"
                        >
                          {block.text || 'Subjudul H2'}
                        </h2>
                      )}

                      {block.type === 'h3' && (
                        <h3
                          style={{
                            textAlign: block.align || 'left',
                            color: block.color || '#1e293b',
                          }}
                          className="text-lg font-semibold font-heading"
                        >
                          {block.text || 'Judul Seksi H3'}
                        </h3>
                      )}

                      {block.type === 'h4' && (
                        <h4
                          style={{
                            textAlign: block.align || 'left',
                            color: block.color || '#1e293b',
                          }}
                          className="text-base font-semibold font-heading"
                        >
                          {block.text || 'Judul Minor H4'}
                        </h4>
                      )}

                      {block.type === 'h5' && (
                        <h5
                          style={{
                            textAlign: block.align || 'left',
                            color: block.color || '#334155',
                          }}
                          className="text-sm font-semibold font-heading"
                        >
                          {block.text || 'Header Kecil H5'}
                        </h5>
                      )}

                      {block.type === 'h6' && (
                        <h6
                          style={{
                            textAlign: block.align || 'left',
                            color: block.color || '#64748b',
                          }}
                          className="text-xs font-bold uppercase tracking-wider font-heading"
                        >
                          {block.text || 'Label Khusus H6'}
                        </h6>
                      )}

                      {block.type === 'paragraph' && (
                        <p
                          style={{
                            textAlign: block.align || 'left',
                            color: block.color || '#334155',
                            fontSize: block.fontSize || '15px',
                            fontWeight: block.isBold ? '700' : 'normal',
                            fontStyle: block.isItalic ? 'italic' : 'normal',
                            textDecoration: block.isUnderline ? 'underline' : 'none',
                          }}
                          className="whitespace-pre-line leading-relaxed font-sans"
                        >
                          {block.text || 'Tuliskan paragraf teks di sini...'}
                          {block.linkUrl && (
                            <span className="block mt-1 text-[#6094d4] font-medium underline">
                              {block.linkText || 'Pelajari Lebih Lanjut &rarr;'}
                            </span>
                          )}
                        </p>
                      )}

                      {block.type === 'button' && (
                        <div
                          style={{ textAlign: block.align || 'center' }}
                          className="my-3"
                        >
                          <span
                            style={{
                              backgroundColor: block.btnBgColor || '#6094d4',
                              color: block.btnTextColor || '#ffffff',
                              borderRadius:
                                block.btnRadius === 'pill'
                                  ? '9999px'
                                  : block.btnRadius === 'sharp'
                                  ? '0px'
                                  : '6px',
                              display: block.btnFullWidth ? 'block' : 'inline-block',
                            }}
                            className="px-6 py-2.5 text-xs font-semibold shadow-xs"
                          >
                            {block.btnLabel || 'Tombol Aksi'}
                          </span>
                        </div>
                      )}

                      {block.type === 'image' && (
                        <div style={{ textAlign: block.align || 'center' }} className="my-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              block.imageUrl ||
                              'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80'
                            }
                            alt={block.imageAlt || 'Gambar Email'}
                            style={{
                              width: block.imageWidth || '100%',
                              borderRadius: block.imageRadius || '8px',
                            }}
                            className="max-w-full h-auto mx-auto border border-slate-200"
                          />
                        </div>
                      )}

                      {block.type === 'grid2' && (
                        <div className="grid grid-cols-2 gap-3 my-2 text-xs">
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            <h4 className="font-bold text-slate-800 font-heading mb-1">
                              {block.col1Title || 'Fitur 1'}
                            </h4>
                            <p className="text-slate-600 mb-2 leading-relaxed">
                              {block.col1Text || 'Deskripsi fitur'}
                            </p>
                            {block.col1Btn && (
                              <span className="text-[#335c94] font-semibold text-[11px]">
                                {block.col1Btn}
                              </span>
                            )}
                          </div>
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            <h4 className="font-bold text-slate-800 font-heading mb-1">
                              {block.col2Title || 'Fitur 2'}
                            </h4>
                            <p className="text-slate-600 mb-2 leading-relaxed">
                              {block.col2Text || 'Deskripsi fitur'}
                            </p>
                            {block.col2Btn && (
                              <span className="text-[#335c94] font-semibold text-[11px]">
                                {block.col2Btn}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {block.type === 'grid3' && (
                        <div className="grid grid-cols-3 gap-2 my-2 text-center text-xs">
                          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                            <h4 className="font-bold text-slate-800 text-[11px] font-heading mb-1">
                              {block.col1Title || 'Poin 1'}
                            </h4>
                            <p className="text-slate-500 text-[10px]">{block.col1Text}</p>
                          </div>
                          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                            <h4 className="font-bold text-slate-800 text-[11px] font-heading mb-1">
                              {block.col2Title || 'Poin 2'}
                            </h4>
                            <p className="text-slate-500 text-[10px]">{block.col2Text}</p>
                          </div>
                          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                            <h4 className="font-bold text-slate-800 text-[11px] font-heading mb-1">
                              {block.col3Title || 'Poin 3'}
                            </h4>
                            <p className="text-slate-500 text-[10px]">{block.col3Text}</p>
                          </div>
                        </div>
                      )}

                      {block.type === 'separator' && (
                        <div
                          style={{
                            margin: `${block.separatorMargin || '20px'} auto`,
                            width: block.separatorWidth || '100%',
                          }}
                        >
                          <hr
                            style={{
                              borderStyle: block.separatorStyle || 'solid',
                              borderColor: block.separatorColor || '#e2e8f0',
                              borderTopWidth: block.separatorThickness || '1px',
                            }}
                          />
                        </div>
                      )}

                      {block.type === 'spacer' && (
                        <div
                          style={{ height: `${block.spacerHeight || 28}px` }}
                          className="bg-slate-100/50 border border-dashed border-slate-200 rounded text-center text-[10px] text-slate-400 flex items-center justify-center"
                        >
                          Spacer ({block.spacerHeight || 28}px)
                        </div>
                      )}

                      {block.type === 'callout' && (
                        <div className="p-3.5 bg-[#edf4fc] border border-[#d6e5f7] rounded-lg my-2 text-xs">
                          <h4 className="font-bold text-slate-800 font-heading mb-1">
                            {block.calloutTitle || 'Sorotan'}
                          </h4>
                          <p className="text-slate-700 leading-relaxed">{block.text}</p>
                        </div>
                      )}

                      {block.type === 'social' && (
                        <div className="text-center py-3 border-t border-slate-100 my-2 text-xs text-slate-500">
                          <p className="mb-1 text-[11px]">Terhubung dengan kami:</p>
                          <div className="flex items-center justify-center gap-3 text-[#335c94] font-semibold text-[11px]">
                            <span>Website</span>
                            <span>&bull;</span>
                            <span>Twitter</span>
                            <span>&bull;</span>
                            <span>Instagram</span>
                            <span>&bull;</span>
                            <span>LinkedIn</span>
                          </div>
                        </div>
                      )}

                      {block.type === 'unsubscribe' && (
                        <div className="text-center pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-1 my-2">
                          <p>{block.unsubscribeNotice || `Email dari ${projectName}`}</p>
                          <p>{block.companyAddress || 'Jakarta, Indonesia'}</p>
                          <p className="text-[#335c94] underline cursor-pointer">
                            Berhenti Berlangganan (Unsubscribe)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Inspector & Property Settings for Selected Block */}
        <div className="w-full lg:w-72 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-4 shrink-0 overflow-y-auto max-h-[700px] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Pengaturan Blok
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 uppercase font-semibold">
              {selectedBlock.type}
            </span>
          </div>

          {/* Heading Inspector (H1 - H6) */}
          {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(selectedBlock.type) && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Ubah Level Heading
                </label>
                <div className="grid grid-cols-6 gap-1">
                  {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as BlockType[]).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleUpdateBlock(selectedBlock.id, { type: h })}
                      className={`p-1 text-center font-bold uppercase rounded border text-[11px] cursor-pointer ${
                        selectedBlock.type === h
                          ? 'border-[#6094d4] bg-[#edf4fc] text-[#335c94]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Teks Judul</label>
                <textarea
                  value={selectedBlock.text || ''}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { text: e.target.value })
                  }
                  rows={2}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Perataan Teks</label>
                <div className="flex items-center gap-1">
                  {(['left', 'center', 'right'] as const).map((al) => (
                    <button
                      key={al}
                      type="button"
                      onClick={() => handleUpdateBlock(selectedBlock.id, { align: al })}
                      className={`flex-1 py-1 px-2 rounded border text-center text-[11px] capitalize cursor-pointer ${
                        selectedBlock.align === al
                          ? 'border-[#6094d4] bg-[#edf4fc] text-[#335c94]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {al}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Warna Judul</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedBlock.color || '#1e293b'}
                    onChange={(e) =>
                      handleUpdateBlock(selectedBlock.id, { color: e.target.value })
                    }
                    className="w-7 h-7 rounded border border-slate-200 p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedBlock.color || '#1e293b'}
                    onChange={(e) =>
                      handleUpdateBlock(selectedBlock.id, { color: e.target.value })
                    }
                    className="flex-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Paragraph Inspector with Rich Text Tools */}
          {selectedBlock.type === 'paragraph' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Alat Pemformat Teks
                </label>
                <div className="flex flex-wrap items-center gap-1 bg-slate-50 p-1 border border-slate-200 rounded">
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateBlock(selectedBlock.id, {
                        isBold: !selectedBlock.isBold,
                      })
                    }
                    className={`p-1.5 rounded cursor-pointer ${
                      selectedBlock.isBold
                        ? 'bg-[#6094d4] text-white'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                    title="Tebal (Bold)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateBlock(selectedBlock.id, {
                        isItalic: !selectedBlock.isItalic,
                      })
                    }
                    className={`p-1.5 rounded cursor-pointer ${
                      selectedBlock.isItalic
                        ? 'bg-[#6094d4] text-white'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                    title="Miring (Italic)"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateBlock(selectedBlock.id, {
                        isUnderline: !selectedBlock.isUnderline,
                      })
                    }
                    className={`p-1.5 rounded cursor-pointer ${
                      selectedBlock.isUnderline
                        ? 'bg-[#6094d4] text-white'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                    title="Garis Bawah (Underline)"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>

                  <div className="h-4 w-px bg-slate-300 mx-1" />

                  <button
                    type="button"
                    onClick={() => handleUpdateBlock(selectedBlock.id, { align: 'left' })}
                    className={`p-1.5 rounded cursor-pointer ${
                      selectedBlock.align === 'left'
                        ? 'bg-[#6094d4] text-white'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                    title="Rata Kiri"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateBlock(selectedBlock.id, { align: 'center' })
                    }
                    className={`p-1.5 rounded cursor-pointer ${
                      selectedBlock.align === 'center'
                        ? 'bg-[#6094d4] text-white'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                    title="Rata Tengah"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateBlock(selectedBlock.id, { align: 'right' })
                    }
                    className={`p-1.5 rounded cursor-pointer ${
                      selectedBlock.align === 'right'
                        ? 'bg-[#6094d4] text-white'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                    title="Rata Kanan"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Konten Paragraf</label>
                <textarea
                  value={selectedBlock.text || ''}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { text: e.target.value })
                  }
                  rows={4}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Tautan Teks (Link URL)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/info"
                  value={selectedBlock.linkUrl || ''}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { linkUrl: e.target.value })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6094d4] mb-1.5"
                />
                <input
                  type="text"
                  placeholder="Label Tautan (misal: Selengkapnya)"
                  value={selectedBlock.linkText || ''}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { linkText: e.target.value })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Ukuran Font</label>
                <select
                  value={selectedBlock.fontSize || '15px'}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { fontSize: e.target.value })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                >
                  <option value="13px">Kecil (13px)</option>
                  <option value="15px">Standar (15px)</option>
                  <option value="17px">Sedang (17px)</option>
                  <option value="19px">Besar (19px)</option>
                </select>
              </div>
            </div>
          )}

          {/* Button CTA Inspector */}
          {selectedBlock.type === 'button' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Teks Tombol</label>
                <input
                  type="text"
                  value={selectedBlock.btnLabel || ''}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { btnLabel: e.target.value })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Target URL Link</label>
                <input
                  type="url"
                  value={selectedBlock.btnUrl || ''}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { btnUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6094d4]"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Warna Tombol</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedBlock.btnBgColor || '#6094d4'}
                    onChange={(e) =>
                      handleUpdateBlock(selectedBlock.id, { btnBgColor: e.target.value })
                    }
                    className="w-7 h-7 rounded border border-slate-200 p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedBlock.btnBgColor || '#6094d4'}
                    onChange={(e) =>
                      handleUpdateBlock(selectedBlock.id, { btnBgColor: e.target.value })
                    }
                    className="flex-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Bentuk Sudut</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['sharp', 'rounded', 'pill'] as const).map((rad) => (
                    <button
                      key={rad}
                      type="button"
                      onClick={() =>
                        handleUpdateBlock(selectedBlock.id, { btnRadius: rad })
                      }
                      className={`p-1.5 text-center text-[11px] capitalize rounded border cursor-pointer ${
                        selectedBlock.btnRadius === rad
                          ? 'border-[#6094d4] bg-[#edf4fc] text-[#335c94]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {rad}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Perataan</label>
                <div className="flex items-center gap-1">
                  {(['left', 'center', 'right'] as const).map((al) => (
                    <button
                      key={al}
                      type="button"
                      onClick={() => handleUpdateBlock(selectedBlock.id, { align: al })}
                      className={`flex-1 py-1 px-2 rounded border text-center text-[11px] capitalize cursor-pointer ${
                        selectedBlock.align === al
                          ? 'border-[#6094d4] bg-[#edf4fc] text-[#335c94]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {al}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="fullWidthCheck"
                  checked={!!selectedBlock.btnFullWidth}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, {
                      btnFullWidth: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300 text-[#6094d4] accent-[#6094d4]"
                />
                <label htmlFor="fullWidthCheck" className="text-slate-700 cursor-pointer">
                  Tombol Lebar Penuh (100%)
                </label>
              </div>
            </div>
          )}

          {/* Image from URL Inspector */}
          {selectedBlock.type === 'image' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  URL Gambar (Image Link)
                </label>
                <input
                  type="url"
                  value={selectedBlock.imageUrl || ''}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { imageUrl: e.target.value })
                  }
                  placeholder="https://domain.com/banner.jpg"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#6094d4]"
                />
              </div>

              {/* Sample Presets */}
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  Pilihan Gambar Sampel:
                </label>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateBlock(selectedBlock.id, {
                        imageUrl:
                          'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
                      })
                    }
                    className="p-1 rounded bg-slate-100 hover:bg-[#edf4fc] text-slate-700 truncate cursor-pointer"
                  >
                    Hero Bisnis
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateBlock(selectedBlock.id, {
                        imageUrl:
                          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                      })
                    }
                    className="p-1 rounded bg-slate-100 hover:bg-[#edf4fc] text-slate-700 truncate cursor-pointer"
                  >
                    Grafik Analytics
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateBlock(selectedBlock.id, {
                        imageUrl:
                          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
                      })
                    }
                    className="p-1 rounded bg-slate-100 hover:bg-[#edf4fc] text-slate-700 truncate cursor-pointer"
                  >
                    Kolaborasi Tim
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateBlock(selectedBlock.id, {
                        imageUrl:
                          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
                      })
                    }
                    className="p-1 rounded bg-slate-100 hover:bg-[#edf4fc] text-slate-700 truncate cursor-pointer"
                  >
                    Seminar / Webinar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Tautan Klik Gambar (Opsional)
                </label>
                <input
                  type="url"
                  value={selectedBlock.imageLink || ''}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { imageLink: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Lebar Gambar</label>
                <select
                  value={selectedBlock.imageWidth || '100%'}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { imageWidth: e.target.value })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                >
                  <option value="100%">Penuh (100%)</option>
                  <option value="80%">80% Container</option>
                  <option value="60%">60% Container</option>
                  <option value="360px">Tetap 360px</option>
                  <option value="240px">Tetap 240px</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Radius Sudut (Border Radius)
                </label>
                <select
                  value={selectedBlock.imageRadius || '8px'}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { imageRadius: e.target.value })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                >
                  <option value="0px">Lancip (0px)</option>
                  <option value="6px">Halus (6px)</option>
                  <option value="12px">Bulat (12px)</option>
                  <option value="24px">Kapsul (24px)</option>
                </select>
              </div>
            </div>
          )}

          {/* Grid 2 Column Inspector */}
          {selectedBlock.type === 'grid2' && (
            <div className="space-y-3 text-xs">
              <div className="p-2 bg-slate-50 rounded border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 text-[11px]">Kolom Kiri (1)</div>
                <input
                  type="text"
                  placeholder="Judul Kolom 1"
                  value={selectedBlock.col1Title || ''}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { col1Title: e.target.value })
                  }
                  className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs"
                />
                <textarea
                  placeholder="Teks Kolom 1"
                  rows={2}
                  value={selectedBlock.col1Text || ''}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { col1Text: e.target.value })
                  }
                  className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs"
                />
                <input
                  type="text"
                  placeholder="Teks Tombol (misal: Selengkapnya)"
                  value={selectedBlock.col1Btn || ''}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { col1Btn: e.target.value })
                  }
                  className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="p-2 bg-slate-50 rounded border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 text-[11px]">Kolom Kanan (2)</div>
                <input
                  type="text"
                  placeholder="Judul Kolom 2"
                  value={selectedBlock.col2Title || ''}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { col2Title: e.target.value })
                  }
                  className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs"
                />
                <textarea
                  placeholder="Teks Kolom 2"
                  rows={2}
                  value={selectedBlock.col2Text || ''}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { col2Text: e.target.value })
                  }
                  className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs"
                />
                <input
                  type="text"
                  placeholder="Teks Tombol"
                  value={selectedBlock.col2Btn || ''}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { col2Btn: e.target.value })
                  }
                  className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs"
                />
              </div>
            </div>
          )}

          {/* Separator Inspector */}
          {selectedBlock.type === 'separator' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Gaya Garis</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['solid', 'dashed', 'dotted'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() =>
                        handleUpdateBlock(selectedBlock.id, { separatorStyle: st })
                      }
                      className={`p-1.5 text-center text-[11px] capitalize rounded border cursor-pointer ${
                        selectedBlock.separatorStyle === st
                          ? 'border-[#6094d4] bg-[#edf4fc] text-[#335c94]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Ketebalan Garis</label>
                <select
                  value={selectedBlock.separatorThickness || '1px'}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, {
                      separatorThickness: e.target.value,
                    })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                >
                  <option value="1px">1 Pixel (Tipis)</option>
                  <option value="2px">2 Pixel (Sedang)</option>
                  <option value="3px">3 Pixel (Tebal)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Jarak Spasi Margin</label>
                <select
                  value={selectedBlock.separatorMargin || '24px'}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, {
                      separatorMargin: e.target.value,
                    })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                >
                  <option value="12px">Rapat (12px)</option>
                  <option value="24px">Normal (24px)</option>
                  <option value="36px">Luas (36px)</option>
                </select>
              </div>
            </div>
          )}

          {/* Spacer Inspector */}
          {selectedBlock.type === 'spacer' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Tinggi Spasi: {selectedBlock.spacerHeight || 28}px
                </label>
                <input
                  type="range"
                  min="8"
                  max="80"
                  value={selectedBlock.spacerHeight || 28}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, {
                      spacerHeight: Number(e.target.value),
                    })
                  }
                  className="w-full accent-[#6094d4] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Callout Inspector */}
          {selectedBlock.type === 'callout' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Judul Sorotan</label>
                <input
                  type="text"
                  value={selectedBlock.calloutTitle || ''}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, {
                      calloutTitle: e.target.value,
                    })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Teks Penjelasan</label>
                <textarea
                  rows={3}
                  value={selectedBlock.text || ''}
                  onChange={(e) =>
                    handleUpdateBlock(selectedBlock.id, { text: e.target.value })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
