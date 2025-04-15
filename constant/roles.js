export const SPACE_ROLES = [
  {
    icon: 'fa-regular fa-gear',
    value: 'space-supervisor',
    label: 'calendar.role.supervisor',
    permissions: ['view', 'delete', 'edit', 'add'],
  },
  {
    icon: 'fa-regular fa-chalkboard-teacher',
    value: 'space-coordinator',
    label: 'calendar.role.coordinator',
    permissions: ['view', 'edit', 'add'],
  },
  {
    icon: 'fa-regular fa-user-graduate',
    value: 'space-member',
    label: 'calendar.role.member',
    permissions: ['view'],
  },
];

export const COURSE_ROLES = [
  {
    icon: 'fa-regular fa-gear',
    value: 'course-observer',
    label: 'calendar.role.observer',
    permissions: ['view', 'delete', 'edit', 'add'],
  },
  {
    icon: 'fa-regular fa-chalkboard-teacher',
    value: 'course-teacher',
    label: 'calendar.role.teacher',
    permissions: ['view', 'edit', 'add'],
  },
  {
    icon: 'fa-regular fa-user-graduate',
    value: 'course-attendant',
    label: 'calendar.role.attendant',
    permissions: ['view'],
  },
];

export const CALENDAR_ROLES = [
  {
    icon: 'fa-regular fa-user-tie',
    value: 'calendar-organizer',
    label: 'calendar.role.organizer',
    permissions: ['view', 'delete', 'edit', 'add'],
  },
  {
    icon: 'fa-regular fa-user-pen',
    value: 'calendar-scheduler',
    label: 'calendar.role.scheduler',
    permissions: ['view', 'edit', 'add'],
  },
  {
    icon: 'fa-regular fa-clipboard-user',
    value: 'calendar-participant',
    label: 'calendar.role.participant',
    permissions: ['view'],
  },
];

export const ROOM_ROLES = [
  {
    icon: 'fa-regular fa-user-pen',
    value: 'chat-room-admin',
    label: 'calendar.role.adminL',
    permissions: ['view', 'edit', 'add'],
  },
  {
    icon: 'fa-regular fa-user',
    value: 'chat-room-member',
    label: 'calendar.role.member',
    permissions: ['view'],
  },
];

export const ROOM_ALL_ROLES = [
  {
    icon: 'fa-regular fa-user-gear',
    value: 'chat-room-owner',
    label: 'org.role.owner',
    permissions: ['view', 'delete', 'edit', 'add'],
  },
  ...ROOM_ROLES,
];

export const ORGANIZATION_ROLE_TYPE = {
  OWNER: 'organization-owner',
  ADMIN: 'organization-admin',
  MEMBER: 'organization-member',
};
