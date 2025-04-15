import BaseAvatarNextCheck from '~/components/Base/Avatar/Next/Check.vue';

const meta = {
  title: 'Atoms/Shared/Avatar/BaseAvatarNextCheck',
  component: BaseAvatarNextCheck,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    checked: { control: { type: 'boolean' } },
  },
};

export default meta;

export const Default = {
  args: {
    size: 'md',
    checked: false,
  },
};

export const Checked = {
  args: {
    size: 'md',
    checked: true,
  },
};
