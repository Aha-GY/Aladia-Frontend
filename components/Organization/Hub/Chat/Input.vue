<template>
  <div
    class="relative flex w-full items-center gap-2 truncate px-1 py-2 transition-all duration-300"
  >
    <i
      class="fa-solid fa-magnifying-glass text-sm"
      :class="focus ? 'text-[#937a32]' : 'text-white/50'"
    />
    <div
      v-if="prefixs.length"
      class="ml-4 flex items-center gap-1 truncate text-sm text-white/70"
    >
      <div v-for="prefix in prefixs" :key="prefix" :class="prefix.class">
        {{ prefix.content }}
      </div>
    </div>
    <input
      ref="input"
      :value="modelValue"
      class="min-w-[6.25rem] flex-1 flex-shrink-0 bg-transparent text-sm leading-none outline-none placeholder:text-white/50"
      :placeholder="$t(placeholder)"
      data-cy="OrganizationHubChatInput-1"
      @input="onInput"
      @focus="focus = true"
      @blur="focus = false"
      @keydown.enter="$emit('search')"
      @keydown.backspace="$emit('delete')"
    />
    <i
      v-if="
        (modelValue || prefixs.length || awaysShowClose) &&
        showClose &&
        !loading
      "
      class="fa-light fa-sharp fa-circle-xmark cursor-pointer text-sm text-white/50"
      data-cy="OrganizationHubChatInput-2"
      @click="clear"
    />
    <i
      v-if="loading"
      class="fa-solid fa-spinner mr-1 animate-spin text-xs text-white/50"
    />
    <div
      class="absolute bottom-0 left-0 right-0 flex h-[1px] justify-center bg-white/10"
    >
      <div
        class="h-full bg-[#937a32] transition-all duration-300"
        :class="animation ? 'w-full' : 'w-0'"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
    },
    placeholder: {
      type: String,
      default: 'nav.header.search.label',
    },
    autoFocus: {
      type: Boolean,
      default: true,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    awaysShowClose: {
      type: Boolean,
      default: false,
    },
    prefixs: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      focus: false,
      animation: false,
    };
  },
  watch: {
    async focus(state) {
      this.$emit('focus', state);
      await this.$nextTick();
      this.animation = state;
    },
  },
  mounted() {
    if (this.autoFocus) {
      setTimeout(() => {
        this.$refs.input?.focus();
      }, 200);
    }
  },
  methods: {
    onInput(event) {
      this.$emit('update:modelValue', event.target.value);
    },
    onFocus() {
      this.$refs.input?.focus();
    },
    clear() {
      this.$emit('update:modelValue', '');
      this.$emit('clear');
    },
  },
};
</script>
