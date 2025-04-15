import ProfileFollowersType from '~/components/Profile/Followers/Type.vue';

const meta = {
  title: 'Atoms/ProfileFollowersType',
  component: ProfileFollowersType,
  argTypes: {
    modelValue: {
      control: { type: 'select' },
      options: ['', 'user', 'teacher', 'organization'],
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18399-102366&node-type=frame&t=qiV7uu6kVsoPnLnP-0',
    },
  },
};

export default meta;

export const All = {
  args: {
    modelValue: '',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18399-102366&node-type=frame&t=qiV7uu6kVsoPnLnP-0',
    },
  },
};

export const UserFilterSelected = {
  args: {
    modelValue: 'user',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18399-102382&node-type=frame&t=qiV7uu6kVsoPnLnP-0',
    },
  },
};

export const TeacherFilterSelected = {
  args: {
    modelValue: 'teacher',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18399-102397&node-type=frame&t=qiV7uu6kVsoPnLnP-0',
    },
  },
};

export const OrganizationFilterSelected = {
  args: {
    modelValue: 'organization',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18399-102412&node-type=frame&t=qiV7uu6kVsoPnLnP-0',
    },
  },
};
