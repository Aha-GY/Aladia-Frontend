import PagesStories from '~/pages/stories/[user_id]/[story_id].vue';
import { normalHandlers } from '~/utils/mocks/handlers';

const meta = {
  title: 'Organisms/PagesStories',
  component: PagesStories,
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: normalHandlers,
    },
  },
};

export default meta;

export const Default = {
  ...meta,
};
