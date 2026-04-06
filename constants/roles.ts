export const PERMISSIONS = {
  // User management
  CREATE_USER: ['admin'],
  UPDATE_USER: ['admin'],
  DELETE_USER: ['admin'],
  VIEW_ALL_USERS: ['admin'],

  // Financial records
  CREATE_RECORD: ['admin', 'analyst'],
  UPDATE_RECORD: ['admin', 'analyst'],
  DELETE_RECORD: ['admin'],
  VIEW_RECORDS: ['admin', 'analyst', 'viewer'],

  // Dashboard
  VIEW_DASHBOARD: ['admin', 'analyst', 'viewer'],
  VIEW_TRENDS: ['admin', 'analyst'],
} as const;

export type Permission = keyof typeof PERMISSIONS;
