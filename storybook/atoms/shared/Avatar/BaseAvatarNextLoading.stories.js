import BaseAvatarNextLoading from '~/components/Base/Avatar/Next/Loading.vue';

const meta = {
  title: 'Atoms/Shared/Avatar/BaseAvatarNextLoading',
  component: BaseAvatarNextLoading,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
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
  },
};

export const Small = {
  args: {
    size: 'sm',
  },
};

export const Large = {
  args: {
    size: 'lg',
  },
};

export const ExtraLarge = {
  args: {
    size: 'xl',
  },
};
