export interface ConnectedService {
  id: string;
  name: string;
  icon: string;
  account: string;
  status: string;
  synced: string;
  health: "healthy" | "expired";
  category: string;
  permissions: string[];
  aiAccess: string[];
  usage: { apiCalls: string; lastAction: string; dataSynced: string };
}

export interface AvailableIntegration {
  id: string;
  name: string;
  icon: string;
  desc: string;
  category: string;
}

export interface HealthStat {
  label: string;
  count: number;
  color: string;
  bg: string;
  dot: string;
}

export interface Activity {
  icon: string;
  title: string;
  desc: string;
  time: string;
  type: "sync" | "error" | "info";
}

export interface Recommendation {
  icon: string;
  title: string;
  desc: string;
  actionLabel: string;
  type: "reconnect" | "suggested";
}

export interface FilterPill {
  name: string;
  dot: string;
}

export const connectedServices: ConnectedService[] = [
  {
    id: "github",
    name: "GitHub",
    icon: "ti-brand-github",
    account: "arav@clevenstudios.com",
    status: "connected",
    synced: "2 minutes ago",
    health: "healthy",
    category: "devops",
    permissions: ["Read repositories", "Read pull requests", "Read issues", "Write comments"],
    aiAccess: ["Read repos", "Read issues", "Create PR comments"],
    usage: { apiCalls: "1.2k", lastAction: "Created PR comment", dataSynced: "24 MB" },
  },
  {
    id: "google",
    name: "Google Calendar",
    icon: "ti-calendar-event",
    account: "arav@clevenstudios.com",
    status: "connected",
    synced: "5 minutes ago",
    health: "healthy",
    category: "productivity",
    permissions: ["Read events", "Create events", "Read contacts"],
    aiAccess: ["Read events", "Create meetings"],
    usage: { apiCalls: "840", lastAction: "Created meeting", dataSynced: "6 MB" },
  },
  {
    id: "slack",
    name: "Slack",
    icon: "ti-brand-slack",
    account: "clevenstudios.slack.com",
    status: "connected",
    synced: "12 minutes ago",
    health: "healthy",
    category: "communication",
    permissions: ["Read messages", "Send messages", "Read channels"],
    aiAccess: ["Send messages", "Read channels"],
    usage: { apiCalls: "3.4k", lastAction: "Sent channel message", dataSynced: "52 MB" },
  },
  {
    id: "notion",
    name: "Notion",
    icon: "ti-brand-notion",
    account: "arav@clevenstudios.com",
    status: "attention",
    synced: "3 days ago",
    health: "expired",
    category: "productivity",
    permissions: ["Read pages", "Create pages", "Read databases"],
    aiAccess: ["Create pages", "Read pages"],
    usage: { apiCalls: "0", lastAction: "Token expired", dataSynced: "0 MB" },
  },
  {
    id: "linear",
    name: "Linear",
    icon: "ti-chart-line",
    account: "arav@clevenstudios.com",
    status: "connected",
    synced: "1 hour ago",
    health: "healthy",
    category: "devops",
    permissions: ["Read issues", "Create issues", "Read teams"],
    aiAccess: ["Create issues", "Read issues"],
    usage: { apiCalls: "560", lastAction: "Created issue", dataSynced: "8 MB" },
  },
];

export const availableIntegrations: AvailableIntegration[] = [
  { id: "gmail", name: "Gmail", icon: "ti-mail", desc: "Read and send emails via AI", category: "communication" },
  { id: "figma", name: "Figma", icon: "ti-brand-figma", desc: "Access designs and assets", category: "design" },
  { id: "jira", name: "Jira", icon: "ti-list-check", desc: "Sync tasks and sprints", category: "devops" },
  { id: "discord", name: "Discord", icon: "ti-brand-discord", desc: "Send team notifications", category: "communication" },
  { id: "dropbox", name: "Dropbox", icon: "ti-brand-dropbox", desc: "Access and sync files", category: "productivity" },
  { id: "drive", name: "Google Drive", icon: "ti-brand-google-drive", desc: "Read and create documents", category: "productivity" },
  { id: "hubspot", name: "HubSpot", icon: "ti-building-store", desc: "CRM sync and deal tracking", category: "productivity" },
  { id: "zoom", name: "Zoom", icon: "ti-video", desc: "Schedule and join meetings", category: "communication" },
];

export const healthStats: HealthStat[] = [
  { label: "Active", count: 4, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-500" },
  { label: "Attention", count: 1, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", dot: "bg-amber-500" },
  { label: "Errors", count: 0, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", dot: "bg-red-500" },
  { label: "Available", count: 8, color: "text-zinc-400", bg: "bg-zinc-900/50 border-zinc-800", dot: "bg-zinc-600" },
];

export const recentActivity: Activity[] = [
  { icon: "ti-refresh", title: "GitHub synced", desc: "Repositories, PRs, and issues updated", time: "2m ago", type: "sync" },
  { icon: "ti-calendar-event", title: "Calendar synced", desc: "3 new events pulled from Google Calendar", time: "5m ago", type: "sync" },
  { icon: "ti-brand-slack", title: "Slack synced", desc: "12 new messages across 3 channels", time: "12m ago", type: "sync" },
  { icon: "ti-alert-triangle", title: "Notion token expired", desc: "Reconnect to restore AI access and sync", time: "3d ago", type: "error" },
  { icon: "ti-chart-line", title: "Linear synced", desc: "8 issues updated, 2 new tasks created", time: "1h ago", type: "sync" },
  { icon: "ti-robot", title: "AI created PR comment", desc: "WorkVerse AI commented on PR #142 in GitHub", time: "1h ago", type: "info" },
];

export const recommendations: Recommendation[] = [
  { icon: "ti-brand-notion", title: "Reconnect Notion", desc: "Your Notion token expired 3 days ago. Reconnect to restore AI access and document sync.", actionLabel: "Reconnect", type: "reconnect" },
  { icon: "ti-mail", title: "Connect Gmail", desc: "Enable AI-powered email drafting, summarization, and smart replies for your team.", actionLabel: "Connect", type: "suggested" },
  { icon: "ti-brand-figma", title: "Connect Figma", desc: "Let AI reference design files when generating code, PRs, and design documentation.", actionLabel: "Connect", type: "suggested" },
];

export const filterPills: FilterPill[] = [
  { name: "All", dot: "bg-zinc-500" },
  { name: "Communication", dot: "bg-blue-500" },
  { name: "Productivity", dot: "bg-amber-500" },
  { name: "DevOps", dot: "bg-emerald-500" },
  { name: "Design", dot: "bg-pink-500" },
];
