<template>
  <div
    class="relative mb-2 mt-1 flex w-full items-center gap-2 pb-2 pl-1.5 transition-all duration-300"
  >
    <i
      v-if="!(focus || modelValue)"
      class="fa-solid fa-magnifying-glass hidden text-white/50"
    />
    <input
      ref="input"
      :value="modelValue"
      class="flex-1 bg-transparent text-xs outline-none placeholder:text-white/50"
      :placeholder="placeholder"
      data-cy="0af4f7490353862b"
      @input="onInput"
      @focus="focus = true"
      @blur="focus = false"
      @keydown.enter="$emit('search')"
    />
    <i
      v-if="modelValue && showClose"
      class="fa-solid fa-xmark cursor-pointer text-base"
      data-cy="2c54aaddd2deb6e7"
      @click="() => $emit('update:modelValue', '')"
    />
    <div
      class="absolute bottom-0 left-0 right-0 flex h-[1px] justify-center"
      :class="defaultBorder ? 'bg-white/10' : ''"
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
      default: 'Search',
    },
    autoFocus: {
      type: Boolean,
      default: true,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    defaultBorder: {
      type: Boolean,
      default: true,
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
        this.$refs.input.focus();
      }, 200);
    }
  },
  methods: {
    onInput(event) {
      this.$emit('update:modelValue', event.target.value);
    },
  },
};
</script>
