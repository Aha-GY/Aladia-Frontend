import FluxesCreationStoryMainCard from '~/components/Fluxes/Creation/StoryMain/Card.vue';
import { normalHandlers } from '~/utils/mocks/handlers';
import { mockDatabase } from '~/utils/mocks/mockDatabase';

const meta = {
  title: 'Molecules/Story/FluxesCreationStoryMainCard',
  component: FluxesCreationStoryMainCard,
  tags: ['autodocs'],
  args: {
    item: mockDatabase.mockStories[2],
    isPreviewActive: true,
    loading: false,
    isOnView: false,
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

export const PreviewInActive = {
  args: {
    ...Default.args,
    isPreviewActive: false,
    item: {
      ...Default.args.item,
      title: 'Preview Story',
    },
  },
};

export const IsOnView = {
  args: {
    ...Default.args,
    isOnView: true,
  },
};

export const LoadingState = {
  args: {
    ...Default.args,
    loading: true,
  },
};

export const VideoStory = {
  args: {
    ...Default.args,
    item: mockDatabase.mockStories[1],
    hasPlatformVideo: true,
  },
};

export const OwnerView = {
  args: {
    ...Default.args,
    item: {
      ...Default.args.item,
      owner: {
        name: 'me',
        picture:
          'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
      },
    },
  },
};
