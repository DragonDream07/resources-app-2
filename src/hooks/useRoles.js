import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function useRoles() {
  const { user } = useAuth();

  const roles = user?.roles || [];

  const hasRole = useCallback(
    (role) => {
      if (!roles || roles.length === 0) return false;
      if (typeof role === 'string') return roles.includes(role);
      if (Array.isArray(role)) return role.some((r) => roles.includes(r));
      return false;
    },
    [roles]
  );

  const isAdmin = hasRole('admin');
  const isCustomer = hasRole('customer');
  const isGuest = !user;

  return { roles, hasRole, isAdmin, isCustomer, isGuest };
}
