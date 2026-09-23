import {
  User,
  Project,
  Organization,
  Subscriber,
  Campaign,
  EmailTemplate,
  AccessPolicy,
  UserSession,
  RoleEntity,
  Permission,
  RolePermission,
  UserRoleAssignment,
  ProjectKey,
  MailingList,
  Subscription,
  EmailProvider,
  SendingDomain,
  EmailIdentity,
  EmailTemplateVersion,
  CampaignRecipient,
} from '@/types';

// 1. organization
export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-1',
    name: 'Nusantara Tech Group',
    slug: 'nusantara-tech',
    status: 'active',
    created_at: '2025-01-15T08:00:00Z',
    updated_at: '2026-09-20T10:00:00Z',
    domain: 'nusantara-tech.com',
    memberCount: 8,
    projectsCount: 3,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'org-2',
    name: 'Sagara Growth Studio',
    slug: 'sagara-growth',
    status: 'active',
    created_at: '2025-03-20T10:30:00Z',
    updated_at: '2026-09-18T14:30:00Z',
    domain: 'sagaragrowth.io',
    memberCount: 4,
    projectsCount: 2,
    createdAt: '2025-03-20T10:30:00Z',
  },
];

// 2. users
export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    organization_id: 'org-1',
    email: 'admin@nusantara-tech.com',
    email_normalized: 'admin@nusantara-tech.com',
    full_name: 'Ahmad Maulana',
    status: 'active',
    last_login_at: '2026-09-21T01:10:00Z',
    created_by: 'system',
    created_at: '2025-01-15T08:30:00Z',
    username: 'admin',
    name: 'Ahmad Maulana (Super Admin)',
    role: 'admin',
    organizationId: 'org-1',
    organizationName: 'Nusantara Tech Group',
    lastLoginAt: '2026-09-21T01:10:00Z',
    createdAt: '2025-01-15T08:30:00Z',
  },
  {
    id: 'usr-marketing',
    organization_id: 'org-1',
    email: 'sarah.marketing@nusantara-tech.com',
    email_normalized: 'sarah.marketing@nusantara-tech.com',
    full_name: 'Sarah Wijaya',
    status: 'active',
    last_login_at: '2026-09-20T14:45:00Z',
    created_by: 'usr-admin',
    created_at: '2025-02-01T09:15:00Z',
    username: 'marketing',
    name: 'Sarah Wijaya (Marketing Lead)',
    role: 'marketing',
    organizationId: 'org-1',
    organizationName: 'Nusantara Tech Group',
    lastLoginAt: '2026-09-20T14:45:00Z',
    createdAt: '2025-02-01T09:15:00Z',
  },
  {
    id: 'usr-sales',
    organization_id: 'org-1',
    email: 'budi.sales@nusantara-tech.com',
    email_normalized: 'budi.sales@nusantara-tech.com',
    full_name: 'Budi Pratama',
    status: 'active',
    last_login_at: '2026-09-19T11:20:00Z',
    created_by: 'usr-admin',
    created_at: '2025-02-10T14:00:00Z',
    username: 'sales',
    name: 'Budi Pratama (Sales Rep)',
    role: 'sales',
    organizationId: 'org-1',
    organizationName: 'Nusantara Tech Group',
    lastLoginAt: '2026-09-19T11:20:00Z',
    createdAt: '2025-02-10T14:00:00Z',
  },
  {
    id: 'usr-dimas',
    organization_id: 'org-1',
    email: 'dimas.k@nusantara-tech.com',
    email_normalized: 'dimas.k@nusantara-tech.com',
    full_name: 'Dimas Kurniawan',
    status: 'active',
    last_login_at: '2026-09-18T16:00:00Z',
    created_by: 'usr-admin',
    created_at: '2025-04-12T10:00:00Z',
    username: 'dimas',
    name: 'Dimas Kurniawan',
    role: 'marketing',
    organizationId: 'org-1',
    organizationName: 'Nusantara Tech Group',
    lastLoginAt: '2026-09-18T16:00:00Z',
    createdAt: '2025-04-12T10:00:00Z',
  },
];

