import BaseAvatarNextPicture from '~/components/Base/Avatar/Next/Picture.vue';

const meta = {
  title: 'Atoms/Shared/Avatar/BaseAvatarNextPicture',
  component: BaseAvatarNextPicture,
  tags: ['autodocs'],
  argTypes: {
    picture: { control: 'text' },
    defaultIcon: { control: 'text' },
    border: { control: { type: 'boolean' } },
    width: { control: 'text' },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    hole: { control: { type: 'boolean' } },
    round: { control: { type: 'boolean' } },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Default = {
  args: {
    picture: '',
    defaultIcon: 'fa-solid fa-user',
    border: false,
    width: '5px',
    size: 'md',
    hole: false,
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
    defaultIcon: 'fa-solid fa-user',
    border: false,
    width: '5px',
    size: 'md',
    hole: false,
    round: true,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18308-104009&node-type=instance&t=qiV7uu6kVsoPnLnP-0',
    },
  },
};
