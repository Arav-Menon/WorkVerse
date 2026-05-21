export type OrgColor = "purple" | "teal" | "coral" | "blue";

export interface HomeOrganization {
  id: string;
  slug: string;
  name: string;
  description: string;
  members: number;
  workspaces: number;
  online: number;
  avatar: string;
  color: OrgColor;
  updated: string;
  role: string;
  tags: string[];
}

export interface HomeStat {
  label: string;
  value: string;
  helper: string;
  icon: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  actor: string;
  avatar: string;
  icon: string;
}

export interface HomePageData {
  currentUser: {
    name: string;
    initials: string;
    role: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
  stats: HomeStat[];
  organizations: HomeOrganization[];
  activity: ActivityItem[];
  profileMenu: { label: string; href: string; icon: string }[];
}

const organizations: HomeOrganization[] = [
  {
    id: "org-cleven",
    slug: "clevenstudios",
    name: "ClevenStudios",
    description: "Product design, strategy, and delivery for fast-moving teams.",
    members: 12,
    workspaces: 4,
    online: 8,
    avatar: "CS",
    color: "purple",
    updated: "5m ago",
    role: "Owner",
    tags: ["Design", "Product"],
  },
  {
    id: "org-nexa",
    slug: "nexalabs",
    name: "NexaLabs",
    description: "AI research, orchestration, and production model operations.",
    members: 31,
    workspaces: 7,
    online: 14,
    avatar: "NX",
    color: "teal",
    updated: "1m ago",
    role: "Core member",
    tags: ["AI", "Infra"],
  },
  {
    id: "org-skyforge",
    slug: "skyforge",
    name: "SkyForge",
    description: "Cloud infrastructure, deployment systems, and founder ops.",
    members: 9,
    workspaces: 3,
    online: 2,
    avatar: "SK",
    color: "coral",
    updated: "18m ago",
    role: "Admin",
    tags: ["Cloud", "Ops"],
  },
  {
    id: "org-blueorbit",
    slug: "blueorbit",
    name: "BlueOrbit",
    description: "Growth experimentation and lifecycle performance for SaaS teams.",
    members: 18,
    workspaces: 5,
    online: 6,
    avatar: "BO",
    color: "blue",
    updated: "42m ago",
    role: "Collaborator",
    tags: ["Growth", "Analytics"],
  },
];

const stats: HomeStat[] = [
  { label: "Organizations", value: "4", helper: "Member access", icon: "ti-layout-grid" },
  { label: "Workspaces", value: "19", helper: "Across all orgs", icon: "ti-stack-2" },
  { label: "Online now", value: "30", helper: "Teammates active", icon: "ti-users" },
  { label: "Live rooms", value: "6", helper: "Voice + work zones", icon: "ti-wave-sine" },
];

const activity: ActivityItem[] = [
  {
    id: "act-1",
    title: "New AI review cycle started",
    detail: "NexaLabs kicked off a prompt evaluation run for support workflows.",
    time: "2m ago",
    actor: "AR",
    avatar: "NX",
    icon: "ti-robot",
  },
  {
    id: "act-2",
    title: "Design sprint workspace updated",
    detail: "ClevenStudios published three new artifacts in Product Design Arena.",
    time: "11m ago",
    actor: "PR",
    avatar: "CS",
    icon: "ti-sparkles",
  },
  {
    id: "act-3",
    title: "Ops room deployment completed",
    detail: "SkyForge rolled out the latest pipeline update to its cloud workspace.",
    time: "28m ago",
    actor: "SM",
    avatar: "SK",
    icon: "ti-cloud-upload",
  },
  {
    id: "act-4",
    title: "Growth board shared",
    detail: "BlueOrbit opened a new lifecycle dashboard for cross-team review.",
    time: "1h ago",
    actor: "LR",
    avatar: "BO",
    icon: "ti-chart-dots-3",
  },
];

const profileMenu = [
  { label: "Profile", href: "/profile", icon: "ti-user-circle" },
  { label: "Organizations", href: "/organization", icon: "ti-building-community" },
  { label: "AI Lab", href: "/ai-lab", icon: "ti-robot" },
  { label: "Sign out", href: "/auth", icon: "ti-logout" },
];

export async function getHomePageData(): Promise<HomePageData> {
  return {
    currentUser: {
      name: "Arav Kumar",
      initials: "AK",
      role: "Personal workspace",
    },
    hero: {
      eyebrow: "Organization overview",
      title: "All organizations you belong to, in one premium control surface.",
      description:
        "Search teams, jump into active workspaces, and track live movement across your Workverse network without leaving the home dashboard.",
      primaryAction: "Open organization hub",
      secondaryAction: "Launch virtual office",
    },
    stats,
    organizations,
    activity,
    profileMenu,
  };
}
