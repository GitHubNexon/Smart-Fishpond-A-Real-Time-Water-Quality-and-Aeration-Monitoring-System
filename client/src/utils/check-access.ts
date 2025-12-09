// utils/check-access.ts

export const canAccess = (userAccess: string[] = [], path: string): boolean => {
  // Normalize the path (remove trailing slashes)
  const normalizedPath =
    path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;

  // Direct match
  if (userAccess.includes(normalizedPath)) return true;

  // Check with trailing slash
  if (userAccess.includes(normalizedPath + '/')) return true;

  // Convert new nested route to old query param format
  const pathParts = normalizedPath.split('/').filter(Boolean);

  if (pathParts.length === 2) {
    const [section, tab] = pathParts;
    const tabWithUnderscore = tab.replace(/-/g, '_');
    const oldFormat = `/${section}?tab=${tabWithUnderscore}`;

    if (userAccess.includes(oldFormat)) return true;
  }

  // Check parent route access
  const parentPath = '/' + pathParts[0];
  if (userAccess.includes(parentPath)) return true;

  return false;
};