// 3. user_sessions
export const INITIAL_USER_SESSIONS: UserSession[] = [
  {
    id: 'sess-1',
    user_id: 'usr-admin',
    refresh_token: 'rt_908f1b2c4e5a',
    ip_address: '103.247.12.89',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/128.0.0.0',
    expires_at: '2026-10-21T01:10:00Z',
    revoked_at: null,
    created_at: '2026-09-21T01:10:00Z',
  },
  {
    id: 'sess-2',
    user_id: 'usr-marketing',
    refresh_token: 'rt_3847ac18df2b',
    ip_address: '180.252.164.20',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/130.0',
    expires_at: '2026-10-20T14:45:00Z',
    revoked_at: null,
    created_at: '2026-09-20T14:45:00Z',
  },
  {
    id: 'sess-3',
    user_id: 'usr-sales',
    refresh_token: 'rt_8829ef40ca71',
    ip_address: '36.85.99.14',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X)',
    expires_at: '2026-10-19T11:20:00Z',
    revoked_at: null,
    created_at: '2026-09-19T11:20:00Z',
  },
];

// 4. roles
export const INITIAL_ROLES: RoleEntity[] = [
  {
    id: 'role-admin',
    name: 'admin',
    description: 'Akses penuh tanpa batas: Kelola user, permissions, organisasi, SMTP server, dan seluruh alur campaign.',
    created_at: '2025-01-15T08:00:00Z',
    updated_at: '2025-01-15T08:00:00Z',
  },
  {
    id: 'role-campaign-manager',
    name: 'campaign_manager',
    description: 'Manajemen penuh campaign: Buat campaign, visual template editor, eksekusi pengiriman massal, kelola subscribers.',
    created_at: '2025-01-15T08:00:00Z',
    updated_at: '2025-01-15T08:00:00Z',
  },
  {
    id: 'role-content-creator',
    name: 'content_creator',
    description: 'Desain template email, penulisan copywriting email newsletter, dan preview responsif.',
    created_at: '2025-01-15T08:00:00Z',
    updated_at: '2025-01-15T08:00:00Z',
  },
  {
    id: 'role-viewer',
    name: 'viewer',
    description: 'Akses hanya-lihat (read-only) ke dashboard performa, statistik analitik, dan riwayat pengiriman.',
    created_at: '2025-01-15T08:00:00Z',
    updated_at: '2025-01-15T08:00:00Z',
  },
];

// 5. permissions
export const INITIAL_PERMISSIONS: Permission[] = [
  { id: 'perm-1', name: 'dashboard:view', resource: 'dashboard', action: 'view', description: 'Melihat dashboard metriks dan grafik pertumbuhan' },
  { id: 'perm-2', name: 'contacts:read', resource: 'contacts', action: 'read', description: 'Melihat data contact dan subscription' },
  { id: 'perm-3', name: 'contacts:create', resource: 'contacts', action: 'create', description: 'Menambah contact baru' },
  { id: 'perm-4', name: 'contacts:delete', resource: 'contacts', action: 'delete', description: 'Menghapus contact' },
  { id: 'perm-5', name: 'contacts:export', resource: 'contacts', action: 'export', description: 'Export contact ke format CSV' },
  { id: 'perm-6', name: 'campaigns:create', resource: 'campaigns', action: 'create', description: 'Menyusun campaign baru dengan visual builder' },
  { id: 'perm-7', name: 'campaigns:send', resource: 'campaigns', action: 'send', description: 'Mengeksekusi pengiriman massal campaign' },
  { id: 'perm-8', name: 'templates:manage', resource: 'templates', action: 'manage', description: 'Membuat dan mengedit template email dan versinya' },
  { id: 'perm-9', name: 'projects:manage', resource: 'projects', action: 'manage', description: 'Mengelola konfigurasi proyek dan domain pengirim' },
  { id: 'perm-10', name: 'users:manage', resource: 'users', action: 'manage', description: 'Mengundang dan mengelola akses pengguna' },
];

