import ProfileFollowersItem from '~/components/Profile/Followers/Item.vue';
import { normalHandlers } from '~/utils/mocks/handlers';

const meta = {
  title: 'Molecules/ProfileFollowersItem',
  component: ProfileFollowersItem,
  tags: ['autodocs'],
  argTypes: {
    item: { control: 'object' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    isFollowerType: {
      control: { type: 'boolean' },
    },
    isFollowing: {
      control: { type: 'boolean' },
    },
    online: {
      control: { type: 'boolean' },
    },
    isMinePage: {
      control: { type: 'boolean' },
    },
    isSuggest: {
      control: { type: 'boolean' },
    },
    avatarSize: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
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
    item: {
      id: '1',
      name: 'John Doe',
      picture:
        'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
      online: false,
      isFollowing: false,
    },
    isSuggest: false,
    isFollowerType: false,
    isMinePage: false,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18309-103160&t=h5jTb4aNdLK6s9dV-0',
    },
  },
};

export const Following = {
  args: {
    item: {
      id: '2',
      name: 'Jane Smith',
      picture:
        'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
      online: true,
      isFollowing: true,
    },
    isSuggest: false,
    isFollowerType: true,
    isMinePage: false,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18529-104162&t=h5jTb4aNdLK6s9dV-0',
    },
  },
};

export const SuggestMode = {
  args: {
    item: {
      id: '3',
      name: 'Suggested User',
      picture:
        'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
      online: true,
      isFollowing: false,
    },
    isSuggest: true,
    isFollowerType: false,
    isMinePage: false,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages--Redesign?node-id=18308-103941&t=h5jTb4aNdLK6s9dV-0',
    },
  },
};

export const LoadingState = {
  args: {
    item: {
      id: '4',
      name: 'Loading User',
      picture:
        'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
      online: false,
      isFollowing: false,
    },
    isSuggest: false,
    isFollowerType: false,
    isMinePage: false,
    loading: true,
  },
};
