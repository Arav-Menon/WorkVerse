export interface ModelInfo {
  name: string;
  provider: string;
}

export interface Suggestion {
  icon: string;
  text: string;
}

export const currentModel: ModelInfo = {
  name: "GPT-4o",
  provider: "OpenAI",
};

export const suggestions: Suggestion[] = [
  { icon: "ti-layout-grid", text: "Create workspace" },
  { icon: "ti-users", text: "Invite member" },
  { icon: "ti-plug-connected", text: "Connect GitHub" },
  { icon: "ti-arrows-split", text: "Build workflow" },
  { icon: "ti-device-desktop", text: "Create room" },
  { icon: "ti-clock", text: "Create automation" },
];
