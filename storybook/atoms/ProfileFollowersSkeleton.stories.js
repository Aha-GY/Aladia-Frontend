import ProfileFollowersSkeleton from '~/components/Profile/Followers/Skeleton.vue';

const meta = {
  title: 'Atoms/ProfileFollowersSkeleton',
  component: ProfileFollowersSkeleton,
  tags: ['autodocs'],
  argTypes: {
    search: {
      control: { type: 'boolean' },
      description:
        'Toggle between the search and default skeleton loading views.',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Default = {
  args: {
    search: false,
  },
};

export const SearchLoading = {
  args: {
    search: true,
  },
};
