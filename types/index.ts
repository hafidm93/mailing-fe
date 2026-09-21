export type Role = 'admin' | 'marketing' | 'sales';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive';
  organizationId: string;
  organizationName: string;
  lastLoginAt: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  memberCount: number;
  projectsCount: number;
  createdAt: string;
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

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  websiteUrl: string;
  organizationId: string;
  organizationName: string;
  smtp: SmtpConfig;
  subscriberCount: number;
  activeCampaignsCount: number;
  apiKey: string;
  createdAt: string;
}

export type SubscriberStatus = 'subscribed' | 'unsubscribed' | 'bounced';

export interface Subscriber {
  id: string;
  email: string;
  name: string;
  status: SubscriberStatus;
  projectId: string;
  projectName: string;
  joinedAt: string;
  tags: string[];
  totalEmailsReceived: number;
  openRate: number;
  bounceReason?: string;
  unsubscribedAt?: string;
}

export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent';

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  previewText: string;
  fromName: string;
  fromEmail: string;
  projectId: string;
  projectName: string;
  status: CampaignStatus;
  templateId?: string;
  htmlContent: string;
  mjmlContent?: string;
  recipientCount: number;
  sentCount: number;
  openCount: number;
  clickCount: number;
  createdAt: string;
  sentAt?: string;
  scheduledFor?: string;
  targetSegment?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  subject: string;
  htmlContent: string;
  mjmlContent: string;
  updatedAt: string;
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
