export const typeRoles = [
  {
    label: 'Space & Courses',
    title: 'calendar.role.space',
    value: 'spaceCourses',
    icon: 'fa-solid fa-chevron-right',
  },
  {
    label: 'Calendars',
    title: 'calendar.label',
    value: 'calendars',
    icon: 'fa-solid fa-chevron-right',
  },
];

export const roleList = [
  {
    label: 'calendar.role.admin',
    value: 'organization-admin',
    icon: 'fa-regular fa-gear',
    typeRoles,
  },
  {
    label: 'calendar.role.member',
    value: 'organization-member',
    icon: 'fa-regular fa-user',
    typeRoles,
  },
];