// 6. roles_permissions
export const INITIAL_ROLES_PERMISSIONS: RolePermission[] = [
  // admin has all
  { id: 'rp-1', role_id: 'role-admin', permission_id: 'perm-1' },
  { id: 'rp-2', role_id: 'role-admin', permission_id: 'perm-2' },
  { id: 'rp-3', role_id: 'role-admin', permission_id: 'perm-3' },
  { id: 'rp-4', role_id: 'role-admin', permission_id: 'perm-4' },
  { id: 'rp-5', role_id: 'role-admin', permission_id: 'perm-5' },
  { id: 'rp-6', role_id: 'role-admin', permission_id: 'perm-6' },
  { id: 'rp-7', role_id: 'role-admin', permission_id: 'perm-7' },
  { id: 'rp-8', role_id: 'role-admin', permission_id: 'perm-8' },
  { id: 'rp-9', role_id: 'role-admin', permission_id: 'perm-9' },
  { id: 'rp-10', role_id: 'role-admin', permission_id: 'perm-10' },
  // campaign manager
  { id: 'rp-11', role_id: 'role-campaign-manager', permission_id: 'perm-1' },
  { id: 'rp-12', role_id: 'role-campaign-manager', permission_id: 'perm-2' },
  { id: 'rp-13', role_id: 'role-campaign-manager', permission_id: 'perm-3' },
  { id: 'rp-14', role_id: 'role-campaign-manager', permission_id: 'perm-5' },
  { id: 'rp-15', role_id: 'role-campaign-manager', permission_id: 'perm-6' },
  { id: 'rp-16', role_id: 'role-campaign-manager', permission_id: 'perm-7' },
  { id: 'rp-17', role_id: 'role-campaign-manager', permission_id: 'perm-8' },
  // viewer
  { id: 'rp-18', role_id: 'role-viewer', permission_id: 'perm-1' },
  { id: 'rp-19', role_id: 'role-viewer', permission_id: 'perm-2' },
];

// 7. user_role_assignments
export const INITIAL_USER_ROLE_ASSIGNMENTS: UserRoleAssignment[] = [
  { id: 'ura-1', user_id: 'usr-admin', role_id: 'role-admin', project_id: null }, // global
  { id: 'ura-2', user_id: 'usr-marketing', role_id: 'role-campaign-manager', project_id: 'prj-saas' },
  { id: 'ura-3', user_id: 'usr-marketing', role_id: 'role-campaign-manager', project_id: 'prj-ecommerce' },
  { id: 'ura-4', user_id: 'usr-sales', role_id: 'role-viewer', project_id: null },
  { id: 'ura-5', user_id: 'usr-dimas', role_id: 'role-content-creator', project_id: 'prj-saas' },
];

// 8. projects
export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj-saas',
    organization_id: 'org-1',
    name: 'SaaS Platform Landing Page',
    slug: 'saas-platform',
    domain: 'saas-platform.com',
    status: 'active',
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
    organization_id: 'org-1',
    name: 'Artisan Store Promo Page',
    slug: 'artisan-store',
    domain: 'artisanstore.id',
    status: 'active',
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
    organization_id: 'org-1',
    name: 'DevTech Engineering Blog',
    slug: 'devtech-blog',
    domain: 'devtech.engineering',
    status: 'active',
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
    organization_id: 'org-2',
    name: 'FinEdge Mobile App Waitlist',
    slug: 'finedge-waitlist',
    domain: 'finedge.app',
    status: 'active',
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

// 9. project_keys
export const INITIAL_PROJECT_KEYS: ProjectKey[] = [
  {
    id: 'pk-1',
    project_id: 'prj-saas',
    name: 'Primary Next.js Webhook Key',
    key_hash: 'ml_live_9f82d1c9a87341e0b',
    last_used_at: '2026-09-21T02:14:00Z',
    expires_at: '2027-01-20T10:00:00Z',
    status: 'active',
  },
  {
    id: 'pk-2',
    project_id: 'prj-ecommerce',
    name: 'Shopify Storefront Checkout Key',
    key_hash: 'ml_live_b4382c7f12e9401a8',
    last_used_at: '2026-09-20T23:50:00Z',
    expires_at: '2027-02-14T11:30:00Z',
    status: 'active',
  },
  {
    id: 'pk-3',
    project_id: 'prj-finedge',
    name: 'Mobile App Lead Waitlist Key',
    key_hash: 'ml_live_7a02c9d81e3f4210b',
    last_used_at: '2026-09-18T18:30:00Z',
    expires_at: '2027-04-01T15:00:00Z',
    status: 'active',
  },
];

