const path = require('path');

module.exports = {
  stories: [
    "../components/*.stories.mdx",
    "../components/**/*.stories.@(js|jsx|ts|tsx)",
    "../modules/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    {
      // PostCSS 8+ https://github.com/storybookjs/addon-postcss#postcss-8
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
  ],
  webpackFinal: async (config, { configType }) => {
    config.resolve.modules = [
      path.resolve(__dirname, ".."),
      "node_modules",
    ]

    return config;
  }
};
