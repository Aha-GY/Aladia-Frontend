import SocialItemReact from '~/components/Social/Item/React.vue';
import { normalHandlers } from '~/utils/mocks/handlers';

const meta = {
  title: 'Atoms/Shared/Reaction/SocialItemReact',
  component: SocialItemReact,
  tags: ['autodocs'],
  argTypes: {
    item: { control: 'object' },
    name: { control: 'text' },
    number: { control: 'text' },
    id: { control: 'text' },
    unHover: { control: 'boolean' },
    unBackground: { control: 'boolean' },
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
    item: {},
    name: 'clap',
    number: 5,
    id: 'reaction-id-1',
    unHover: false,
    unBackground: false,
  },
};

export const WithoutReactionName = {
  args: {
    item: {},
    name: '',
    number: 10,
    id: 'reaction-id-2',
    unHover: false,
    unBackground: false,
  },
};

export const Unhovered = {
  args: {
    item: {},
    name: 'love',
    number: 3,
    id: 'reaction-id-3',
    unHover: true,
    unBackground: false,
  },
};

export const WithoutBackground = {
  args: {
    item: {},
    name: 'funny',
    number: 8,
    id: 'reaction-id-4',
    unHover: false,
    unBackground: true,
  },
};