// 10. mailing_lists
export const INITIAL_MAILING_LISTS: MailingList[] = [
  {
    id: 'list-saas-core',
    project_id: 'prj-saas',
    name: 'Enterprise Core Subscribers',
    slug: 'enterprise-core',
    status: 'active',
    description: 'B2B Decision makers and engineering leads subscribed to core platform updates.',
    subscriberCount: 890,
  },
  {
    id: 'list-saas-trial',
    project_id: 'prj-saas',
    name: 'Free Trial Users (Onboarding)',
    slug: 'free-trial-users',
    status: 'active',
    description: 'Active free-trial evaluators going through the 14-day product onboarding drip.',
    subscriberCount: 530,
  },
  {
    id: 'list-ecom-vip',
    project_id: 'prj-ecommerce',
    name: 'VIP Member Club',
    slug: 'vip-member-club',
    status: 'active',
    description: 'High LTV customers eligible for 48-hour early flash sale access and vouchers.',
    subscriberCount: 1650,
  },
  {
    id: 'list-ecom-promo',
    project_id: 'prj-ecommerce',
    name: 'Weekly Promo Deals',
    slug: 'weekly-promo-deals',
    status: 'active',
    description: 'General shoppers opted in to seasonal catalogs, discounts, and flash sales.',
    subscriberCount: 2190,
  },
  {
    id: 'list-devtech-weekly',
    project_id: 'prj-devtech',
    name: 'DevTech Weekly Digest',
    slug: 'devtech-weekly',
    status: 'active',
    description: 'Software engineers and system architects receiving technical tutorials.',
    subscriberCount: 890,
  },
  {
    id: 'list-finedge-waitlist',
    project_id: 'prj-finedge',
    name: 'FinEdge Beta Waitlist',
    slug: 'finedge-beta-waitlist',
    status: 'active',
    description: 'Fintech early adopters awaiting Android & iOS private beta testing rollout.',
    subscriberCount: 2150,
  },
];

// 13. email_providers
export const INITIAL_EMAIL_PROVIDERS: EmailProvider[] = [
  {
    id: 'prov-mailgun-1',
    name: 'Mailgun Production Gateway',
    type: 'mailgun',
    config: { host: 'smtp.mailgun.org', port: 587, region: 'us-east' },
    status: 'active',
  },
  {
    id: 'prov-sendgrid-1',
    name: 'SendGrid High-Volume Relay',
    type: 'sendgrid',
    config: { host: 'smtp.sendgrid.net', port: 587, tls: true },
    status: 'active',
  },
  {
    id: 'prov-postmark-1',
    name: 'Postmark Transactional Engine',
    type: 'postmark',
    config: { host: 'smtp.postmarkapp.com', port: 587, broadcast: true },
    status: 'active',
  },
  {
    id: 'prov-ses-1',
    name: 'Amazon Simple Email Service (SES)',
    type: 'amazon_ses',
    config: { region: 'ap-southeast-1', dedicatedIp: true },
    status: 'active',
  },
];

