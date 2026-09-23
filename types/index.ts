export type Role = 'admin' | 'marketing' | 'sales' | 'campaign_manager' | 'content_creator' | 'viewer';

// 1. organization
export interface Organization {
  id: string;
  name: string;
  slug?: string;
  status?: 'active' | 'suspended' | 'archived';
  created_at?: string;
  updated_at?: string;
  // UI helpers
  domain?: string;
  memberCount?: number;
  projectsCount?: number;
  createdAt?: string;
}

// 2. users
export interface User {
  id: string;
  organization_id?: string;
  email: string;
  email_normalized?: string;
  password?: string;
  full_name?: string;
  status?: 'active' | 'inactive' | 'invited' | 'disabled';
  last_login_at?: string;
  created_by?: string;
  created_at?: string;
  // UI helpers
  username?: string;
  name?: string;
  role?: Role;
  organizationId?: string;
  organizationName?: string;
  lastLoginAt?: string;
  createdAt?: string;
}

// 3. user_sessions
export interface UserSession {
  id: string;
  user_id: string;
  refresh_token: string;
  ip_address: string;
  user_agent: string;
  expires_at: string;
  revoked_at?: string | null;
  created_at: string;
}

// 4. roles
export interface RoleEntity {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// 5. permissions
export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}

// 6. roles_permissions
export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
}

// 7. user_role_assignments
export interface UserRoleAssignment {
  id: string;
  user_id: string;
  role_id: string;
  project_id: string | null; // NULL if organization-wide
}

// 8. projects
export interface Project {
  id: string;
  organization_id?: string;
  name: string;
  slug: string;
  domain?: string;
  status?: 'active' | 'paused' | 'archived' | 'inactive';
  description?: string;
  websiteUrl?: string;
  organizationId?: string;
  organizationName?: string;
  smtp?: SmtpConfig;
  subscriberCount?: number;
  activeCampaignsCount?: number;
  apiKey?: string;
  createdAt?: string;
}

// 9. project_keys
export interface ProjectKey {
  id: string;
  project_id: string;
  name: string;
  key_hash: string;
  last_used_at?: string;
  expires_at?: string;
  status: 'active' | 'revoked' | 'expired';
  // UI helper
  projectId?: string;
  keyHash?: string;
  lastUsedAt?: string;
}

// 10. mailing_lists
export interface MailingList {
  id: string;
  project_id: string;
  name: string;
  slug: string;
  status: 'active' | 'archived';
  description: string;
  subscriberCount?: number;
  created_at?: string;
  createdAt?: string;
  // UI helper
  projectId?: string;
}

// 11. contacts
export type ContactStatus = 'subscribed' | 'unsubscribed' | 'bounced' | 'cleaned' | 'complaint';

export type ContactSource = 'website_form' | 'web_form' | 'api' | 'csv_import' | 'import' | 'manual';

export interface Contact {
  id: string;
  email: string;
  email_normalized?: string;
  name: string;
  status: ContactStatus;
  source?: ContactSource;
  metadata?: Record<string, any>; // JSONDB
  created_at?: string;
  updated_at?: string;
  // UI helpers & backward compat
  project_id?: string;
  projectId?: string;
  projectName?: string;
  joinedAt?: string;
  tags?: string[];
  totalEmailsReceived?: number;
  openRate?: number;
  bounceReason?: string;
  unsubscribedAt?: string;
  mailingListIds?: string[];
}

// Backward compatibility alias for Contact
export type Subscriber = Contact;
export type SubscriberStatus = 'subscribed' | 'unsubscribed' | 'bounced';

// 12. subscriptions
export interface Subscription {
  id: string;
  contact_id: string;
  mailing_list_id: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribed_at: string;
  unsubscribed_at?: string | null;
  unsubscribe_reason?: string | null;
}

// 13. email_providers
export interface EmailProvider {
  id: string;
  name: string;
  type: 'smtp' | 'amazon_ses' | 'sendgrid' | 'mailgun' | 'postmark' | 'resend' | 'ses';
  config: Record<string, any>; // JSONDB
  status: 'active' | 'inactive';
}

