import FluxesCreationStoryMainWigetsImage from '~/components/Fluxes/Creation/StoryMain/Wigets/Image.vue';

const meta = {
  title: 'Atoms/Story/FluxesCreationStoryMainWigetsImage',
  component: FluxesCreationStoryMainWigetsImage,
  tags: ['autodocs'],
  argTypes: {
    imageSrc: {
      control: 'text',
      description: 'Source URL for the image.',
      defaultValue: '',
      table: {
        type: { summary: 'String' },
        defaultValue: { summary: '' },
      },
    },
    isPreviewActive: {
      control: 'boolean',
      description: 'Toggles preview mode.',
      defaultValue: false,
      table: {
        type: { summary: 'Boolean' },
        defaultValue: { summary: false },
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
    imageSrc:
      'https://i.natgeofe.com/n/e47430ee-e8c5-4c8d-8023-cae37dcde903/kakslauttanen-glass-igloos-590.jpg',
    isPreviewActive: false,
  },
};

export const PreviewActive = {
  args: {
    imageSrc:
      'https://hips.hearstapps.com/hmg-prod/images/great-ocean-road-174028267-1494616481.jpg?crop=0.888888888888889xw:1xh;center,top&resize=768:*',
    isPreviewActive: true,
  },
};

export const NoImageWithSlot = {
  render: (args) => ({
    setup() {
      return { args };
    },
    template: `
      <FluxesCreationStoryMainWigetsImage v-bind="args">
        <div class="text-center text-white">
          <h1>Slot Content</h1>
          <p>This is rendered in the default slot.</p>
        </div>
      </FluxesCreationStoryMainWigetsImage>
    `,
  }),
  args: {
    imageSrc: '',
    isPreviewActive: false,
  },
};
