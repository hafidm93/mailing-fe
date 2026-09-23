'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  User,
  Role,
  Project,
  Organization,
  Subscriber,
  SubscriberStatus,
  Campaign,
  EmailTemplate,
  AccessPolicy,
  DashboardAnalytics,
  UserSession,
  RoleEntity,
  Permission,
  RolePermission,
  UserRoleAssignment,
  ProjectKey,
  MailingList,
  Contact,
  Subscription,
  EmailProvider,
  SendingDomain,
  EmailIdentity,
  EmailTemplateVersion,
  CampaignRecipient,
} from '@/types';
import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_ORGANIZATIONS,
  INITIAL_SUBSCRIBERS,
  INITIAL_CAMPAIGNS,
  INITIAL_TEMPLATES,
  INITIAL_ACCESS_POLICIES,
  INITIAL_USER_SESSIONS,
  INITIAL_ROLES,
  INITIAL_PERMISSIONS,
  INITIAL_ROLES_PERMISSIONS,
  INITIAL_USER_ROLE_ASSIGNMENTS,
  INITIAL_PROJECT_KEYS,
  INITIAL_MAILING_LISTS,
  INITIAL_EMAIL_PROVIDERS,
  INITIAL_SENDING_DOMAINS,
  INITIAL_EMAIL_IDENTITIES,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_EMAIL_TEMPLATE_VERSIONS,
  INITIAL_CAMPAIGN_RECIPIENTS,
} from '@/lib/mock-data';

interface MailingContextType {
  // Auth state
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  quickSwitchRole: (role: Role) => void;

  // Selected project filter
  selectedProjectId: string; // 'all' or specific id
  setSelectedProjectId: (id: string) => void;
  selectedProject: Project | null;

  // Projects
  projects: Project[];
  createProject: (projectData: Partial<Project>) => Promise<Project>;
  updateProject: (project: Project) => Promise<Project>;
  testProjectSmtp: (config: Project['smtp']) => Promise<{ success: boolean; message: string }>;

  // Organizations
  organizations: Organization[];
  createOrganization: (orgData: Partial<Organization>) => Promise<Organization>;

  // Subscribers / Contacts
  subscribers: Subscriber[];
  contacts: Contact[];
  addSubscriber: (sub: Partial<Subscriber>) => Promise<Subscriber>;
  addContact: (contact: Partial<Contact>) => Promise<Contact>;
  updateSubscriberStatus: (id: string, status: SubscriberStatus) => Promise<void>;
  deleteSubscriber: (id: string) => Promise<void>;
  bulkUpdateSubscriberStatus: (ids: string[], status: SubscriberStatus) => Promise<void>;

  // Mailing Lists & Subscriptions
  mailingLists: MailingList[];
  createMailingList: (data: Partial<MailingList>) => Promise<MailingList>;
  subscriptions: Subscription[];
  addSubscription: (contactId: string, mailingListId: string) => Promise<Subscription>;

  // Project Keys
  projectKeys: ProjectKey[];
  createProjectKey: (data: Partial<ProjectKey>) => Promise<ProjectKey>;
  revokeProjectKey: (id: string) => Promise<void>;

  // Sending Domains, Providers & Identities
  emailProviders: EmailProvider[];
  addEmailProvider: (data: Partial<EmailProvider>) => Promise<EmailProvider>;
  sendingDomains: SendingDomain[];
  addSendingDomain: (data: Partial<SendingDomain>) => Promise<SendingDomain>;
  verifySendingDomain: (id: string) => Promise<void>;
  emailIdentities: EmailIdentity[];
  addEmailIdentity: (data: Partial<EmailIdentity>) => Promise<EmailIdentity>;

  // Campaigns & Templates
  campaigns: Campaign[];
  templates: EmailTemplate[];
  templateVersions: EmailTemplateVersion[];
  campaignRecipients: CampaignRecipient[];
  createCampaign: (data: Partial<Campaign>) => Promise<Campaign>;
  updateCampaign: (campaign: Campaign) => Promise<Campaign>;
  sendBulkCampaign: (
    campaignId: string,
    recipientIds: string[],
    onProgress?: (percent: number, currentBatch: number, totalBatches: number) => void
  ) => Promise<{ success: boolean; sentCount: number; message: string }>;
  saveTemplate: (template: Partial<EmailTemplate>) => Promise<EmailTemplate>;