// 14. sending_domains
export interface SendingDomain {
  id: string;
  project_id: string;
  provider_id: string;
  domain: string;
  verification?: {
    dkim: { status: 'verified' | 'pending' | 'failed'; record: string };
    spf: { status: 'verified' | 'pending' | 'failed'; record: string };
    dmarc: { status: 'verified' | 'pending' | 'failed'; record: string };
  }; // JSONDB
  status: 'verified' | 'pending' | 'failed';
  // UI helpers & backward compat
  projectId?: string;
  providerId?: string;
  dkimVerified?: boolean;
  spfVerified?: boolean;
  dmarcVerified?: boolean;
  createdAt?: string;
}

// 15. email_identities
export interface EmailIdentity {
  id: string;
  project_id: string;
  domain_id?: string;
  from_email: string;
  from_name: string;
  reply_to: string;
  status: 'verified' | 'pending' | 'rejected';
  // UI helpers & backward compat
  projectId?: string;
  domainId?: string;
  fromEmail?: string;
  fromName?: string;
  replyTo?: string;
  createdAt?: string;
}

// 16. email_templates
export interface EmailTemplate {
  id: string;
  project_id?: string;
  name: string;
  description: string;
  status?: 'published' | 'draft' | 'archived';
  current_version?: number;
  // UI helpers
  projectId?: string;
  type?: string;
  category?: string;
  subject?: string;
  htmlContent?: string;
  mjmlContent?: string;
  updatedAt?: string;
}

// 17. email_template_versions
export interface EmailTemplateVersion {
  id: string;
  template_id: string;
  version: number;
  subject: string;
  preview_text: string;
  editor_data: any; // JSONDB
  html_content: string;
  css_content: string;
}

// 18. campaigns
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'completed' | 'cancelled';

export interface Campaign {
  id: string;
  project_id: string;
  identity_id: string;
  template_id?: string;
  name: string;
  subject: string;
  content_html?: string;
  content_text?: string;
  status: CampaignStatus;
  scheduled_at?: string | null;
  sent_at?: string | null;
  editor_data?: any; // JSONDB
  css_content?: string;
  completed_at?: string | null;
  // UI helpers
  sentAt?: string | null;
  projectId?: string;
  projectName?: string;
  templateId?: string;
  previewText?: string;
  fromName?: string;
  fromEmail?: string;
  recipientCount?: number;
  sentCount?: number;
  openCount?: number;
  clickCount?: number;
  createdAt?: string;
  htmlContent?: string;
  mjmlContent?: string;
  targetSegment?: string;
  scheduledFor?: string;
}

// 19. campaign_recipients
export type CampaignRecipientStatus = 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed' | 'bounced';

export interface CampaignRecipient {
  id: string;
  campaign_id: string;
  contact_id: string;
  email: string;
  status: CampaignRecipientStatus;
  provider_msg_id?: string | null;
  sent_at?: string | null;
  delivered_at?: string | null;
  clicked_at?: string | null;
  failed_at?: string | null;
  error?: string | null;
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
  isVerified: boolean;
  lastTestedAt?: string;
}

export interface AccessPolicy {
  role: Role;
  roleLabel: string;
  description: string;
  permissions: {
    canViewDashboard: boolean;
    canViewSubscribers: boolean;
    canExportSubscribers: boolean;
    canAddSubscriber: boolean;
    canDeleteSubscriber: boolean;
    canCreateCampaign: boolean;
    canEditCampaign: boolean;
    canSendBulkCampaign: boolean;
    canManageTemplates: boolean;
    canViewProjects: boolean;
    canCreateProject: boolean;
    canConfigureSmtp: boolean;
    canManageOrganizations: boolean;
    canManageUsers: boolean;
    canEditPolicies: boolean;
  };
}

export interface DashboardAnalytics {
  totalProjects: number;
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribedCount: number;
  bouncedCount: number;
  totalCampaignsSent: number;
  averageOpenRate: number;
  averageClickRate: number;
  monthlyGrowth: { month: string; subscribers: number; unsubscribes: number }[];
  projectBreakdown: { projectName: string; subscriberCount: number; openRate: number }[];
}
