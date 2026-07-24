import type { UserRole } from '@/types/database';

export type Permission = 'menu:read' | 'menu:write' | 'media:write' | 'theme:write' | 'seo:write' | 'users:manage';

const rolePermissions: Record<UserRole, Permission[]> = {
  owner: ['menu:read', 'menu:write', 'media:write', 'theme:write', 'seo:write', 'users:manage'],
  manager: ['menu:read', 'menu:write', 'media:write', 'seo:write'],
  editor: ['menu:read', 'menu:write', 'media:write'],
  viewer: ['menu:read'],
};

export function canAccess(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

export function assertAccess(role: UserRole, permission: Permission): void {
  if (!canAccess(role, permission)) {
    throw new Error(`Role ${role} cannot perform ${permission}`);
  }
}
