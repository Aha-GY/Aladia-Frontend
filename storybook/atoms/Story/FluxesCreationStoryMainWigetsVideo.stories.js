import FluxesCreationStoryMainWigetsVideo from '~/components/Fluxes/Creation/StoryMain/Wigets/Video.vue';

const meta = {
  title: 'Atoms/Story/FluxesCreationStoryMainWigetsVideo',
  component: FluxesCreationStoryMainWigetsVideo,
  tags: ['autodocs'],
  argTypes: {
    videoSource: {
      control: 'text',
      description: 'Source URL for the video.',
      defaultValue: 'https://www.w3schools.com/html/mov_bbb.mp4',
      table: {
        type: { summary: 'String' },
        defaultValue: { summary: '' },
      },
    },
    videoCover: {
      control: 'text',
      description: 'Source URL for the video cover image.',
      defaultValue: '',
      table: {
        type: { summary: 'String' },
        defaultValue: { summary: '' },
      },
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Default = {
  args: {
    videoSource: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoCover: 'https://i.ytimg.com/vi/aqz-KE-bpKQ/maxresdefault.jpg',
  },
};

export const WithoutVideoCover = {
  args: {
    videoSource: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoCover: '',
  },
};

export const CustomSlotContent = {
  render: (args) => ({
    setup() {
      return { args };
    },
    template: `
      <FluxesCreationStoryMainWigetsVideo v-bind="args">
        <div class="text-center text-white">
          <h1>Slot Content</h1>
          <p>This is rendered in the default slot.</p>
        </div>
      </FluxesCreationStoryMainWigetsVideo>
    `,
  }),
  args: {
    videoSource: '',
    videoCover: '',
  },
};
