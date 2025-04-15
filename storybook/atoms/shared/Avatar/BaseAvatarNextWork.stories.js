import BaseAvatarNextWork from '~/components/Base/Avatar/Next/Work.vue';

const meta = {
  title: 'Atoms/Shared/Avatar/BaseAvatarNextWork',
  component: BaseAvatarNextWork,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    work: {
      control: { type: 'select' },
      options: ['open-to-work', 'hiring'],
    },
    width: {
      control: { type: 'number' },
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Default = {
  args: {
    size: 'md',
    work: 'open-to-work',
    width: 40,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18269-103126&node-type=instance&t=qiV7uu6kVsoPnLnP-0',
    },
  },
};

export const HiringMedium = {
  args: {
    size: 'md',
    work: 'hiring',
    width: 40,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18352-105022&node-type=instance&t=qiV7uu6kVsoPnLnP-0',
    },
  },
};
