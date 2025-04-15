const AccountMenu = [
  {
    id: 'ProfileInfo',
    iconClass: 'fa-solid fa-user',
    label: 'event.menu.account.profile',
  },
  {
    id: 'SignIn',
    iconClass: 'fa-solid fa-lock-keyhole',
    label: 'event.menu.account.signIn',
  },
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
  {
    id: 'RoadMap',
    iconClass: 'fa-regular fa-map',
    label: 'personal.profile.roadmap.feature',
    hideRightIcon: true,
    component: 'ProfileSettingDialogMenuRoadMap',
  },
];
const ProfileMenu = [
  {
    id: 'About',
    iconClass: 'fa-solid fa-file',
    label: 'event.menu.profile.about',
  },
  {
    id: 'Work',
    iconClass: 'fa-solid fa-briefcase',
    label: 'event.menu.profile.work',
  },
  {
    id: 'Education',
    iconClass: 'fa-solid fa-graduation-cap',
    label: 'event.menu.profile.education',
  },
  {
    id: 'Certificates',
    iconClass: 'fa-solid fa-file-certificate',
    label: 'event.menu.profile.certificates',
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
  {
    id: 'BecomeTeacher',
    iconClass: 'fa-brands fa-stripe',
    label: 'event.menu.business.teacher',
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
    label: 'event.menu.business.delete',
  },
];

const BECOME_TEACHER_LIST = [
  {
    title: 'event.becomeTeacher.visibility.title',
    text: 'event.becomeTeacher.visibility.text',
    icon: 'fa-light fa-globe',
  },
  {
    title: 'event.becomeTeacher.opportunity.title',
    text: 'event.becomeTeacher.opportunity.text',
    icon: 'fa-light fa-coins',
  },
  {
    title: 'event.becomeTeacher.flexibility.title',
    text: 'event.becomeTeacher.flexibility.title',
    icon: 'fa-light fa-clock',
  },
];

export default {
  AccountMenu,
  BusinessMenu,
  BusinessDeatailMenuItem,
  MoreMenu,
  ProfileMenu,
  BECOME_TEACHER_LIST,
};
