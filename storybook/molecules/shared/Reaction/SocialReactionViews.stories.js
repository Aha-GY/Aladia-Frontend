import SocialReactionViews from '~/components/Social/Reaction/Views.vue';
import { normalHandlers, emptyHandlers } from '~/utils/mocks/handlers';
import { mockDatabase } from '~/utils/mocks/mockDatabase';

const meta = {
  title: 'Molecules/Shared/Reaction/SocialReactionViews',
  component: SocialReactionViews,
  argTypes: {
    item: mockDatabase.mockStories[1],
    open: {
      control: 'boolean',
      description: 'Controls whether the reaction component is open.',
      defaultValue: true,
    },
    'user-click': {
      action: 'user-click',
      description: 'Event emitted when a user is clicked.',
    },
    close: {
      action: 'close',
      description: 'Event emitted when the component is closed.',
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
    item: mockDatabase.mockStories[1],
    open: true,
  },
};

export const WithoutReactions = {
  args: {
    item: mockDatabase.mockStories[2],
    open: true,
  },
  parameters: {
    msw: [emptyHandlers.socialView],
  },
};
