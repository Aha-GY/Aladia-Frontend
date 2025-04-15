import BaseReaction from '~/components/Base/Reaction/index.vue';

const meta = {
  title: 'Molecules/Shared/Reaction/BaseReaction',
  component: BaseReaction,
  tags: ['autodocs'],
  argTypes: {
    emojis: {
      control: 'array',
      description: 'List of emojis to display as reaction items.',
      defaultValue: ['Like', 'Lovely', 'Angry', 'Funny', 'Sad'],
    },
    hoverShowText: {
      control: 'boolean',
      description: 'Determines if hover text is displayed for reaction items.',
      defaultValue: false,
    },
    hoverTextStyle: {
      control: 'text',
      description: 'CSS classes for styling hover text.',
      defaultValue: '',
    },
    onChange: {
      action: 'onChange',
      description: 'Triggered when an emoji is clicked.',
    },
    onMouseenter: {
      action: 'onMouseenter',
      description: 'Triggered when an emoji is hovered.',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Default = {
  args: {
    emojis: ['Like', 'Lovely', 'Angry', 'Funny', 'Sad'],
    hoverShowText: false,
    hoverTextStyle: '',
  },
};

export const WithHoverText = {
  args: {
    emojis: ['Like', 'Lovely', 'Angry', 'Funny', 'Sad'],
    hoverShowText: true,
    hoverTextStyle: 'font-bold',
  },
};

export const CustomEmojiList = {
  args: {
    emojis: ['Clap', 'Love', 'Sad'],
    hoverShowText: true,
    hoverTextStyle: 'font-bold',
  },
};

export const NoHoverEffect = {
  args: {
    emojis: ['Angry', 'Funny', 'Sad'],
    hoverShowText: false,
    hoverTextStyle: '',
  },
};
