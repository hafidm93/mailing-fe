import { User, Project, Organization, Subscriber, Campaign, EmailTemplate, AccessPolicy } from '@/types';

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-1',
    name: 'Nusantara Tech Group',
    domain: 'nusantara-tech.com',
    memberCount: 8,
    projectsCount: 3,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'org-2',
    name: 'Sagara Growth Studio',
    domain: 'sagaragrowth.io',
    memberCount: 4,
    projectsCount: 2,
    createdAt: '2025-03-20T10:30:00Z',
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    username: 'admin',
    name: 'Ahmad Maulana (Super Admin)',
    email: 'admin@nusantara-tech.com',
    role: 'admin',
    status: 'active',
    organizationId: 'org-1',
    organizationName: 'Nusantara Tech Group',
    lastLoginAt: '2026-09-21T01:10:00Z',
    createdAt: '2025-01-15T08:30:00Z',
  },
  {
    id: 'usr-marketing',
    username: 'marketing',
    name: 'Sarah Wijaya (Marketing Lead)',
    email: 'sarah.marketing@nusantara-tech.com',
    role: 'marketing',
    status: 'active',
    organizationId: 'org-1',
    organizationName: 'Nusantara Tech Group',
    lastLoginAt: '2026-09-20T14:45:00Z',
    createdAt: '2025-02-01T09:15:00Z',
  },
  {
    id: 'usr-sales',
    username: 'sales',
    name: 'Budi Pratama (Sales Rep)',
    email: 'budi.sales@nusantara-tech.com',
    role: 'sales',
    status: 'active',
    organizationId: 'org-1',
    organizationName: 'Nusantara Tech Group',
    lastLoginAt: '2026-09-19T11:20:00Z',
    createdAt: '2025-02-10T14:00:00Z',
  },
  {
    id: 'usr-dimas',
    username: 'dimas',
    name: 'Dimas Kurniawan',
    email: 'dimas.k@nusantara-tech.com',
    role: 'marketing',
    status: 'active',
    organizationId: 'org-1',
    organizationName: 'Nusantara Tech Group',
    lastLoginAt: '2026-09-18T16:00:00Z',
    createdAt: '2025-04-12T10:00:00Z',
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj-saas',
    name: 'SaaS Platform Landing Page',
    slug: 'saas-platform',
    description: 'B2B enterprise automation tools landing page & product updates newsletter.',
    websiteUrl: 'https://saas-platform.com',
    organizationId: 'org-1',
    organizationName: 'Nusantara Tech Group',
    subscriberCount: 1420,
    activeCampaignsCount: 4,
    apiKey: 'ml_live_9f82d1c9a87341e0b',
    createdAt: '2025-01-20T10:00:00Z',
    smtp: {
      host: 'smtp.mailgun.org',
      port: 587,
      secure: true,
      user: 'postmaster@saas-platform.com',
      pass: '••••••••••••••••',
      fromName: 'SaaS Platform Team',
      fromEmail: 'updates@saas-platform.com',
      isVerified: true,
      lastTestedAt: '2026-09-19T08:30:00Z',
    },
  },
  {
    id: 'prj-ecommerce',
    name: 'Artisan Store Promo Page',
    slug: 'artisan-store',
    description: 'Weekly promotional flash sales, product releases, and discount vouchers.',
    websiteUrl: 'https://artisanstore.id',
    organizationId: 'org-1',
    organizationName: 'Nusantara Tech Group',
    subscriberCount: 3840,
    activeCampaignsCount: 7,
    apiKey: 'ml_live_b4382c7f12e9401a8',
    createdAt: '2025-02-14T11:30:00Z',
    smtp: {
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: true,
      user: 'apikey',
      pass: '••••••••••••••••',
      fromName: 'Artisan Store Special Offers',
      fromEmail: 'promo@artisanstore.id',
      isVerified: true,
      lastTestedAt: '2026-09-20T12:00:00Z',
    },
  },
  {
    id: 'prj-devtech',
    name: 'DevTech Engineering Blog',
    slug: 'devtech-blog',
    description: 'Bi-weekly tech digests, frontend engineering architecture tutorials.',
    websiteUrl: 'https://devtech.engineering',
    organizationId: 'org-1',
    organizationName: 'Nusantara Tech Group',
    subscriberCount: 890,
    activeCampaignsCount: 2,
    apiKey: 'ml_live_38d91f4c71a04e5bc',
    createdAt: '2025-03-05T09:00:00Z',
    smtp: {
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      user: 'resend',
      pass: '••••••••••••••••',
      fromName: 'DevTech Editorial',
      fromEmail: 'newsletter@devtech.engineering',
      isVerified: false,
    },
  },
  {
    id: 'prj-finedge',
    name: 'FinEdge Mobile App Waitlist',
    slug: 'finedge-waitlist',
    description: 'Early access waitlist signups and product rollout milestones.',
    websiteUrl: 'https://finedge.app',
    organizationId: 'org-2',
    organizationName: 'Sagara Growth Studio',
    subscriberCount: 2150,
    activeCampaignsCount: 3,
    apiKey: 'ml_live_7a02c9d81e3f4210b',
    createdAt: '2025-04-01T15:00:00Z',
    smtp: {
      host: 'smtp.postmarkapp.com',
      port: 587,
      secure: true,
      user: 'finedge-smtp-token',
      pass: '••••••••••••••••',
      fromName: 'FinEdge Beta Team',
      fromEmail: 'hello@finedge.app',
      isVerified: true,
      lastTestedAt: '2026-09-18T10:15:00Z',
    },
  },
];

