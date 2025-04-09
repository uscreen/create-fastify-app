import antfu from '@antfu/eslint-config'

export default antfu(
  {
    // lessOpinionated: true,
    formatters: true
  },
  {
    rules: {
      'style/comma-dangle': ['error', 'never'],
      'vue/block-order': 'off',
      'curly': ['error', 'multi-line'],
      'antfu/top-level-function': 'off',
      'no-console': 'off',
      'test/no-import-node-test': 'off'
      // 'no-use-before-define': 'off'
    }
  }
)
