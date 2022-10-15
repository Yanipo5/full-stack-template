export type Role = "admin" | "user" | "viewer";
export type RoleMap = Partial<Record<Role, boolean>>;
const allRoles: Role[] = ["admin", "user", "viewer"];

export type Permission = "user.login" | "user.create" | "user.validate" | "person.getAll" | "person.create" | "person.deleteAll";

export type PermissionMap = Partial<typeof permissionMap>;
export const permissionMap: Record<Permission, Role[]> = {
  //
  "user.login": allRoles,
  "user.create": allRoles,
  "user.validate": allRoles,
  //
  "person.getAll": allRoles,
  "person.create": allRoles,
  "person.deleteAll": allRoles
};

export function authorize(roles: RoleMap, permission: Permission) {
  return permissionMap[permission].some((p) => roles[p]);
}