// 14. sending_domains
export const INITIAL_SENDING_DOMAINS: SendingDomain[] = [
  {
    id: 'dom-1',
    project_id: 'prj-saas',
    provider_id: 'prov-mailgun-1',
    domain: 'saas-platform.com',
    verification: {
      dkim: { status: 'verified', record: 'k1._domainkey.saas-platform.com' },
      spf: { status: 'verified', record: 'v=spf1 include:mailgun.org ~all' },
      dmarc: { status: 'verified', record: 'v=DMARC1; p=reject; rua=mailto:dmarc@saas-platform.com' },
    },
    status: 'verified',
  },
  {
    id: 'dom-2',
    project_id: 'prj-ecommerce',
    provider_id: 'prov-sendgrid-1',
    domain: 'artisanstore.id',
    verification: {
      dkim: { status: 'verified', record: 's1._domainkey.artisanstore.id' },
      spf: { status: 'verified', record: 'v=spf1 include:sendgrid.net ~all' },
      dmarc: { status: 'verified', record: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@artisanstore.id' },
    },
    status: 'verified',
  },
  {
    id: 'dom-3',
    project_id: 'prj-devtech',
    provider_id: 'prov-ses-1',
    domain: 'devtech.engineering',
    verification: {
      dkim: { status: 'pending', record: 'dkim._domainkey.devtech.engineering' },
      spf: { status: 'verified', record: 'v=spf1 include:amazonses.com ~all' },
      dmarc: { status: 'pending', record: 'v=DMARC1; p=none' },
    },
    status: 'pending',
  },
  {
    id: 'dom-4',
    project_id: 'prj-finedge',
    provider_id: 'prov-postmark-1',
    domain: 'finedge.app',
    verification: {
      dkim: { status: 'verified', record: 'pm._domainkey.finedge.app' },
      spf: { status: 'verified', record: 'v=spf1 include:postmarkapp.com ~all' },
      dmarc: { status: 'verified', record: 'v=DMARC1; p=reject' },
    },
    status: 'verified',
  },
];

// 15. email_identities
export const INITIAL_EMAIL_IDENTITIES: EmailIdentity[] = [
  {
    id: 'ident-saas-updates',
    project_id: 'prj-saas',
    domain_id: 'dom-1',
    from_email: 'updates@saas-platform.com',
    from_name: 'SaaS Platform Team',
    reply_to: 'support@saas-platform.com',
    status: 'verified',
  },
  {
    id: 'ident-ecom-promo',
    project_id: 'prj-ecommerce',
    domain_id: 'dom-2',
    from_email: 'promo@artisanstore.id',
    from_name: 'Artisan Store Special Offers',
    reply_to: 'care@artisanstore.id',
    status: 'verified',
  },
  {
    id: 'ident-devtech-ed',
    project_id: 'prj-devtech',
    domain_id: 'dom-3',
    from_email: 'newsletter@devtech.engineering',
    from_name: 'DevTech Editorial',
    reply_to: 'editorial@devtech.engineering',
    status: 'pending',
  },
  {
    id: 'ident-finedge-team',
    project_id: 'prj-finedge',
    domain_id: 'dom-4',
    from_email: 'hello@finedge.app',
    from_name: 'FinEdge Beta Team',
    reply_to: 'feedback@finedge.app',
    status: 'verified',
  },
];

// 12. subscriptions
export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  { id: 'subsc-1', contact_id: 'sub-1', mailing_list_id: 'list-saas-core', status: 'active', subscribed_at: '2026-09-01T08:00:00Z' },
  { id: 'subsc-2', contact_id: 'sub-2', mailing_list_id: 'list-saas-core', status: 'active', subscribed_at: '2026-09-02T09:15:00Z' },
  { id: 'subsc-3', contact_id: 'sub-3', mailing_list_id: 'list-saas-trial', status: 'active', subscribed_at: '2026-09-03T11:20:00Z' },
  { id: 'subsc-4', contact_id: 'sub-4', mailing_list_id: 'list-saas-core', status: 'unsubscribed', subscribed_at: '2026-08-15T10:00:00Z', unsubscribed_at: '2026-09-10T14:30:00Z', unsubscribe_reason: 'Too frequent' },
  { id: 'subsc-5', contact_id: 'sub-5', mailing_list_id: 'list-saas-core', status: 'bounced', subscribed_at: '2026-09-05T12:00:00Z', unsubscribe_reason: 'Mailbox full 550 5.1.1' },
  { id: 'subsc-6', contact_id: 'sub-6', mailing_list_id: 'list-ecom-vip', status: 'active', subscribed_at: '2026-09-10T08:30:00Z' },
  { id: 'subsc-7', contact_id: 'sub-7', mailing_list_id: 'list-ecom-promo', status: 'active', subscribed_at: '2026-09-11T09:45:00Z' },
  { id: 'subsc-8', contact_id: 'sub-8', mailing_list_id: 'list-ecom-vip', status: 'active', subscribed_at: '2026-09-12T10:10:00Z' },
  { id: 'subsc-9', contact_id: 'sub-9', mailing_list_id: 'list-devtech-weekly', status: 'active', subscribed_at: '2026-09-14T07:20:00Z' },
  { id: 'subsc-10', contact_id: 'sub-10', mailing_list_id: 'list-devtech-weekly', status: 'active', subscribed_at: '2026-09-15T09:00:00Z' },
  { id: 'subsc-11', contact_id: 'sub-11', mailing_list_id: 'list-finedge-waitlist', status: 'active', subscribed_at: '2026-09-18T14:00:00Z' },
  { id: 'subsc-12', contact_id: 'sub-12', mailing_list_id: 'list-finedge-waitlist', status: 'active', subscribed_at: '2026-09-16T08:20:00Z' },
];

