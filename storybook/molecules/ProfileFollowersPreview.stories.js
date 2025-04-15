import ProfileFollowersPreview from '~/components/Profile/Followers/Preview.vue';
import { normalHandlers, emptyHandlers } from '~/utils/mocks/handlers';

const meta = {
  title: 'Molecules/ProfileFollowersPreview',
  component: ProfileFollowersPreview,
  argTypes: {
    followerType: {
      control: { type: 'select' },
      options: ['followers', 'following'],
    },
    detail: { control: { type: 'object' } },
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
    followerType: 'followers',
    default: {
      followers: normalHandlers.followers,
      followings: [],
      numberOf: { followers: 2, followings: 2 },
    },
  },
  parameters: {
    msw: {
      handlers: normalHandlers,
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18390-102938&t=h5jTb4aNdLK6s9dV-0',
    },
  },
};

export const FollowersWithoutSuggestions = {
  args: {
    followerType: 'followers',
    default: {
      followers: normalHandlers.followers,
      followings: [],
      numberOf: { followers: 2, followings: 2 },
    },
  },
  parameters: {
    msw: {
      handlers: [
        normalHandlers.followers,
        normalHandlers.follow,
        normalHandlers.profile,
        normalHandlers.deleteFollower,
        emptyHandlers.suggestions,
      ],
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18308-103685&t=h5jTb4aNdLK6s9dV-0',
    },
  },
};

export const SuggestionsWithoutFollowers = {
  args: {
    followerType: 'followers',
    default: {
      followers: normalHandlers.followers,
      followings: [],
      numberOf: { followers: 2, followings: 2 },
    },
  },
  parameters: {
    msw: {
      handlers: [
        emptyHandlers.followers,
        normalHandlers.suggestions,
        normalHandlers.follow,
        normalHandlers.profile,
      ],
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18491-103138&t=h5jTb4aNdLK6s9dV-0',
    },
  },
};

export const FollowingsWithSuggestions = {
  args: {
    followerType: 'following',
    default: {
      followers: [],
      followings: normalHandlers.followings,
      numberOf: { followers: 2, followings: 2 },
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
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18390-102974&t=h5jTb4aNdLK6s9dV-0',
    },
  },
};

export const FollowingsWithoutSuggestions = {
  args: {
    followerType: 'following',
    default: {
      followers: [],
      followings: normalHandlers.followings,
      numberOf: { followers: 2, followings: 2 },
    },
  },
  parameters: {
    msw: {
      handlers: [
        normalHandlers.followings,
        emptyHandlers.suggestions,
        normalHandlers.follow,
        normalHandlers.profile,
      ],
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18269-102609&t=h5jTb4aNdLK6s9dV-0',
    },
  },
};

export const SuggestionsWithoutFollowings = {
  args: {
    followerType: 'following',
    default: {
      followers: [],
      followings: normalHandlers.followings,
      numberOf: { followers: 2, followings: 2 },
    },
  },
  parameters: {
    msw: {
      handlers: [emptyHandlers.followings, normalHandlers.suggestions],
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18491-103138&t=h5jTb4aNdLK6s9dV-0',
    },
  },
};

export const EmptyState = {
  args: {
    followerType: 'followers',
  },
  parameters: {
    msw: {
      handlers: emptyHandlers,
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18494-103885&t=h5jTb4aNdLK6s9dV-0',
    },
  },
};
