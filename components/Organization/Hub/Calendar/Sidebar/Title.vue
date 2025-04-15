<template>
  <div
    class="group/org relative flex h-8 shrink-0 select-none items-center justify-between gap-1.5 px-3"
    data-cy="f5bc810920720a32"
    @click="$emit('onOpen', true)"
  >
    <div class="relative flex h-6 w-6 items-center justify-center">
      <div class="transition-all duration-300 group-hover/org:opacity-0">
        <slot />
      </div>

      <div
        class="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded opacity-0 transition-all hover:bg-white/5 active:scale-95 group-hover/org:opacity-100"
        data-cy="34f742ae5d6d4bcd"
        @click.stop="$emit('onOpen', !open)"
      >
        <i
          class="fa-solid fa-chevron-down text-sm transition-all duration-300"
          :class="open ? '' : '-rotate-90'"
        />
      </div>
    </div>
    <div class="relative flex h-6 w-0 flex-1 items-center">
      <div v-if="!focus && !searchValue" class="text-base text-[#707070]">
        {{ title }}
      </div>
      <input
        v-model="searchValue"
        type="text"
        class="absolute left-0 top-0 h-full w-full bg-transparent text-base text-white outline-none"
        data-cy="e193bedd30decf50"
        @focus="focus = true"
        @blur="focus = false"
      />
    </div>

    <div class="flex h-6 w-6 items-center justify-center">
      <i
        v-if="searchValue"
        class="fa-solid fa-circle-xmark shrink-0 cursor-pointer text-sm text-[#707070] transition-all active:scale-95"
        data-cy="ed6be8d9474f6c0d"
        @click="searchValue = ''"
      />
      <slot v-else name="after" />
    </div>

    <div
      class="absolute bottom-0 left-0 right-0 flex h-[1px] justify-center bg-white/10"
    >
      <div
        class="h-full bg-[#937a32] transition-all duration-300"
        :class="focus ? 'w-full' : 'w-0'"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    open: Boolean,
    isFilter: Boolean,
  },
  data() {
    return {
      focus: false,
      searchValue: '',
    };
  },
  watch: {
    searchValue() {
      this.$emit('onChange', this.searchValue);
    },
  },
};
</script>