// 17. email_template_versions
export const INITIAL_EMAIL_TEMPLATE_VERSIONS: EmailTemplateVersion[] = [
  {
    id: 'tv-1',
    template_id: 'tpl-product-launch',
    version: 1,
    subject: 'Introducing {{project.name}} 2026: Fast, Seamless, Integrated',
    preview_text: 'Discover the next evolution of our automation tools.',
    editor_data: { type: 'grapesjs_or_blocks', blocksCount: 6 },
    html_content: '<div style="font-family:Inter,sans-serif;padding:30px;"><h1>Product Release v2</h1><p>Check out our brand new capabilities.</p></div>',
    css_content: 'h1 { color: #1e293b; } p { color: #475569; }',
  },
  {
    id: 'tv-2',
    template_id: 'tpl-flash-promo',
    version: 1,
    subject: 'Promo Kilat 48 Jam Hanya untuk Subscriber Terpilih',
    preview_text: 'Dapatkan diskon hingga 50% untuk pesanan berikutnya.',
    editor_data: { type: 'grapesjs_or_blocks', blocksCount: 5 },
    html_content: '<div style="font-family:Inter,sans-serif;padding:30px;"><h1>Flash Sale Weekend</h1><p>Gunakan voucher FLASH2026.</p></div>',
    css_content: 'h1 { color: #dc2626; }',
  },
];

