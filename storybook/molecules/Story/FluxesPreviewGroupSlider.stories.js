import FluxesPreviewGroupSlider from '~/components/Fluxes/Preview/GroupSlider.vue';
import { normalHandlers } from '~/utils/mocks/handlers';
import { mockDatabase } from '~/utils/mocks/mockDatabase';

const meta = {
  title: 'Molecules/Story/FluxesPreviewGroupSlider',
  component: FluxesPreviewGroupSlider,
  tags: ['autodocs'],
  argTypes: {
    mainStory: { control: 'object' },
    initialSlide: { control: 'number' },
    isOnView: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: normalHandlers,
    },
  },
};

export default meta;

export const Default = {
  args: {
    mainStory: mockDatabase.mockStories[2],
    initialSlide: 0,
    isOnView: false,
    loading: false,
  },
};

export const Loading = {
  args: {
    ...Default.args,
    loading: true,
  },
};

export const NoStory = {
  args: {
    mainStory: { title: '', owner: { name: '' } },
    initialSlide: 0,
    isOnView: true,
    loading: false,
  },
};