export const INITIAL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl-product-launch',
    name: 'Product Feature Announcement v2',
    category: 'Product Update',
    description: 'High-converting layout for announcing major product capabilities with CTA buttons.',
    subject: 'Introducing {{project.name}} 2026: Fast, Seamless, Integrated',
    updatedAt: '2026-09-18T10:00:00Z',
    mjmlContent: `<mjml>
  <mj-body background-color="#f8fafc">
    <mj-section background-color="#2563eb" padding="28px 24px">
      <mj-column>
        <mj-text color="#ffffff" font-size="20px" font-weight="bold" font-family="Inter, sans-serif">
          {{project.name}}
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" padding="36px 24px">
      <mj-column>
        <mj-text font-size="22px" font-weight="bold" color="#0f172a" font-family="Inter, sans-serif">
          Halo {{subscriber.name}}, Fitur Baru Telah Hadir!
        </mj-text>
        <mj-text font-size="15px" color="#334155" line-height="1.6" font-family="Roboto, sans-serif">
          Kami sangat bersemangat membagikan pembaruan sistem terbaru yang dirancang untuk mempercepat alur kerja kampanye email Anda. Dapatkan efisiensi pengiriman yang lebih tinggi dan pelacakan metrik real-time.
        </mj-text>
        <mj-button background-color="#2563eb" color="#ffffff" font-size="15px" font-weight="bold" border-radius="6px" href="https://example.com/explore" padding="20px 0">
          Jelajahi Fitur Sekarang
        </mj-button>
      </mj-column>
    </mj-section>
    <mj-section background-color="#f1f5f9" padding="20px 24px">
      <mj-column>
        <mj-text font-size="12px" color="#64748b" align="center" font-family="Roboto, sans-serif">
          Anda menerima email ini karena terdaftar pada {{project.name}}.
          <br/>
          <a href="{{unsubscribe_url}}" style="color: #2563eb; text-decoration: underline;">Berhenti Berlangganan (Unsubscribe)</a>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`,
    htmlContent: `<div style="background-color: #f8fafc; font-family: Roboto, sans-serif; padding: 24px 0; color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #2563eb; padding: 24px 32px;">
      <h2 style="margin: 0; color: #ffffff; font-family: Inter, sans-serif; font-size: 20px; font-weight: 700;">{{project.name}}</h2>
    </div>
    <div style="padding: 32px;">
      <h1 style="margin: 0 0 16px 0; font-family: Inter, sans-serif; font-size: 24px; font-weight: 700; color: #0f172a;">Halo {{subscriber.name}}, Fitur Baru Telah Hadir!</h1>
      <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #334155;">
        Kami sangat bersemangat membagikan pembaruan sistem terbaru yang dirancang untuk mempercepat alur kerja kampanye email Anda. Dapatkan efisiensi pengiriman yang lebih tinggi dan pelacakan metrik real-time.
      </p>
      <div style="margin: 28px 0;">
        <a href="https://example.com/explore" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; font-size: 15px;">Jelajahi Fitur Sekarang &rarr;</a>
      </div>
    </div>
    <div style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
      <p style="margin: 0 0 8px 0;">Anda menerima email ini karena berlangganan pada <strong>{{project.name}}</strong>.</p>
      <p style="margin: 0;"><a href="{{unsubscribe_url}}" style="color: #2563eb; text-decoration: underline;">Berhenti Berlangganan (Unsubscribe)</a></p>
    </div>
  </div>
</div>`,
  },
  {
    id: 'tpl-newsletter-weekly',
    name: 'Weekly Marketing Digest',
    category: 'Newsletter',
    description: 'Clean curated content layout with highlights, articles, and upcoming events.',
    subject: 'Weekly Insight: Top Growth Tactics for {{subscriber.name}}',
    updatedAt: '2026-09-15T14:30:00Z',
    mjmlContent: `<mjml>
  <mj-body background-color="#f8fafc">
    <mj-section background-color="#0f172a" padding="24px">
      <mj-column>
        <mj-text color="#ffffff" font-size="18px" font-weight="bold" font-family="Inter, sans-serif">
          {{project.name}} Digest
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section background-color="#ffffff" padding="32px 24px">
      <mj-column>
        <mj-text font-size="20px" font-weight="bold" color="#0f172a" font-family="Inter, sans-serif">
          Rangkuman Tren Marketing Minggu Ini
        </mj-text>
        <mj-text font-size="14px" color="#334155" line-height="1.6" font-family="Roboto, sans-serif">
          Hai {{subscriber.name}}, berikut adalah rangkuman strategi konversi landing page dan peningkatan open-rate email yang sudah diuji oleh tim kami minggu ini.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`,
    htmlContent: `<div style="background-color: #f8fafc; font-family: Roboto, sans-serif; padding: 24px 0; color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #0f172a; padding: 24px 32px;">
      <h2 style="margin: 0; color: #ffffff; font-family: Inter, sans-serif; font-size: 20px; font-weight: 700;">{{project.name}} Digest</h2>
    </div>
    <div style="padding: 32px;">
      <h1 style="margin: 0 0 16px 0; font-family: Inter, sans-serif; font-size: 22px; font-weight: 700; color: #0f172a;">Rangkuman Tren Marketing Minggu Ini</h1>
      <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #334155;">
        Hai {{subscriber.name}}, berikut adalah rangkuman strategi konversi landing page dan peningkatan open-rate email yang sudah diuji oleh tim kami minggu ini.
      </p>
      <div style="border-left: 3px solid #2563eb; padding-left: 16px; margin: 20px 0;">
        <h3 style="margin: 0 0 6px 0; font-size: 16px; color: #0f172a;">1. Personalisasi Baris Subjek Email</h3>
        <p style="margin: 0; font-size: 14px; color: #475569;">Penyebutan nama dan konteks relevan meningkatkan open-rate hingga 34%.</p>
      </div>
      <div style="border-left: 3px solid #2563eb; padding-left: 16px; margin: 20px 0;">
        <h3 style="margin: 0 0 6px 0; font-size: 16px; color: #0f172a;">2. Pengoptimalan Waktu Pengiriman Batch</h3>
        <p style="margin: 0; font-size: 14px; color: #475569;">Kirim pesan secara bertahap untuk menjaga reputasi IP SMTP Anda tetap prima.</p>
      </div>
    </div>
    <div style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
      <p style="margin: 0;"><a href="{{unsubscribe_url}}" style="color: #2563eb; text-decoration: underline;">Kelola Preferensi / Berhenti Berlangganan</a></p>
    </div>
  </div>
</div>`,
  },
  {
    id: 'tpl-flash-promo',
    name: 'Special Flash Promo Offer',
    category: 'Promotion',
    description: 'High-urgency promotional email template with prominent discount code block.',
    subject: 'Penawaran Spesial 48 Jam untuk {{subscriber.name}}',
    updatedAt: '2026-09-10T08:00:00Z',
    mjmlContent: `<mjml>
  <mj-body background-color="#f8fafc">
    <mj-section background-color="#2563eb" padding="32px 24px">
      <mj-column>
        <mj-text color="#ffffff" font-size="24px" font-weight="bold" align="center" font-family="Inter, sans-serif">
          DISKON SPESIAL 30%
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`,
    htmlContent: `<div style="background-color: #f8fafc; font-family: Roboto, sans-serif; padding: 24px 0; color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #2563eb; padding: 32px 24px; text-align: center;">
      <span style="display: inline-block; background-color: #1d4ed8; color: #ffffff; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 12px;">Penawaran Terbatas</span>
      <h1 style="margin: 0; color: #ffffff; font-family: Inter, sans-serif; font-size: 28px; font-weight: 800;">HEMAT 30% HARI INI</h1>
    </div>
    <div style="padding: 32px; text-align: center;">
      <p style="font-size: 16px; color: #334155; margin: 0 0 20px 0;">
        Halo {{subscriber.name}}, terima kasih telah setia bersama {{project.name}}. Gunakan kode kupon eksklusif ini saat checkout sebelum periode promo berakhir:
      </p>
      <div style="background-color: #eff6ff; border: 2px dashed #2563eb; padding: 16px 24px; border-radius: 6px; display: inline-block; margin: 12px 0 24px 0;">
        <span style="font-family: monospace; font-size: 22px; font-weight: 700; color: #2563eb; letter-spacing: 2px;">PROMO30SPECIAL</span>
      </div>
      <div>
        <a href="https://example.com/checkout" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">Klaim Promo Sekarang &rarr;</a>
      </div>
    </div>
    <div style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
      <p style="margin: 0;"><a href="{{unsubscribe_url}}" style="color: #2563eb; text-decoration: underline;">Berhenti Berlangganan</a></p>
    </div>
  </div>
</div>`,
  },
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [
  {
    id: 'sub-1',
    email: 'rizky.firmansyah@gmail.com',
    name: 'Rizky Firmansyah',
    status: 'subscribed',
    projectId: 'prj-saas',
    projectName: 'SaaS Platform Landing Page',
    joinedAt: '2026-09-18T10:20:00Z',
    tags: ['lead', 'enterprise', 'demo-request'],
    totalEmailsReceived: 5,
    openRate: 80,
  },
  {
    id: 'sub-2',
    email: 'anita.wijayanti@corporate.co.id',
    name: 'Anita Wijayanti',
    status: 'subscribed',
    projectId: 'prj-saas',
    projectName: 'SaaS Platform Landing Page',
    joinedAt: '2026-09-15T14:10:00Z',
    tags: ['vip', 'enterprise'],
    totalEmailsReceived: 8,
    openRate: 100,
  },
  {
    id: 'sub-3',
    email: 'hendra.gunawan@techstart.io',
    name: 'Hendra Gunawan',
    status: 'unsubscribed',
    projectId: 'prj-saas',
    projectName: 'SaaS Platform Landing Page',
    joinedAt: '2026-08-10T09:00:00Z',
    tags: ['trial-user'],
    totalEmailsReceived: 12,
    openRate: 25,
    unsubscribedAt: '2026-09-14T11:00:00Z',
  },
  {
    id: 'sub-4',
    email: 'maya.sari@yahoo.com',
    name: 'Maya Sari',
    status: 'bounced',
    projectId: 'prj-saas',
    projectName: 'SaaS Platform Landing Page',
    joinedAt: '2026-09-02T16:40:00Z',
    tags: ['cold-lead'],
    totalEmailsReceived: 1,
    openRate: 0,
    bounceReason: '550 5.1.1 User unknown / Mailbox unavailable',
  },
  {
    id: 'sub-5',
    email: 'dian.lestari@gmail.com',
    name: 'Dian Lestari',
    status: 'subscribed',
    projectId: 'prj-ecommerce',
    projectName: 'Artisan Store Promo Page',
    joinedAt: '2026-09-19T08:15:00Z',
    tags: ['shopper', 'discount-seeker'],
    totalEmailsReceived: 14,
    openRate: 71,
  },
  {
    id: 'sub-6',
    email: 'fajar.nugroho@outlook.com',
    name: 'Fajar Nugroho',
    status: 'subscribed',
    projectId: 'prj-ecommerce',
    projectName: 'Artisan Store Promo Page',
    joinedAt: '2026-09-17T19:30:00Z',
    tags: ['buyer', 'clothing'],
    totalEmailsReceived: 9,
    openRate: 66,
  },
  {
    id: 'sub-7',
    email: 'siti.rahmawati@gmail.com',
    name: 'Siti Rahmawati',
    status: 'subscribed',
    projectId: 'prj-ecommerce',
    projectName: 'Artisan Store Promo Page',
    joinedAt: '2026-09-12T13:00:00Z',
    tags: ['buyer', 'accessories'],
    totalEmailsReceived: 11,
    openRate: 82,
  },
  {
    id: 'sub-8',
    email: 'tari.anggraini@yahoo.co.id',
    name: 'Tari Anggraini',
    status: 'unsubscribed',
    projectId: 'prj-ecommerce',
    projectName: 'Artisan Store Promo Page',
    joinedAt: '2026-07-20T10:00:00Z',
    tags: ['one-time-buyer'],
    totalEmailsReceived: 16,
    openRate: 18,
    unsubscribedAt: '2026-09-10T15:20:00Z',
  },
  {
    id: 'sub-9',
    email: 'kevin.sanaya@devtech.org',
    name: 'Kevin Sanjaya',
    status: 'subscribed',
    projectId: 'prj-devtech',
    projectName: 'DevTech Engineering Blog',
    joinedAt: '2026-09-16T11:45:00Z',
    tags: ['engineer', 'frontend'],
    totalEmailsReceived: 6,
    openRate: 100,
  },
  {
    id: 'sub-10',
    email: 'ratna.dewi@university.ac.id',
    name: 'Ratna Dewi',
    status: 'subscribed',
    projectId: 'prj-devtech',
    projectName: 'DevTech Engineering Blog',
    joinedAt: '2026-09-14T09:10:00Z',
    tags: ['student', 'academic'],
    totalEmailsReceived: 4,
    openRate: 75,
  },
  {
    id: 'sub-11',
    email: 'agung.prasetyo@finedge.app',
    name: 'Agung Prasetyo',
    status: 'subscribed',
    projectId: 'prj-finedge',
    projectName: 'FinEdge Mobile App Waitlist',
    joinedAt: '2026-09-18T14:00:00Z',
    tags: ['waitlist', 'beta-tester', 'tier-1'],
    totalEmailsReceived: 3,
    openRate: 100,
  },
  {
    id: 'sub-12',
    email: 'citra.kirana@finedge.app',
    name: 'Citra Kirana',
    status: 'subscribed',
    projectId: 'prj-finedge',
    projectName: 'FinEdge Mobile App Waitlist',
    joinedAt: '2026-09-16T08:20:00Z',
    tags: ['waitlist', 'early-adopter'],
    totalEmailsReceived: 3,
    openRate: 67,
  },
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-1',
    name: 'Q3 Enterprise Feature Blast',
    subject: 'Introducing Enterprise Security & SSO on SaaS Platform',
    previewText: 'Empower your marketing team with our new high-speed delivery pipeline.',
    fromName: 'SaaS Platform Team',
    fromEmail: 'updates@saas-platform.com',
    projectId: 'prj-saas',
    projectName: 'SaaS Platform Landing Page',
    status: 'sent',
    templateId: 'tpl-product-launch',
    htmlContent: INITIAL_TEMPLATES[0].htmlContent,
    mjmlContent: INITIAL_TEMPLATES[0].mjmlContent,
    recipientCount: 1250,
    sentCount: 1250,
    openCount: 688,
    clickCount: 245,
    createdAt: '2026-09-15T08:00:00Z',
    sentAt: '2026-09-15T09:30:00Z',
  },
  {
    id: 'cmp-2',
    name: 'Weekend Flash Sale 30% Promo',
    subject: 'Promo Kilat 48 Jam Hanya untuk Subscriber Terpilih',
    previewText: 'Gunakan kupon PROMO30SPECIAL sebelum kehabisan!',
    fromName: 'Artisan Store Special Offers',
    fromEmail: 'promo@artisanstore.id',
    projectId: 'prj-ecommerce',
    projectName: 'Artisan Store Promo Page',
    status: 'sent',
    templateId: 'tpl-flash-promo',
    htmlContent: INITIAL_TEMPLATES[2].htmlContent,
    mjmlContent: INITIAL_TEMPLATES[2].mjmlContent,
    recipientCount: 3400,
    sentCount: 3400,
    openCount: 1870,
    clickCount: 816,
    createdAt: '2026-09-17T12:00:00Z',
    sentAt: '2026-09-18T00:01:00Z',
  },
  {
    id: 'cmp-3',
    name: 'Weekly Dev Digest #42',
    subject: 'Weekly Insight: Top Growth Tactics & Next.js Architecture',
    previewText: 'Best practices for high throughput email queuing and subscriber management.',
    fromName: 'DevTech Editorial',
    fromEmail: 'newsletter@devtech.engineering',
    projectId: 'prj-devtech',
    projectName: 'DevTech Engineering Blog',
    status: 'draft',
    templateId: 'tpl-newsletter-weekly',
    htmlContent: INITIAL_TEMPLATES[1].htmlContent,
    mjmlContent: INITIAL_TEMPLATES[1].mjmlContent,
    recipientCount: 890,
    sentCount: 0,
    openCount: 0,
    clickCount: 0,
    createdAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'cmp-4',
    name: 'FinEdge Beta Wave 2 Invitation',
    subject: 'Tiket Akses Beta FinEdge Anda Telah Aktif!',
    previewText: 'Akses eksklusif aplikasi mobile FinEdge untuk 500 pengguna pertama.',
    fromName: 'FinEdge Beta Team',
    fromEmail: 'hello@finedge.app',
    projectId: 'prj-finedge',
    projectName: 'FinEdge Mobile App Waitlist',
    status: 'scheduled',
    templateId: 'tpl-product-launch',
    htmlContent: INITIAL_TEMPLATES[0].htmlContent,
    mjmlContent: INITIAL_TEMPLATES[0].mjmlContent,
    recipientCount: 500,
    sentCount: 0,
    openCount: 0,
    clickCount: 0,
    createdAt: '2026-09-20T15:00:00Z',
    scheduledFor: '2026-09-22T09:00:00Z',
  },
];