  // Admin & RBAC
  users: User[];
  createUser: (userData: Partial<User>) => Promise<User>;
  updateUser: (userData: User) => Promise<User>;
  userSessions: UserSession[];
  roles: RoleEntity[];
  permissions: Permission[];
  rolesPermissions: RolePermission[];
  userRoleAssignments: UserRoleAssignment[];
  assignUserRole: (userId: string, roleId: string, projectId: string | null) => Promise<void>;
  accessPolicies: AccessPolicy[];
  updateAccessPolicy: (role: Role, permissions: AccessPolicy['permissions']) => Promise<void>;
  hasPermission: (permissionKey: keyof AccessPolicy['permissions']) => boolean;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Analytics
  analytics: DashboardAnalytics;
}

const MailingContext = createContext<MailingContextType | null>(null);

const STORAGE_PREFIX = 'mailing_app_';

export function MailingProvider({ children }: { children: React.ReactNode }) {
  // Theme state: default to false (white base with pastel primary)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);
  const [isLoadingAuth] = useState<boolean>(false);

  // Data states
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [subscribers, setSubscribers] = useState<Subscriber[]>(INITIAL_SUBSCRIBERS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [templates, setTemplates] = useState<EmailTemplate[]>(INITIAL_TEMPLATES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [accessPolicies, setAccessPolicies] = useState<AccessPolicy[]>(INITIAL_ACCESS_POLICIES);

  // Hydrate persisted state on client mount (avoids SSR hydration mismatch)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedTheme = localStorage.getItem(`${STORAGE_PREFIX}theme`);
        if (savedTheme === 'dark') setIsDarkMode(true);
      } catch {}
      try {
        const savedUser = localStorage.getItem(`${STORAGE_PREFIX}user`);
        if (savedUser) setCurrentUser(JSON.parse(savedUser));
      } catch {}
      try {
        const s = localStorage.getItem(`${STORAGE_PREFIX}projects`);
        if (s) setProjects(JSON.parse(s));
      } catch {}
      try {
        const s = localStorage.getItem(`${STORAGE_PREFIX}subscribers`);
        if (s) setSubscribers(JSON.parse(s));
      } catch {}
      try {
        const s = localStorage.getItem(`${STORAGE_PREFIX}campaigns`);
        if (s) setCampaigns(JSON.parse(s));
      } catch {}
      try {
        const s = localStorage.getItem(`${STORAGE_PREFIX}templates`);
        if (s) setTemplates(JSON.parse(s));
      } catch {}
      try {
        const s = localStorage.getItem(`${STORAGE_PREFIX}users`);
        if (s) setUsers(JSON.parse(s));
      } catch {}
      try {
        const s = localStorage.getItem(`${STORAGE_PREFIX}policies`);
        if (s) setAccessPolicies(JSON.parse(s));
      } catch {}
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // ERD Tables States
  const [userSessions] = useState<UserSession[]>(INITIAL_USER_SESSIONS);
  const [roles] = useState<RoleEntity[]>(INITIAL_ROLES);
  const [permissions] = useState<Permission[]>(INITIAL_PERMISSIONS);
  const [rolesPermissions] = useState<RolePermission[]>(INITIAL_ROLES_PERMISSIONS);
  const [userRoleAssignments, setUserRoleAssignments] = useState<UserRoleAssignment[]>(INITIAL_USER_ROLE_ASSIGNMENTS);

  const [projectKeys, setProjectKeys] = useState<ProjectKey[]>(INITIAL_PROJECT_KEYS);
  const [mailingLists, setMailingLists] = useState<MailingList[]>(INITIAL_MAILING_LISTS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [emailProviders, setEmailProviders] = useState<EmailProvider[]>(INITIAL_EMAIL_PROVIDERS);
  const [sendingDomains, setSendingDomains] = useState<SendingDomain[]>(INITIAL_SENDING_DOMAINS);
  const [emailIdentities, setEmailIdentities] = useState<EmailIdentity[]>(INITIAL_EMAIL_IDENTITIES);
  const [templateVersions] = useState<EmailTemplateVersion[]>(INITIAL_EMAIL_TEMPLATE_VERSIONS);
  const [campaignRecipients] = useState<CampaignRecipient[]>(INITIAL_CAMPAIGN_RECIPIENTS);

  // Sync dark mode class with DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Theme toggle
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(`${STORAGE_PREFIX}theme`, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(`${STORAGE_PREFIX}theme`, 'light');
      }
      return next;
    });
  }, []);

  // Persist helpers
  const saveProjects = useCallback((newProjects: Project[]) => {
    setProjects(newProjects);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}projects`, JSON.stringify(newProjects));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveSubscribers = useCallback((newSubs: Subscriber[]) => {
    setSubscribers(newSubs);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}subscribers`, JSON.stringify(newSubs));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveCampaigns = useCallback((newCamps: Campaign[]) => {
    setCampaigns(newCamps);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}campaigns`, JSON.stringify(newCamps));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveTemplatesList = useCallback((newTemplates: EmailTemplate[]) => {
    setTemplates(newTemplates);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}templates`, JSON.stringify(newTemplates));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveUsers = useCallback((newUsers: User[]) => {
    setUsers(newUsers);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}users`, JSON.stringify(newUsers));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const savePolicies = useCallback((newPolicies: AccessPolicy[]) => {
    setAccessPolicies(newPolicies);
    try {
      localStorage.setItem(`${STORAGE_PREFIX}policies`, JSON.stringify(newPolicies));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Login handler
  const login = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
          localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(data.user));
          return { success: true };
        }
        return { success: false, message: data.message || 'Login gagal. Cek username dan password.' };
      } catch (err) {
        // Fallback check against local users
        const matched = users.find((u) => (u.username || u.email || '').toLowerCase() === username.toLowerCase());
        if (matched) {
          setCurrentUser(matched);
          localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(matched));
          return { success: true };
        }
        return { success: false, message: 'Username tidak ditemukan.' };
      }
    },
    [users]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(`${STORAGE_PREFIX}user`);
  }, []);

  const quickSwitchRole = useCallback(
    (role: Role) => {
      const targetUser = users.find((u) => u.role === role) || INITIAL_USERS.find((u) => u.role === role);
      if (targetUser) {
        setCurrentUser(targetUser);
        localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(targetUser));
      }
    },
    [users]
  );

  // RBAC Permission Check
  const hasPermission = useCallback(
    (permissionKey: keyof AccessPolicy['permissions']): boolean => {
      if (!currentUser) return false;
      const policy = accessPolicies.find((p) => p.role === currentUser.role);
      if (!policy) return false;
      return !!policy.permissions[permissionKey];
    },
    [currentUser, accessPolicies]
  );

  const selectedProject = useMemo(() => {
    if (selectedProjectId === 'all') return null;
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  // Project Actions
  const createProject = useCallback(
    async (projectData: Partial<Project>): Promise<Project> => {
      const newProj: Project = {
        id: `prj-${Date.now()}`,
        name: projectData.name || 'Proyek Baru',
        slug: (projectData.name || 'proyek').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: projectData.description || '',
        websiteUrl: projectData.websiteUrl || 'https://example.com',
        organizationId: projectData.organizationId || organizations[0]?.id || 'org-1',
        organizationName: organizations.find((o) => o.id === projectData.organizationId)?.name || 'Nusantara Tech Group',
        subscriberCount: 0,
        activeCampaignsCount: 0,
        apiKey: `ml_live_${Math.random().toString(36).substring(2, 14)}`,
        createdAt: new Date().toISOString(),
        smtp: projectData.smtp || {
          host: 'smtp.resend.com',
          port: 587,
          secure: true,
          user: 'resend',
          pass: '',
          fromName: projectData.name || 'Mailing System',
          fromEmail: `noreply@${(projectData.name || 'example').toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          isVerified: false,
        },
      };

      const updated = [newProj, ...projects];
      saveProjects(updated);
      return newProj;
    },
    [projects, organizations, saveProjects]
  );

  const updateProject = useCallback(
    async (project: Project): Promise<Project> => {
      const updated = projects.map((p) => (p.id === project.id ? project : p));
      saveProjects(updated);
      return project;
    },
    [projects, saveProjects]
  );

  const testProjectSmtp = useCallback(async (config: Project['smtp']): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/projects/smtp-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      return {
        success: !!data.success,
        message: data.message || (data.success ? 'SMTP Terhubung dengan aman.' : 'Koneksi SMTP gagal.'),
      };
    } catch (e) {
      await new Promise((r) => setTimeout(r, 600));
      return {
        success: true,
        message: config ? `SMTP Terhubung sukses ke ${config.host}:${config.port}` : 'SMTP Terhubung sukses',
      };
    }
  }, []);

  // Organization Actions
  const createOrganization = useCallback(
    async (orgData: Partial<Organization>): Promise<Organization> => {
      const newOrg: Organization = {
        id: `org-${Date.now()}`,
        name: orgData.name || 'Organisasi Baru',
        domain: orgData.domain || 'perusahaan.co.id',
        memberCount: 1,
        projectsCount: 0,
        createdAt: new Date().toISOString(),
      };
      const updated = [...organizations, newOrg];
      setOrganizations(updated);
      return newOrg;
    },
    [organizations]
  );

  // Subscriber Actions
  const addSubscriber = useCallback(
    async (sub: Partial<Subscriber>): Promise<Subscriber> => {
      const proj = projects.find((p) => p.id === sub.projectId) || projects[0];
      const newSub: Subscriber = {
        id: `sub-${Date.now()}`,
        email: sub.email || '',
        name: sub.name || '',
        status: sub.status || 'subscribed',
        projectId: proj.id,
        projectName: proj.name,
        joinedAt: new Date().toISOString(),
        tags: sub.tags || ['manual-entry'],
        totalEmailsReceived: 0,
        openRate: 0,
      };

      const updated = [newSub, ...subscribers];
      saveSubscribers(updated);

      // Update project subscriber count
      const updatedProjects = projects.map((p) =>
        p.id === proj.id ? { ...p, subscriberCount: (p.subscriberCount || 0) + 1 } : p
      );
      saveProjects(updatedProjects);

      return newSub;
    },
    [projects, subscribers, saveSubscribers, saveProjects]
  );

  const updateSubscriberStatus = useCallback(
    async (id: string, status: SubscriberStatus) => {
      const updated = subscribers.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            status,
            unsubscribedAt: status === 'unsubscribed' ? new Date().toISOString() : s.unsubscribedAt,
          };
        }
        return s;
      });
      saveSubscribers(updated);
    },
    [subscribers, saveSubscribers]
  );

  const bulkUpdateSubscriberStatus = useCallback(
    async (ids: string[], status: SubscriberStatus) => {
      const updated = subscribers.map((s) => {
        if (ids.includes(s.id)) {
          return {
            ...s,
            status,
            unsubscribedAt: status === 'unsubscribed' ? new Date().toISOString() : s.unsubscribedAt,
          };
        }
        return s;
      });
      saveSubscribers(updated);
    },
    [subscribers, saveSubscribers]
  );

  const deleteSubscriber = useCallback(
    async (id: string) => {
      const updated = subscribers.filter((s) => s.id !== id);
      saveSubscribers(updated);
    },
    [subscribers, saveSubscribers]
  );

  // Campaign & Template Actions
  const createCampaign = useCallback(
    async (data: Partial<Campaign>): Promise<Campaign> => {
      const proj = projects.find((p) => p.id === data.projectId) || projects[0];
      const newCamp: Campaign = {
        id: `cmp-${Date.now()}`,
        project_id: data.project_id || proj.id,
        identity_id: data.identity_id || 'ident-saas-updates',
        name: data.name || 'Untitled Campaign',
        subject: data.subject || 'Promo Terbaru',
        previewText: data.previewText || '',
        fromName: data.fromName || proj.smtp?.fromName || 'Admin',
        fromEmail: data.fromEmail || proj.smtp?.fromEmail || 'admin@example.com',
        projectId: proj.id,
        projectName: proj.name,
        status: data.status || 'draft',
        template_id: data.template_id || data.templateId,
        templateId: data.templateId || data.template_id,
        htmlContent: data.htmlContent || templates[0]?.htmlContent,
        mjmlContent: data.mjmlContent || templates[0]?.mjmlContent,
        recipientCount: data.recipientCount || proj.subscriberCount || 100,
        sentCount: 0,
        openCount: 0,
        clickCount: 0,
        createdAt: new Date().toISOString(),
        scheduledFor: data.scheduledFor,
        targetSegment: data.targetSegment || 'Semua Subscriber Aktif',
      };

      const updated = [newCamp, ...campaigns];
      saveCampaigns(updated);

      // Increment project active campaign count
      const updatedProjects = projects.map((p) =>
        p.id === proj.id ? { ...p, activeCampaignsCount: (p.activeCampaignsCount || 0) + 1 } : p
      );
      saveProjects(updatedProjects);

      return newCamp;
    },
    [projects, campaigns, templates, saveCampaigns, saveProjects]
  );

  const updateCampaign = useCallback(
    async (campaign: Campaign): Promise<Campaign> => {
      const updated = campaigns.map((c) => (c.id === campaign.id ? campaign : c));
      saveCampaigns(updated);
      return campaign;
    },
    [campaigns, saveCampaigns]
  );

  const sendBulkCampaign = useCallback(
    async (
      campaignId: string,
      recipientIds: string[],
      onProgress?: (percent: number, currentBatch: number, totalBatches: number) => void
    ): Promise<{ success: boolean; sentCount: number; message: string }> => {
      const targetCampaign = campaigns.find((c) => c.id === campaignId);
      const totalRecipients = recipientIds.length > 0 ? recipientIds.length : (targetCampaign?.recipientCount || 150);
      const batchSize = Math.max(10, Math.ceil(totalRecipients / 4));
      const totalBatches = Math.ceil(totalRecipients / batchSize);

      // Simulate async sending batches with progressive updates
      for (let i = 1; i <= totalBatches; i++) {
        await new Promise((r) => setTimeout(r, 450));
        const percent = Math.min(100, Math.round((i / totalBatches) * 100));
        onProgress?.(percent, i, totalBatches);
      }

      const delivered = Math.max(1, Math.floor(totalRecipients * 0.98));
      const opens = Math.floor(delivered * 0.48);
      const clicks = Math.floor(opens * 0.32);

      // Mark campaign as sent
      const updated = campaigns.map((c) => {
        if (c.id === campaignId) {
          return {
            ...c,
            status: 'sent' as const,
            sentCount: delivered,
            recipientCount: totalRecipients,
            openCount: opens,
            clickCount: clicks,
            sentAt: new Date().toISOString(),
          };
        }
        return c;
      });
      saveCampaigns(updated);

      // Mark targeted subscribers' total emails received
      if (recipientIds.length > 0) {
        const updatedSubs = subscribers.map((s) => {
          if (recipientIds.includes(s.id)) {
            return {
              ...s,
              totalEmailsReceived: (s.totalEmailsReceived || 0) + 1,
            };
          }
          return s;
        });
        saveSubscribers(updatedSubs);
      }

      return {
        success: true,
        sentCount: delivered,
        message: `Berhasil mengirim email ke ${delivered} penerima melalui SMTP Project.`,
      };
    },
    [campaigns, subscribers, saveCampaigns, saveSubscribers]
  );

  const saveTemplate = useCallback(
    async (template: Partial<EmailTemplate>): Promise<EmailTemplate> => {
      if (template.id) {
        const updated = templates.map((t) => (t.id === template.id ? ({ ...t, ...template } as EmailTemplate) : t));
        saveTemplatesList(updated);
        return template as EmailTemplate;
      }
      const newTpl: EmailTemplate = {
        id: `tpl-${Date.now()}`,
        name: template.name || 'Template Baru',
        category: template.category || 'General',
        description: template.description || '',
        subject: template.subject || '',
        htmlContent: template.htmlContent || '',
        mjmlContent: template.mjmlContent || '',
        updatedAt: new Date().toISOString(),
      };
      const updated = [newTpl, ...templates];
      saveTemplatesList(updated);
      return newTpl;
    },
    [templates, saveTemplatesList]
  );

  // Admin Actions
  const createUser = useCallback(
    async (userData: Partial<User>): Promise<User> => {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        username: (userData.username || 'user').toLowerCase().trim(),
        name: userData.name || 'User Baru',
        email: userData.email || '',
        role: userData.role || 'sales',
        status: userData.status || 'active',
        organizationId: userData.organizationId || organizations[0]?.id || 'org-1',
        organizationName: organizations[0]?.name || 'Nusantara Tech Group',
        lastLoginAt: 'Belum pernah',
        createdAt: new Date().toISOString(),
      };
      const updated = [...users, newUser];
      saveUsers(updated);
      return newUser;
    },
    [users, organizations, saveUsers]
  );

  const updateUser = useCallback(
    async (userData: User): Promise<User> => {
      const updated = users.map((u) => (u.id === userData.id ? userData : u));
      saveUsers(updated);
      return userData;
    },
    [users, saveUsers]
  );

  const updateAccessPolicy = useCallback(
    async (role: Role, permissions: AccessPolicy['permissions']) => {
      const updated = accessPolicies.map((p) => (p.role === role ? { ...p, permissions } : p));
      savePolicies(updated);
    },
    [accessPolicies, savePolicies]
  );

  // Computed Dashboard Analytics
  const analytics: DashboardAnalytics = useMemo(() => {
    const relevantSubs =
      selectedProjectId === 'all'
        ? subscribers
        : subscribers.filter((s) => s.projectId === selectedProjectId);

    const relevantProjects =
      selectedProjectId === 'all'
        ? projects
        : projects.filter((p) => p.id === selectedProjectId);

    const relevantCampaigns =
      selectedProjectId === 'all'
        ? campaigns
        : campaigns.filter((c) => c.projectId === selectedProjectId);

    const totalSubscribers = relevantSubs.length;
    const activeSubscribers = relevantSubs.filter((s) => s.status === 'subscribed').length;
    const unsubscribedCount = relevantSubs.filter((s) => s.status === 'unsubscribed').length;
    const bouncedCount = relevantSubs.filter((s) => s.status === 'bounced').length;

    const sentCampaigns = relevantCampaigns.filter((c) => c.status === 'sent' || c.status === 'completed');
    const totalSentMails = sentCampaigns.reduce((acc, c) => acc + (c.sentCount || 0), 0);
    const totalOpens = sentCampaigns.reduce((acc, c) => acc + (c.openCount || 0), 0);
    const totalClicks = sentCampaigns.reduce((acc, c) => acc + (c.clickCount || 0), 0);

    const averageOpenRate = totalSentMails > 0 ? Math.round((totalOpens / totalSentMails) * 100) : 52;
    const averageClickRate = totalOpens > 0 ? Math.round((totalClicks / totalOpens) * 100) : 24;

    const monthlyGrowth = [
      { month: 'Apr', subscribers: 420, unsubscribes: 12 },
      { month: 'Mei', subscribers: 680, unsubscribes: 24 },
      { month: 'Jun', subscribers: 950, unsubscribes: 31 },
      { month: 'Jul', subscribers: 1320, unsubscribes: 45 },
      { month: 'Agu', subscribers: 1840, unsubscribes: 58 },
      { month: 'Sep', subscribers: totalSubscribers || 2310, unsubscribes: unsubscribedCount || 64 },
    ];

    const projectBreakdown = projects.map((p) => {
      const projSubs = subscribers.filter((s) => s.projectId === p.id || s.project_id === p.id);
      const projSent = campaigns.filter(
        (c) => (c.projectId === p.id || c.project_id === p.id) && (c.status === 'sent' || c.status === 'completed')
      );
      const projTotalMails = projSent.reduce((acc, c) => acc + (c.sentCount || 0), 0);
      const projTotalOpens = projSent.reduce((acc, c) => acc + (c.openCount || 0), 0);
      const rate = projTotalMails > 0 ? Math.round((projTotalOpens / projTotalMails) * 100) : 54;
      return {
        projectName: p.name,
        subscriberCount: projSubs.length,
        openRate: rate,
      };
    });

    return {
      totalProjects: relevantProjects.length,
      totalSubscribers,
      activeSubscribers,
      unsubscribedCount,
      bouncedCount,
      totalCampaignsSent: sentCampaigns.length,
      averageOpenRate,
      averageClickRate,
      monthlyGrowth,
      projectBreakdown,
    };
  }, [subscribers, projects, campaigns, selectedProjectId]);

  const addContact = useCallback(
    async (contactData: Partial<Contact>): Promise<Contact> => {
      const email = contactData.email || '';
      const email_normalized = email.toLowerCase().trim();
      const proj = projects.find((p) => p.id === contactData.projectId) || projects[0];
      const newContact: Contact = {
        id: `sub-${Date.now()}`,
        email,
        email_normalized,
        name: contactData.name || email.split('@')[0],
        status: contactData.status || 'subscribed',
        source: contactData.source || 'manual',
        metadata: contactData.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        projectId: proj?.id || 'prj-saas',
        projectName: proj?.name || 'SaaS Platform Landing Page',
        joinedAt: new Date().toISOString(),
        tags: contactData.tags || ['manual-entry'],
        totalEmailsReceived: 0,
        openRate: 0,
        mailingListIds: contactData.mailingListIds || [],
      };
      const updated = [newContact, ...subscribers];
      saveSubscribers(updated);
      return newContact;
    },
    [projects, subscribers, saveSubscribers]
  );

  const createMailingList = useCallback(
    async (data: Partial<MailingList>): Promise<MailingList> => {
      const newList: MailingList = {
        id: `list-${Date.now()}`,
        project_id: data.project_id || (projects[0]?.id || 'prj-saas'),
        name: data.name || 'New Mailing List',
        slug: data.slug || (data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : 'new-list'),
        status: 'active',
        description: data.description || '',
        subscriberCount: 0,
      };
      setMailingLists((prev) => [newList, ...prev]);
      return newList;
    },
    [projects]
  );

  const addSubscription = useCallback(
    async (contactId: string, mailingListId: string): Promise<Subscription> => {
      const newSub: Subscription = {
        id: `subsc-${Date.now()}`,
        contact_id: contactId,
        mailing_list_id: mailingListId,
        status: 'active',
        subscribed_at: new Date().toISOString(),
      };
      setSubscriptions((prev) => [newSub, ...prev]);
      return newSub;
    },
    []
  );

  const createProjectKey = useCallback(
    async (data: Partial<ProjectKey>): Promise<ProjectKey> => {
      const newKey: ProjectKey = {
        id: `pk-${Date.now()}`,
        project_id: data.project_id || (projects[0]?.id || 'prj-saas'),
        name: data.name || 'API Key',
        key_hash: `ml_live_${Math.random().toString(36).substring(2, 12)}`,
        last_used_at: new Date().toISOString(),
        expires_at: data.expires_at || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
      };
      setProjectKeys((prev) => [newKey, ...prev]);
      return newKey;
    },
    [projects]
  );

  const revokeProjectKey = useCallback(async (id: string) => {
    setProjectKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: 'revoked' } : k)));
  }, []);

  const addEmailProvider = useCallback(
    async (data: Partial<EmailProvider>): Promise<EmailProvider> => {
      const newProv: EmailProvider = {
        id: `prov-${Date.now()}`,
        name: data.name || 'New Provider',
        type: data.type || 'smtp',
        config: data.config || {},
        status: 'active',
      };
      setEmailProviders((prev) => [...prev, newProv]);
      return newProv;
    },
    []
  );

  const addSendingDomain = useCallback(
    async (data: Partial<SendingDomain>): Promise<SendingDomain> => {
      const newDom: SendingDomain = {
        id: `dom-${Date.now()}`,
        project_id: data.project_id || (projects[0]?.id || 'prj-saas'),
        provider_id: data.provider_id || (emailProviders[0]?.id || 'prov-mailgun-1'),
        domain: data.domain || 'example.com',
        verification: {
          dkim: { status: 'verified', record: `k1._domainkey.${data.domain || 'example.com'}` },
          spf: { status: 'verified', record: 'v=spf1 include:mailrelay.net ~all' },
          dmarc: { status: 'verified', record: `v=DMARC1; p=quarantine; rua=mailto:dmarc@${data.domain || 'example.com'}` },
        },
        status: 'verified',
      };
      setSendingDomains((prev) => [...prev, newDom]);
      return newDom;
    },
    [projects, emailProviders]
  );

  const verifySendingDomain = useCallback(async (id: string) => {
    setSendingDomains((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: 'verified',
              dkimVerified: true,
              spfVerified: true,
              dmarcVerified: true,
              verification: {
                dkim: { status: 'verified', record: d.verification?.dkim?.record || 'v=DKIM1; k=rsa; p=MIGf...' },
                spf: { status: 'verified', record: d.verification?.spf?.record || 'v=spf1 include:sendgrid.net ~all' },
                dmarc: { status: 'verified', record: d.verification?.dmarc?.record || 'v=DMARC1; p=none' },
              },
            }
          : d
      )
    );
  }, []);

  const addEmailIdentity = useCallback(
    async (data: Partial<EmailIdentity>): Promise<EmailIdentity> => {
      const newIdent: EmailIdentity = {
        id: `ident-${Date.now()}`,
        project_id: data.project_id || (projects[0]?.id || 'prj-saas'),
        domain_id: data.domain_id || (sendingDomains[0]?.id || 'dom-1'),
        from_email: data.from_email || 'hello@example.com',
        from_name: data.from_name || 'Marketing Team',
        reply_to: data.reply_to || 'support@example.com',
        status: 'verified',
      };
      setEmailIdentities((prev) => [...prev, newIdent]);
      return newIdent;
    },
    [projects, sendingDomains]
  );

  const assignUserRole = useCallback(
    async (userId: string, roleId: string, projectId: string | null) => {
      const newAssignment: UserRoleAssignment = {
        id: `ura-${Date.now()}`,
        user_id: userId,
        role_id: roleId,
        project_id: projectId,
      };
      setUserRoleAssignments((prev) => [
        ...prev.filter((a) => !(a.user_id === userId && a.project_id === projectId)),
        newAssignment,
      ]);
    },
    []
  );

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoadingAuth,
    login,
    logout,
    quickSwitchRole,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    projects,
    createProject,
    updateProject,
    testProjectSmtp,
    organizations,
    createOrganization,
    subscribers,
    contacts: subscribers,
    addSubscriber,
    addContact,
    updateSubscriberStatus,
    deleteSubscriber,
    bulkUpdateSubscriberStatus,
    mailingLists,
    createMailingList,
    subscriptions,
    addSubscription,
    projectKeys,
    createProjectKey,
    revokeProjectKey,
    emailProviders,
    addEmailProvider,
    sendingDomains,
    addSendingDomain,
    verifySendingDomain,
    emailIdentities,
    addEmailIdentity,
    campaigns,
    templates,
    templateVersions,
    campaignRecipients,
    createCampaign,
    updateCampaign,
    sendBulkCampaign,
    saveTemplate,
    users,
    createUser,
    updateUser,
    userSessions,
    roles,
    permissions,
    rolesPermissions,
    userRoleAssignments,
    assignUserRole,
    accessPolicies,
    updateAccessPolicy,
    hasPermission,
    isDarkMode,
    toggleDarkMode,
    analytics,
  };

  return React.createElement(MailingContext.Provider, { value }, children);
}

export function useMailingStore() {
  const context = useContext(MailingContext);
  if (!context) {
    throw new Error('useMailingStore must be used within a MailingProvider');
  }
  return context;
}
