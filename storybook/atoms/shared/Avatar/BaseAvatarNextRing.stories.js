import BaseAvatarNextRing from '~/components/Base/Avatar/Next/Ring.vue';

const meta = {
  title: 'Atoms/Shared/Avatar/BaseAvatarNextRing',
  component: BaseAvatarNextRing,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    status: {
      control: { type: 'select' },
      options: ['no-story', 'active', 'viewed'],
    },
    hole: { control: { type: 'boolean' } },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Default = {
  args: {
    size: 'md',
    status: 'no-story',
    hole: false,
  },
};

export const ActiveStory = {
  args: {
    size: 'md',
    status: 'active',
    hole: false,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18308-103980&node-type=instance&t=qiV7uu6kVsoPnLnP-0',
    },
  },
};

export const ViewedStory = {
  args: {
    size: 'md',
    status: 'viewed',
    hole: false,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18419-102274&node-type=instance&t=qiV7uu6kVsoPnLnP-0',
    },
  },
};

export const ActiveStoryWithHole = {
  args: {
    size: 'md',
    status: 'active',
    hole: true,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18269-103111&node-type=frame&t=qiV7uu6kVsoPnLnP-0',
    },
  },
};
