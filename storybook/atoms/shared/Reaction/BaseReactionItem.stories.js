import BaseReactionItem from '~/components/Base/Reaction/Item.vue';

const meta = {
  title: 'Atoms/Shared/Reaction/BaseReactionItem',
  component: BaseReactionItem,
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'The reaction name (e.g., Like, Clap, Angry, etc.).',
      defaultValue: 'Clap',
    },
    isImage: {
      control: 'boolean',
      description: 'Determines if the reaction is an image.',
      defaultValue: false,
    },
    imageType: {
      control: 'select',
      options: ['static', 'gif'],
      description: 'Specifies whether the image is static or a gif.',
      defaultValue: 'static',
    },
    size: {
      control: 'number',
      description: 'Defines the size of the reaction image.',
      defaultValue: 6,
    },
    hoverShowText: {
      control: 'boolean',
      description: 'Determines if hover text is displayed.',
      defaultValue: false,
    },
    hoverTextStyle: {
      control: 'text',
      description: 'CSS classes for styling hover text.',
      defaultValue: '',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Default = {
  args: {
    name: 'Clap',
    isImage: false,
    imageType: 'static',
    size: 6,
    hoverShowText: false,
    hoverTextStyle: '',
  },
};

export const WithHoverText = {
  args: {
    name: 'Lovely',
    isImage: false,
    imageType: 'gif',
    size: 8,
    hoverShowText: true,
    hoverTextStyle: 'font-bold',
  },
};

export const StaticEmoji = {
  args: {
    name: 'Angry',
    isImage: true,
    imageType: 'static',
    size: 10,
    hoverShowText: false,
    hoverTextStyle: '',
  },
};

export const GifEmoji = {
  args: {
    name: 'Funny',
    isImage: true,
    imageType: 'gif',
    size: 12,
    hoverShowText: true,
    hoverTextStyle: '',
  },
};
