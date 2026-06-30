import { Role } from "@prisma/client";

export const ROLE_HIERARCHY: Record<Role, number> = {
  CUSTOMER: 1,
  DESIGNER: 2,
  SALES: 3,
  ADMIN: 4,
};

export function hasMinimumRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export const ADMIN_ROLES: Role[] = [Role.ADMIN];
export const STAFF_ROLES: Role[] = [Role.ADMIN, Role.SALES, Role.DESIGNER];