// 19. campaign_recipients
export const INITIAL_CAMPAIGN_RECIPIENTS: CampaignRecipient[] = [
  {
    id: 'rec-1',
    campaign_id: 'cmp-1',
    contact_id: 'sub-1',
    email: 'raditya.pratama@techcorp.co.id',
    status: 'opened',
    provider_msg_id: 'mg_msg_99812401',
    sent_at: '2026-09-15T09:30:10Z',
    delivered_at: '2026-09-15T09:30:15Z',
    clicked_at: '2026-09-15T10:02:40Z',
    failed_at: null,
    error: null,
  },
  {
    id: 'rec-2',
    campaign_id: 'cmp-1',
    contact_id: 'sub-2',
    email: 'anita.wijaya@innovatech.com',
    status: 'delivered',
    provider_msg_id: 'mg_msg_99812402',
    sent_at: '2026-09-15T09:30:11Z',
    delivered_at: '2026-09-15T09:30:17Z',
    clicked_at: null,
    failed_at: null,
    error: null,
  },
  {
    id: 'rec-3',
    campaign_id: 'cmp-1',
    contact_id: 'sub-5',
    email: 'hendra.gunawan@megacorp.id',
    status: 'bounced',
    provider_msg_id: 'mg_msg_99812405',
    sent_at: '2026-09-15T09:30:12Z',
    delivered_at: null,
    clicked_at: null,
    failed_at: '2026-09-15T09:30:20Z',
    error: '550 5.1.1 User unknown / mailbox not found',
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
    project_id: 'prj-saas',
    identity_id: 'ident-saas-updates',
    template_id: 'tpl-product-launch',
    name: 'Q3 Enterprise Feature Blast',
    subject: 'Introducing Enterprise Security & SSO on SaaS Platform',
    content_html: INITIAL_TEMPLATES[0].htmlContent,
    content_text: 'Introducing Enterprise Security & SSO on SaaS Platform. Empower your marketing team with our new high-speed delivery pipeline.',
    status: 'completed',
    scheduled_at: null,
    sent_at: '2026-09-15T09:30:00Z',
    completed_at: '2026-09-15T09:35:00Z',
    editor_data: { type: 'grapesjs_blocks', blocksCount: 6 },
    css_content: 'body { font-family: Inter, sans-serif; }',
    previewText: 'Empower your marketing team with our new high-speed delivery pipeline.',
    fromName: 'SaaS Platform Team',
    fromEmail: 'updates@saas-platform.com',
    projectId: 'prj-saas',
    projectName: 'SaaS Platform Landing Page',
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
    project_id: 'prj-ecommerce',
    identity_id: 'ident-ecom-promo',
    template_id: 'tpl-flash-promo',
    name: 'Weekend Flash Sale 30% Promo',
    subject: 'Promo Kilat 48 Jam Hanya untuk Subscriber Terpilih',
    content_html: INITIAL_TEMPLATES[2].htmlContent,
    content_text: 'Promo Kilat 48 Jam Hanya untuk Subscriber Terpilih. Gunakan kupon PROMO30SPECIAL sebelum kehabisan!',
    status: 'completed',
    scheduled_at: null,
    sent_at: '2026-09-18T00:01:00Z',
    completed_at: '2026-09-18T00:10:00Z',
    editor_data: { type: 'grapesjs_blocks', blocksCount: 5 },
    css_content: 'body { font-family: Inter, sans-serif; }',
    previewText: 'Gunakan kupon PROMO30SPECIAL sebelum kehabisan!',
    fromName: 'Artisan Store Special Offers',
    fromEmail: 'promo@artisanstore.id',
    projectId: 'prj-ecommerce',
    projectName: 'Artisan Store Promo Page',
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
    project_id: 'prj-devtech',
    identity_id: 'ident-devtech-ed',
    template_id: 'tpl-newsletter-weekly',
    name: 'Weekly Dev Digest #42',
    subject: 'Weekly Insight: Top Growth Tactics & Next.js Architecture',
    content_html: INITIAL_TEMPLATES[1].htmlContent,
    content_text: 'Weekly Insight: Top Growth Tactics & Next.js Architecture. Best practices for high throughput email queuing and subscriber management.',
    status: 'draft',
    scheduled_at: null,
    sent_at: null,
    completed_at: null,
    editor_data: { type: 'grapesjs_blocks', blocksCount: 4 },
    css_content: 'body { font-family: Inter, sans-serif; }',
    previewText: 'Best practices for high throughput email queuing and subscriber management.',
    fromName: 'DevTech Editorial',
    fromEmail: 'newsletter@devtech.engineering',
    projectId: 'prj-devtech',
    projectName: 'DevTech Engineering Blog',
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
    project_id: 'prj-finedge',
    identity_id: 'ident-finedge-team',
    template_id: 'tpl-product-launch',
    name: 'FinEdge Beta Wave 2 Invitation',
    subject: 'Tiket Akses Beta FinEdge Anda Telah Aktif!',
    content_html: INITIAL_TEMPLATES[0].htmlContent,
    content_text: 'Tiket Akses Beta FinEdge Anda Telah Aktif! Akses eksklusif aplikasi mobile FinEdge untuk 500 pengguna pertama.',
    status: 'scheduled',
    scheduled_at: '2026-09-22T09:00:00Z',
    sent_at: null,
    completed_at: null,
    editor_data: { type: 'grapesjs_blocks', blocksCount: 6 },
    css_content: 'body { font-family: Inter, sans-serif; }',
    previewText: 'Akses eksklusif aplikasi mobile FinEdge untuk 500 pengguna pertama.',
    fromName: 'FinEdge Beta Team',
    fromEmail: 'hello@finedge.app',
    projectId: 'prj-finedge',
    projectName: 'FinEdge Mobile App Waitlist',
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
