const AccountMenu = [
  { id: 'ProfileInfo', iconClass: 'fa-solid fa-user', label: 'Profile Info' },
  {
    id: 'General',
    iconClass: 'fa-solid fa-gear',
    label: 'event.menu.account.preference',
  },
  {
    id: 'Notifications',
    iconClass: 'fa-solid fa-bell',
    label: 'event.menu.account.notifications',
  },
  {
    id: 'APIKey',
    iconClass: 'fa-solid fa-key-skeleton',
    label: 'event.menu.account.apiKey',
  },
  {
    id: 'Webhook',
    iconClass: 'fa-solid fa-webhook',
    label: 'event.menu.account.webhook',
  },
];
const IAMMenu = [
  { id: 'Users', iconClass: 'fa-solid fa-user', label: 'base.users.label' },
  { id: 'Groups', iconClass: 'fa-solid fa-users', label: 'org.tab.groups' },
  {
    id: 'Branches',
    iconClass: 'fa-solid fa-buildings',
    label: 'org.tab.branches',
  },
  {
    id: 'External',
    iconClass: 'fa-solid fa-code-branch',
    label: 'org.tab.external',
  },
];
const ProfileMenu = [
  {
    id: 'About',
    iconClass: 'fa-solid fa-file',
    label: 'event.menu.profile.about',
  },
  {
    id: 'SocialLinks',
    iconClass: 'fa-solid fa-square-share-nodes',
    label: 'event.menu.profile.socialLinks',
  },
];

const BusinessMenu = [
  {
    id: 'Payments',
    iconClass: 'fa-solid fa-credit-card !font-normal',
    label: 'event.menu.business.payment',
  },
];
const BusinessDeatailMenuItem = {
  id: 'BusinessDetail',
  iconClass: 'fa-brands fa-stripe !font-normal',
  label: 'event.menu.business.detail',
};

const MoreMenu = [
  {
    id: 'Delete',
    iconClass: 'fa-solid fa-user-xmark',
    label: 'event.menu.business.orgDelete',
  },
];

export default {
  AccountMenu,
  IAMMenu,
  BusinessMenu,
  BusinessDeatailMenuItem,
  MoreMenu,
  ProfileMenu,
};
