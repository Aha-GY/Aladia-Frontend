import { setup } from '@storybook/vue3';
import { initialize, mswLoader } from 'msw-storybook-addon';

const mockUseDevice = () => ({
  isMobile: false,
});

setup((app) => {
  app.provide('useDevice', mockUseDevice);
});

initialize();

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#060606' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
  loaders: [mswLoader],
};

export default preview;
