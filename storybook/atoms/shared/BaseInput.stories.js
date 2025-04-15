import BaseInput from '~/components/Base/Input/index.vue';

const meta = {
  title: 'Atoms/Shared/BaseInput',
  component: BaseInput,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    title: { control: 'text' },
    showValidateError: { control: 'boolean' },
    inactive: { control: 'boolean' },
    fixed: { control: 'boolean' },
    open: { control: 'boolean' },
    currency: { control: 'boolean' },
    number: { control: 'boolean' },
    search: { control: 'boolean' },
    clear: { control: 'boolean' },
    maxLength: { control: 'number' },
    min: { control: 'number' },
    placeholder: { control: 'text' },
    required: { control: 'boolean' },
    prefixIconClass: { control: 'text' },
    titleIcon: { control: 'text' },
    disabled: { control: 'boolean' },
    type: { control: 'text' },
    size: { control: 'number' },
    upload: { control: 'number' },
    readonly: { control: 'boolean' },
    autoFocus: { control: 'boolean' },
    dataCy: { control: 'text' },
    defaultFocus: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Default = {
  args: {
    title: 'Default Input',
    placeholder: 'Enter your text...',
    modelValue: '',
  },
};

export const WithPrefixIcon = {
  args: {
    title: 'Input with Prefix Icon',
    prefixIconClass: 'fa-solid fa-user',
    placeholder: 'Username',
  },
};

export const Disabled = {
  args: {
    title: 'Disabled Input',
    placeholder: 'Disabled',
    disabled: true,
  },
};

export const RequiredField = {
  args: {
    title: 'Required Field',
    placeholder: 'Enter value...',
    required: true,
  },
};

export const SearchInput = {
  args: {
    title: 'Search Input',
    placeholder: 'Search...',
    search: true,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=18309-103147&t=plZEy8uLtq7ACkFs-0',
    },
  },
};

export const CurrencyField = {
  args: {
    title: 'Currency Input',
    placeholder: 'Amount',
    currency: true,
  },
};

export const WithError = {
  args: {
    title: 'Input with Error',
    placeholder: 'Invalid input...',
    showValidateError: true,
  },
};
