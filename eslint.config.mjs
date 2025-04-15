import prettier from 'eslint-plugin-prettier';

import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt([
  {
    languageOptions: {
      globals: {
        google: 'readonly',
        AppleID: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      // Vue Setup 相关规则
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineProps', 'defineEmits'],
        },
      ],
      'vue/script-setup-uses-vars': 'error',

      // 强制组件选项的顺序
      'vue/order-in-components': [
        'error',
        {
          order: [
            'defineProps',
            'defineEmits',
            'defineExpose',
            'name',
            'components',
            'composables',
            'props',
            'emits',
            'setup',
            'data',
            'computed',
            'watch',
            'beforeCreate',
            'created',
            'beforeMount',
            'mounted',
            'beforeUpdate',
            'updated',
            'activated',
            'deactivated',
            'beforeUnmount',
            'unmounted',
            'methods',
          ],
        },
      ],

      // 导入语句排序
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      // Vue 模板相关规则
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/multiline-html-element-content-newline': 'error',
      'vue/attribute-hyphenation': ['error', 'always'],
      'vue/v-bind-style': ['error', 'shorthand'],
      'vue/v-on-style': ['error', 'shorthand'],
      'vue/valid-define-props': 'error',
      'vue/no-unused-components': 'error',
      'vue/no-unused-vars': 'error',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'off',
      'vue/no-template-shadow': 'off',
      'vue/no-mutating-props': 'off',
      'vue/no-multiple-template-root': 'off',
      'vue/no-v-html': 'off',
      'vue/no-async-in-computed-properties': 'error',
      'vue/no-side-effects-in-computed-properties': 'error',

      // JavaScript 最佳实践
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'object-shorthand': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-debugger': 'error',
      'no-unreachable': 'error',
      'no-constant-condition': 'error',
      'no-duplicate-imports': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      // 'no-console': ['warn', { allow: ['warn', 'error'] }],

      // 代码风格规则
      'spaced-comment': ['error', 'always'],
      curly: ['error', 'all'],
      'brace-style': ['error', '1tbs'],
      'comma-dangle': ['error', 'always-multiline'],
      'rest-spread-spacing': ['error', 'never'],

      // 关闭的规则
      'no-prototype-builtins': 'off',
      'no-async-promise-executor': 'off',

      // Prettier 配置
      'prettier/prettier': [
        'error',
        {
          htmlWhitespaceSensitivity: 'ignore',
          jsxBracketSameLine: true,
        },
      ],
    },
  },
  {
    ignores: [
      'public/**',
      'libs/**',
      'cypress/**',
      'storybook/**',
      'utils/mocks/**',
    ],
  },
]);
