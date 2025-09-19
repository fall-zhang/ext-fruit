import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
    // '../packages/**/*.stories.@(js|jsx|ts|tsx)',
    '../packages/trans-api/src/dictionaries.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions'
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {

    }
  },
  core: {
    builder: '@storybook/builder-vite'
  },
  docs: {
    autodocs: true
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript'
  },
  async viteFinal (config) {
    // console.log('🚀 ~ main.ts:34 ~ viteFinal ~ config:', config)
    // Merge custom configuration into the default config
    const { mergeConfig } = await import('vite')

    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: ['storybook-dark-mode']
      }
    })
  }
}
export default config
