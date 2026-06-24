export const ROLES = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  INVITE_MEMBER: ["OWNER", "ADMIN"],
  CREATE_WORKSPACE: ["OWNER", "ADMIN"],
  REMOVE_MEMBER: ["OWNER", "ADMIN"],
  MANAGE_INTEGRATIONS: ["OWNER", "ADMIN"],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: string, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(role);
}
