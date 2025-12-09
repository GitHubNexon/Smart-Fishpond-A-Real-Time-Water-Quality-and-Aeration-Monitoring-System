// /utils/role.utils.ts
export const hasRole = (user: any, roles: string[]) => {
  return roles.includes(user?.roleId?.role);
};
