/** @type { import('storybook-vue').StorybookConfig } */
const config = {
  stories: [
    '../storybook/**/*.mdx',
    '../storybook/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-designs',
    'msw-storybook-addon',
  ],
  framework: {
    name: '@storybook-vue/nuxt',
    options: {},
  },
  staticDirs: ['../public'],
  docs: {
    autodocs: 'tag',
  },
};
export default config;
