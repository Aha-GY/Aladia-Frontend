import BaseAvatarNextOnline from '~/components/Base/Avatar/Next/Online.vue';

const meta = {
  title: 'Atoms/Shared/Avatar/BaseAvatarNextOnline',
  component: BaseAvatarNextOnline,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    online: { control: { type: 'boolean' } },
    userId: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Default = {
  args: {
    size: 'md',
    online: false,
    userId: '1',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18309-132225&node-type=instance&t=qiV7uu6kVsoPnLnP-0',
    },
  },
};

export const Online = {
  args: {
    size: 'md',
    online: true,
    userId: '1',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18269-103119&node-type=instance&t=qiV7uu6kVsoPnLnP-0',
    },
  },
};
