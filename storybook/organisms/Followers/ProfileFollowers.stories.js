import ProfileFollowers from '~/components/Profile/Followers/index.vue';
import { normalHandlers } from '~/utils/mocks/handlers';
import { mockDatabase } from '~/utils/mocks/mockDatabase';

const meta = {
  title: 'Organisms/ProfileFollowers',
  component: ProfileFollowers,
  argTypes: {
    followerType: {
      control: { type: 'radio' },
      options: ['followers', 'followings'],
    },
    label: { control: 'text' },
    detail: { control: 'object' },
  },
  parameters: {
    layout: 'centered',
    msw: {
      handlers: normalHandlers,
    },
  },
};

export default meta;

export const Default = {
  args: {
    label: 'followers',
    followerType: 'followers',
    detail: {
      followers: mockDatabase.followers,
      followings: mockDatabase.followings,
      numberOf: {
        followers: mockDatabase.followers.length,
        followings: mockDatabase.followers.length,
      },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=19286-103083&t=SHmnVn8M6wQwWBZa-0',
    },
  },
};

export const FollowersTab = {
  args: {
    label: 'followers',
    followerType: 'followers',
    detail: {
      followers: mockDatabase.followers,
      followings: [],
      numberOf: {
        followers: mockDatabase.followers.length,
        followings: 0,
      },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=19286-103083&t=SHmnVn8M6wQwWBZa-0',
    },
  },
};

export const FollowingTab = {
  args: {
    label: 'following',
    followerType: 'followings',
    detail: {
      followers: [],
      followings: mockDatabase.followings,
      numberOf: {
        followers: 0,
        followings: mockDatabase.followings.length,
      },
    },
  },
  parameters: {
    msw: {
      handlers: [
        normalHandlers.followings,
        normalHandlers.suggestions,
        normalHandlers.follow,
        normalHandlers.profile,
      ],
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=19286-103109&t=SHmnVn8M6wQwWBZa-0',
    },
  },
};
