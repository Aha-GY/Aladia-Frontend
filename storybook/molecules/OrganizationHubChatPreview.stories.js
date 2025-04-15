import OrganizationHubChatPreview from '~/components/Organization/Hub/Chat/Preview/index.vue';

const meta = {
  title: 'Molecules/OrganizationHubChatPreview',
  component: OrganizationHubChatPreview,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    viewOnly: {
      control: 'boolean',
      description: 'Controls whether the chat preview is in view-only mode.',
      defaultValue: false,
    },
  },
};

export default meta;

export const Default = {
  args: {
    viewOnly: false,
  },
};

export const ViewOnlyMode = {
  args: {
    viewOnly: true,
  },
};
