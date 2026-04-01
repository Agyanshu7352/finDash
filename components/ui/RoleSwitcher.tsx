/**
 * RoleSwitcher — Toggle between Admin and Viewer roles.
 *
 * UI decision: Uses a segmented control pattern (pill-style toggle)
 * instead of a dropdown, providing clear visual feedback of the current state.
 * This is a frontend-only simulation; in production, roles would come from auth.
 */
'use client';

import { useFinanceStore } from '@/store/useFinanceStore';
import { UserRole } from '@/types/finance';

export default function RoleSwitcher() {
  const role = useFinanceStore((s) => s.role);
  const setRole = useFinanceStore((s) => s.setRole);
  const addToast = useFinanceStore((s) => s.addToast);

  const handleRoleChange = (newRole: UserRole) => {
    if (newRole !== role) {
      setRole(newRole);
      addToast(
        `Switched to ${newRole === 'admin' ? 'Admin' : 'Viewer'} mode`,
        'info'
      );
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs font-medium text-gray-500 dark:text-gray-400 sm:block">
        Role:
      </span>
      <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-gray-700/50">
        {(['admin', 'viewer'] as UserRole[]).map((r) => (
          <button
            key={r}
            onClick={() => handleRoleChange(r)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all duration-200
              ${
                role === r
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
          >
            {r === 'admin' ? '🔓 Admin' : '👁️ Viewer'}
          </button>
        ))}
      </div>
    </div>
  );
}
