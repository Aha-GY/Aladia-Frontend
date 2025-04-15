import SocialReactionAvatars from '~/components/Social/Reaction/Avatars.vue';

const meta = {
  title: 'Atoms/Shared/Avatar/SocialReactionAvatars',
  component: SocialReactionAvatars,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'select' },
      options: ['Like', 'Clap', 'Lovely', 'Angry', 'Funny', 'Sad'],
    },
    isImage: {
      control: { type: 'boolean' },
    },
    imageType: {
      control: { type: 'select' },
      options: ['static', 'gif'],
    },
    viewer: {
      control: { type: 'object' },
    },
  },
};

export default meta;

export const Default = {
  args: {
    isImage: false,
    imageType: 'static',
    viewer: {
      id: 1,
      name: 'Jane Doe',
      picture:
        'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
    },
  },
};

export const LikeWithoutViewer = {
  args: {
    ...Default.args,
    name: 'Like',
    viewer: null,
  },
};

export const IsImageStatic = {
  args: {
    ...Default.args,
    name: 'Sad',
    isImage: true,
    imageType: 'static',
  },
};

export const IsImageGif = {
  args: {
    ...Default.args,
    name: 'Lovely',
    isImage: true,
    imageType: 'gif',
  },
};
