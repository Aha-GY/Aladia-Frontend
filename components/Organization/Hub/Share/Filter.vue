<template>
  <div class="group/filter flex items-center gap-1 truncate pr-2">
    <div v-if="value" class="flex items-center gap-1 rounded text-white">
      <div class="truncate text-left">{{ value }}</div>
      <div
        class="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded transition-all hover:bg-white/10 active:scale-90"
        data-cy="0b50be32e2f62c5c"
        @click.stop="$emit('close')"
      >
        <i class="fa-solid fa-xmark text-sm text-red-600" />
      </div>
    </div>
    <div
      v-else
      class="flex items-center gap-1"
      :class="inside ? `text-10 font-medium text-[#707070]` : ``"
      data-cy="bdd7d1fe3a6e0e6a"
      @click="onPlaceholderClick"
    >
      <div class="truncate">{{ open ? placeholder : name }}</div>
    </div>
    <div
      class="flex h-4 w-4 cursor-pointer items-center justify-center rounded transition-all active:scale-90"
      :class="open ? 'bg-white/10' : 'hover:!bg-white/10'"
      data-cy="5875a76cf9b77988"
      @click="onIconClick"
    >
      <i class="fa-solid fa-filter" :class="inside ? 'text-[#707070]' : ''" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: false,
    },
    open: {
      type: Boolean,
      default: false,
    },
    tooltip: {
      type: String,
      default: '',
    },
    inside: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onPlaceholderClick() {
      if (this.open) {
        this.$emit('close');
      }
    },
    onIconClick() {
      if (this.open) {
        this.$emit('close');
      } else {
        this.$emit('open');
      }
    },
  },
};
</script>
