import BaseAvatar from '~/components/Base/Avatar/index.vue';

const meta = {
  title: 'Atoms/Shared/Avatar/BaseAvatar',
  component: BaseAvatar,
  tags: ['autodocs'],
  argTypes: {
    picture: { control: 'text' },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    defaultIcon: { control: 'text' },
    isGroup: { control: { type: 'boolean' } },
    round: { control: { type: 'boolean' } },
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18308-104009&node-type=instance&t=VB4wtRfudmRzyaW9-0',
    },
  },
};

export default meta;

export const Default = {
  args: {
    picture: '',
    size: 'md',
    defaultIcon: 'fa-solid fa-user',
    isGroup: false,
    round: true,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18406-102427&node-type=instance&t=qiV7uu6kVsoPnLnP-0',
    },
  },
};

export const WithPicture = {
  args: {
    picture:
      'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
    size: 'md',
    defaultIcon: 'fa-solid fa-user',
    isGroup: false,
    round: true,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18308-104009&node-type=instance&t=qiV7uu6kVsoPnLnP-0',
    },
  },
};

export const GroupAvatar = {
  args: {
    picture: '',
    size: 'xl',
    defaultIcon: 'fa-solid fa-users',
    isGroup: true,
    round: true,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=19209-106426&t=j8guarDRaR6BiO7d-0',
    },
  },
};

export const SquareAvatar = {
  args: {
    picture:
      'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
    size: 'md',
    defaultIcon: 'fa-solid fa-user',
    isGroup: false,
    round: false,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18408-102260&t=j8guarDRaR6BiO7d-0',
    },
  },
};
