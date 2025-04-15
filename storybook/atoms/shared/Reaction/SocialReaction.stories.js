import SocialReaction from '~/components/Social/Reaction/index.vue';

export default {
  title: 'Atoms/Shared/Reaction/SocialReaction',
  component: SocialReaction,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: {
        type: 'select',
        options: ['clap', 'love', 'angry', 'funny', 'sad', 'like'],
      },
    },
    count: {
      control: { type: 'number' },
    },
    type: {
      control: { type: 'select', options: ['stories', 'other'] },
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export const Default = {
  args: {
    name: 'like',
    count: 123,
    type: 'stories',
  },
};

export const ClapHoverReaction = {
  args: {
    name: 'clap',
    count: 456,
    type: 'stories',
  },
};

export const LoveReaction = {
  args: {
    name: 'love',
    count: 789,
    type: 'stories',
  },
};

export const AngryReaction = {
  args: {
    name: 'angry',
    count: 101,
    type: 'stories',
  },
};

export const FunnyReaction = {
  args: {
    name: 'funny',
    count: 202,
    type: 'stories',
  },
};

export const SadReaction = {
  args: {
    name: 'sad',
    count: 303,
    type: 'stories',
  },
};
