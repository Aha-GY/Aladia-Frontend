<template>
  <div
    class="group/input relative flex w-full items-end"
    :class="{
      'pointer-events-none': inactive,
      'h-10': !fixed,
    }"
  >
    <div class="flex h-6 w-full items-center gap-1">
      <i
        v-if="search"
        class="fa-light fa-search ml-1 mr-2 cursor-pointer text-xs"
        :class="focus ? 'text-[#a2842a]' : 'text-white/50'"
      />
      <i
        v-else-if="prefixIconClass"
        class="ml-1 mr-2 cursor-pointer text-xs"
        :class="[focus ? 'text-[#a2842a]' : 'text-[#707070]', prefixIconClass]"
      />
      <slot name="prefix" />
      <input
        ref="input"
        :value="currentValue"
        :readonly="inactive || readonly"
        :disabled="disabled"
        :maxlength="maxLength"
        :placeholder="focus || !title ? placeholder : ''"
        :type="type"
        class="h-full w-0 flex-1 bg-transparent outline-none placeholder:text-[#505050]"
        :class="inactive ? 'text-white/50' : 'text-white'"
        :data-cy="`${dataCy}-text-field`"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
        @keydown.enter="$emit('enter')"
      />
      <div v-if="size && upload" class="text-xs text-white/50">
        {{ getFileSize(upload) }}
        /
        {{ getFileSize(size) }}
      </div>
      <i
        v-if="clear && hasValue"
        class="fa-regular fa-xmark ml-1 cursor-pointer text-xs text-white/50"
        data-cy="1dcd675f31d0cfaf"
        @click.stop="onClear"
      />
      <div v-if="currency" class="ml-1 font-light text-white/30">,00 USD</div>
      <div
        v-if="showLimit"
        class="text-xs"
        :class="
          currentValue?.length >= maxLength ? 'text-red-500' : 'text-gray-400'
        "
      >
        {{ currentValue?.length || 0 }}/{{ maxLength }}
      </div>
      <slot name="suffix" />
    </div>
    <div
      class="pointer-events-none absolute bottom-1 left-0 flex items-center gap-1.5 text-sm transition-all duration-300"
      :class="{
        'text-[#b0b0b0] group-hover/input:text-[#c0c0c0]': !focus,
        'text-[#A88300]': focus && !fixed,
        'text-[#b0b0b0]': focus && fixed,
        'opacity-0': hasValue && fixed,
        '!text-[#303030]': inactive,
        'bottom-6 !text-13': (focus || hasValue || open) && !fixed,
        'scale-90': (focus || hasValue) && fixed,
        'left-6': fixed && prefixIconClass,
      }"
    >
      <i
        v-if="titleIcon"
        class="mr-1 cursor-pointer text-xs"
        :class="[focus ? 'text-[#A88300]' : 'text-[#707070]', titleIcon]"
      />
      <span
        :class="{
          '!text-[#ED3C28]': showValidateError,
        }"
      >
        {{ title }}
      </span>
      <slot name="tooltip" />
      <span v-if="required" class="text-red-600">*</span>
    </div>
    <div
      v-if="showline"
      class="absolute bottom-0 left-0 right-0 flex h-[1px] transition-all duration-300 group-hover/input:bg-white/30"
      :class="{
        'bg-white/5': inactive,
        'bg-white/10': !inactive,
        'justify-center': !size,
        '!bg-[#ED3C28]': showValidateError,
      }"
    >
      <div
        v-if="size && upload && size !== upload"
        class="h-full bg-[#a2842a] transition-all duration-300"
        :style="{
          width: (upload / size) * 100 + '%',
        }"
      />
      <div
        v-else
        class="h-full bg-[#a2842a] transition-all duration-300"
        :class="focus || defaultFocus ? 'w-full' : 'w-0'"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    showValidateError: {
      type: Boolean,
      default: false,
    },
    inactive: {
      type: Boolean,
      default: false,
    },
    fixed: {
      type: Boolean,
      default: false,
    },
    open: {
      type: Boolean,
      default: false,
    },
    currency: {
      type: Boolean,
      default: false,
    },
    number: {
      type: Boolean,
      default: false,
    },
    search: {
      type: Boolean,
      default: false,
    },
    clear: {
      type: Boolean,
      default: false,
    },
    maxLength: {
      type: Number,
      default: 100,
    },
    min: {
      type: Number,
      default: 0,
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    prefixIconClass: {
      type: String,
      default: '',
    },
    titleIcon: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
    },
    size: {
      type: Number,
      default: 0,
    },
    upload: {
      type: Number,
      default: 0,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    autoFocus: {
      type: Boolean,
      default: false,
    },
    dataCy: {
      type: String,
      default: '',
    },
    defaultFocus: {
      type: Boolean,
      default: false,
    },
    showline: {
      type: Boolean,
      default: true,
    },
    showLimit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      focus: false,
      currentValue: this.modelValue,
      cursorPosition: null,
    };
  },
  computed: {
    hasValue() {
      return this.currentValue || this.currentValue === 0;
    },
  },
  watch: {
    modelValue(newVal) {
      this.currentValue = newVal;
    },
  },
  mounted() {
    if (this.autoFocus) {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.input?.focus();
        }, 100);
      });
    }
  },
  methods: {
    setSelectionRange(start, end) {
      this.$refs.input.focus();
      setTimeout(() => {
        this.$refs.input.setSelectionRange(start, end);
      }, 200);
    },
    setCursorPosition() {
      setTimeout(() => {
        this.cursorPosition = this.$refs.input?.selectionStart;
      }, 200);
    },
    onFocus() {
      this.focus = true;
      this.setCursorPosition();
      this.$emit('focus');
    },
    async onBlur() {
      await sleep(100);
      this.focus = false;
      this.$emit('blur');
    },
    onInput(event) {
      const inputValue = event.target.value || '';
      if (this.currency || this.number) {
        const value = inputValue.replace(/[^0-9]/g, '');
        if (value === '' || value === null || value === undefined) {
          event.target.value = '';
          this.currentValue = '';
          this.$emit('update:modelValue', '');
          return false;
        }
        if (+value < this.min) {
          return false;
        }
        this.currentValue = value;
        this.$emit('update:modelValue', this.currentValue);
      } else {
        this.currentValue = inputValue;
        this.$emit('update:modelValue', this.currentValue);
      }
      this.$emit('change', this.currentValue);
      this.setCursorPosition();
    },
    onClear() {
      this.currentValue = '';
      this.$emit('update:modelValue', '');
      this.$emit('clear');
    },
  },
};
</script>
<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  appearance: textfield;
}
</style>
