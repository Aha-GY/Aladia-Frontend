import BaseAvatarNext from '~/components/Base/Avatar/Next/index.vue';

const meta = {
  title: 'Molecules/Shared/BaseAvatarNext',
  component: BaseAvatarNext,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    story: {
      control: { type: 'object' },
    },
    showStory: {
      control: { type: 'boolean' },
    },
    storyLoading: {
      control: { type: 'boolean' },
    },
    showOnline: {
      control: { type: 'boolean' },
    },
    showCheck: {
      control: { type: 'boolean' },
    },
    showDropDown: {
      control: { type: 'boolean' },
    },
    work: {
      control: { type: 'text' },
    },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18269-103081&node-type=frame&t=VB4wtRfudmRzyaW9-0',
    },
  },
};

export default meta;

export const Default = {
  args: {
    picture:
      'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
    size: 'md',
    round: true,
    showStory: false,
    story: { status: 'no-story' },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18390-102930&t=plZEy8uLtq7ACkFs-0',
    },
  },
};

export const SmallSize = {
  args: {
    picture:
      'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
    size: 'sm',
  },
};

export const LargeSizeWithStory = {
  args: {
    picture:
      'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
    size: 'lg',
    story: { status: 'active' },
    showStory: true,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18345-102940&t=plZEy8uLtq7ACkFs-0',
    },
  },
};

export const LoadingState = {
  args: {
    picture:
      'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
    size: 'md',
    storyLoading: true,
  },
};

export const OnlineStatus = {
  args: {
    picture:
      'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
    size: 'lg',
    showOnline: true,
    online: true,
    showStory: false,
    story: {},
  },
};

export const WithDropdown = {
  args: {
    picture:
      'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
    size: 'md',
    showDropDown: true,
  },
};

export const CustomIcon = {
  args: {
    picture: '',
    defaultIcon: 'fa-solid fa-camera',
    size: 'lg',
  },
};

export const ViewedStory = {
  args: {
    picture:
      'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
    size: 'lg',
    story: {
      status: 'viewed',
    },
    showStory: true,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18345-102940&node-type=frame&t=J0TZ2uNDCEASDI8t-0',
    },
  },
};

export const StoryAndWork = {
  args: {
    picture:
      'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
    size: 'lg',
    showStory: true,
    story: { status: 'active' },
    showWork: true,
    work: 'Developer',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=19258-106470&t=plZEy8uLtq7ACkFs-0',
    },
  },
};

export const StoryAndWorkWithOnlineStatus = {
  args: {
    picture:
      'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
    size: 'lg',
    showStory: true,
    story: { status: 'active' },
    showWork: true,
    work: 'Developer',
    showOnline: true,
    online: true,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=19258-106469&t=JdYpUgnYNFjfxNnd-0',
    },
  },
};
