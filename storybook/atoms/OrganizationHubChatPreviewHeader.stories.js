import OrganizationHubChatPreviewHeader from '~/components/Organization/Hub/Chat/Preview/Header.vue';

const meta = {
  title: 'Atoms/OrganizationHubChatPreviewHeader',
  component: OrganizationHubChatPreviewHeader,
  tags: ['autodocs'],
  argTypes: {
    viewOnly: { control: 'boolean', description: 'Toggle skeleton display' },
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
