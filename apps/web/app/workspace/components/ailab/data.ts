export interface AIAgent {
  id: string;
  name: string;
  type: "chat" | "workflow" | "reviewer" | "researcher";
  status: "running" | "idle" | "error";
  lastRun: string;
  runCount: number;
  model: string;
  desc: string;
}

export interface Workflow {
  id: string;
  name: string;
  trigger: string;
  steps: string[];
  status: "active" | "paused";
  lastRun: string;
  runCount: number;
}

export interface ModelInfo {
  name: string;
  provider: string;
  tokenLimit: number;
  tokensUsed: number;
  costThisMonth: string;
}

export interface Capability {
  name: string;
  icon: string;
  connected: boolean;
  permission: string;
  desc: string;
}

export interface ExecutionLog {
  icon: string;
  title: string;
  desc: string;
  time: string;
  type: "workflow" | "agent" | "system" | "error";
  user: string;
}

export interface Suggestion {
  icon: string;
  text: string;
}

export const aiAgents: AIAgent[] = [
  {
    id: "agent-1",
    name: "Code Reviewer",
    type: "reviewer",
    status: "running",
    lastRun: "3m ago",
    runCount: 142,
    model: "GPT-4o",
    desc: "Reviews PRs for code quality, security, and best practices",
  },
  {
    id: "agent-2",
    name: "Sprint Planner",
    type: "workflow",
    status: "idle",
    lastRun: "2h ago",
    runCount: 28,
    model: "Claude 3.5",
    desc: "Breaks down features into actionable tasks with estimates",
  },
  {
    id: "agent-3",
    name: "Doc Writer",
    type: "researcher",
    status: "running",
    lastRun: "12m ago",
    runCount: 87,
    model: "GPT-4o",
    desc: "Generates and maintains technical documentation from code",
  },
  {
    id: "agent-4",
    name: "Standup Bot",
    type: "chat",
    status: "idle",
    lastRun: "6h ago",
    runCount: 312,
    model: "Claude 3.5",
    desc: "Collects daily updates and posts standup summaries to Slack",
  },
  {
    id: "agent-5",
    name: "Issue Triager",
    type: "workflow",
    status: "error",
    lastRun: "1d ago",
    runCount: 56,
    model: "GPT-4o",
    desc: "Auto-labels, prioritizes, and assigns incoming GitHub issues",
  },
];

export const workflows: Workflow[] = [
  {
    id: "wf-1",
    name: "PR Auto-Review",
    trigger: "Pull request opened",
    steps: ["Fetch PR diff", "Run code analysis", "Post review comments"],
    status: "active",
    lastRun: "3m ago",
    runCount: 142,
  },
  {
    id: "wf-2",
    name: "Issue Triage",
    trigger: "Issue created",
    steps: ["Parse issue content", "Classify priority", "Assign label & owner"],
    status: "active",
    lastRun: "18m ago",
    runCount: 89,
  },
  {
    id: "wf-3",
    name: "Deploy Notifier",
    trigger: "CI pipeline success",
    steps: ["Detect deployment", "Generate changelog", "Post to #deploys"],
    status: "active",
    lastRun: "1h ago",
    runCount: 234,
  },
  {
    id: "wf-4",
    name: "Daily Standup",
    trigger: "Cron: 9:30 AM weekdays",
    steps: ["Collect git activity", "Pull Jira status", "Post summary"],
    status: "paused",
    lastRun: "2d ago",
    runCount: 312,
  },
  {
    id: "wf-5",
    name: "Stale Branch Cleanup",
    trigger: "Cron: Sundays 2 AM",
    steps: ["Find branches > 30 days", "Notify owners", "Delete if no response"],
    status: "active",
    lastRun: "5d ago",
    runCount: 48,
  },
];

export const currentModel: ModelInfo = {
  name: "GPT-4o",
  provider: "OpenAI",
  tokenLimit: 50000,
  tokensUsed: 18420,
  costThisMonth: "$12.40",
};

export const capabilities: Capability[] = [
  { name: "GitHub Repos", icon: "ti-brand-github", connected: true, permission: "Read & Write", desc: "Read code, create PRs, post comments" },
  { name: "Slack", icon: "ti-brand-slack", connected: true, permission: "Read & Send", desc: "Read channels, send messages" },
  { name: "Google Calendar", icon: "ti-calendar-event", connected: true, permission: "Read & Create", desc: "View events, schedule meetings" },
  { name: "Notion", icon: "ti-brand-notion", connected: false, permission: "Expired", desc: "Read & create documents" },
  { name: "Linear", icon: "ti-chart-line", connected: true, permission: "Read & Write", desc: "Manage issues and projects" },
  { name: "Figma", icon: "ti-brand-figma", connected: false, permission: "Not connected", desc: "Access design files" },
  { name: "Jira", icon: "ti-list-check", connected: false, permission: "Not connected", desc: "Sync tasks and sprints" },
  { name: "Google Drive", icon: "ti-brand-google-drive", connected: false, permission: "Not connected", desc: "Read & create documents" },
];

export const executionLogs: ExecutionLog[] = [
  { icon: "ti-brand-github", title: "PR #142 reviewed", desc: "Code Reviewer analyzed 12 files, left 3 suggestions", time: "3m ago", type: "agent", user: "AI" },
  { icon: "ti-refresh", title: "PR Auto-Review triggered", desc: "Workflow started on PR #142 in workVerse/backend", time: "3m ago", type: "workflow", user: "System" },
  { icon: "ti-brand-slack", title: "Standup summary posted", desc: "Posted daily update to #engineering with 8 entries", time: "6h ago", type: "workflow", user: "AI" },
  { icon: "ti-calendar-event", title: "Meeting scheduled", desc: "Created 'Sprint Retro' for Friday 3PM with 6 attendees", time: "8h ago", type: "agent", user: "AI" },
  { icon: "ti-alert-triangle", title: "Issue triage failed", desc: "Issue Triager agent encountered API rate limit", time: "1d ago", type: "error", user: "System" },
  { icon: "ti-file-description", title: "API docs generated", desc: "Doc Writer created 4 pages from /api/v2 source", time: "1d ago", type: "agent", user: "AI" },
  { icon: "ti-settings", title: "Deploy notification sent", desc: "Posted changelog for v2.4.1 to #deploys channel", time: "1d ago", type: "workflow", user: "System" },
  { icon: "ti-robot", title: "Batch issue labeling", desc: "Labeled 23 issues across 3 repos with priority tags", time: "2d ago", type: "agent", user: "AI" },
];

export const suggestions: Suggestion[] = [
  { icon: "ti-bolt", text: "GitHub → Slack workflow" },
  { icon: "ti-user-plus", text: "Invite a teammate" },
  { icon: "ti-plug-connected", text: "Connect GitHub" },
  { icon: "ti-file-description", text: "Generate sprint notes" },
  { icon: "ti-code", text: "Review open PRs" },
  { icon: "ti-calendar-event", text: "Schedule retro meeting" },
];
