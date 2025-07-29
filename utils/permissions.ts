export const hasPermission = (permissionToCheck: string): boolean => {
  // Check if running in browser environment
  if (typeof window === 'undefined') return false;

  const raw = localStorage.getItem('auth_user');
  if (!raw) return false;

  try {
    const user = JSON.parse(raw);

    // Safely extract all permissions from roles
    const allPermissions = user.roles?.flatMap((role: any) => 
      role.permissions?.map((permission: any) => permission.name) || []
    ) || [];

    return allPermissions.includes(permissionToCheck);
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
};