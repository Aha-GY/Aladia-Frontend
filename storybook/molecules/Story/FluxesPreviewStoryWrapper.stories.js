import FluxesPreviewStoryWrapper from '~/components/Fluxes/Preview/StoryWrapper.vue';
import { normalHandlers } from '~/utils/mocks/handlers';
import { mockDatabase } from '~/utils/mocks/mockDatabase';

const meta = {
  title: 'Molecules/Story/FluxesPreviewStoryWrapper',
  component: FluxesPreviewStoryWrapper,
  tags: ['autodocs'],
  args: {
    id: mockDatabase.mockStories[2].id,
    storyId: mockDatabase.mockStories[2]._stories[0].id,
    source: mockDatabase.mockStories[2].source,
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
    ...meta.args,
  },
};

export const Highlights = {
  args: {
    id: mockDatabase.mockStories[1].id,
    storyId: mockDatabase.mockStories[1]._stories[0].id,
    source: mockDatabase.mockStories[1].source,
  },
};
