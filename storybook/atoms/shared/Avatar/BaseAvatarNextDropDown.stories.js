import BaseAvatarNextDropDown from '~/components/Base/Avatar/Next/DropDown.vue';

const meta = {
  title: 'Atoms/Shared/Avatar/BaseAvatarNextDropDown',
  component: BaseAvatarNextDropDown,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
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