export const INITIAL_ACCESS_POLICIES: AccessPolicy[] = [
  {
    role: 'admin',
    roleLabel: 'Administrator',
    description: 'Akses penuh tanpa batas: Kelola user, permissions, organisasi, SMTP server, dan seluruh alur campaign.',
    permissions: {
      canViewDashboard: true,
      canViewSubscribers: true,
      canExportSubscribers: true,
      canAddSubscriber: true,
      canDeleteSubscriber: true,
      canCreateCampaign: true,
      canEditCampaign: true,
      canSendBulkCampaign: true,
      canManageTemplates: true,
      canViewProjects: true,
      canCreateProject: true,
      canConfigureSmtp: true,
      canManageOrganizations: true,
      canManageUsers: true,
      canEditPolicies: true,
    },
  },
  {
    role: 'marketing',
    roleLabel: 'Marketing Lead',
    description: 'Fokus pada promosi: Membuat campaign, visual email builder, kirim email massal, kelola subscriber, dan analytics.',
    permissions: {
      canViewDashboard: true,
      canViewSubscribers: true,
      canExportSubscribers: true,
      canAddSubscriber: true,
      canDeleteSubscriber: false,
      canCreateCampaign: true,
      canEditCampaign: true,
      canSendBulkCampaign: true,
      canManageTemplates: true,
      canViewProjects: true,
      canCreateProject: false,
      canConfigureSmtp: false,
      canManageOrganizations: false,
      canManageUsers: false,
      canEditPolicies: false,
    },
  },
  {
    role: 'sales',
    roleLabel: 'Sales Representative',
    description: 'Akses monitoring dan prospek: Melihat performa dashboard, data subscriber, dan export daftar prospek.',
    permissions: {
      canViewDashboard: true,
      canViewSubscribers: true,
      canExportSubscribers: true,
      canAddSubscriber: true,
      canDeleteSubscriber: false,
      canCreateCampaign: false,
      canEditCampaign: false,
      canSendBulkCampaign: false,
      canManageTemplates: false,
      canViewProjects: true,
      canCreateProject: false,
      canConfigureSmtp: false,
      canManageOrganizations: false,
      canManageUsers: false,
      canEditPolicies: false,
    },
  },
];
