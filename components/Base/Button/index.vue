<template>
  <div
    class="relative flex cursor-pointer select-none items-center gap-2 rounded-[0.3125rem] leading-none transition-all active:scale-95"
    :class="[sizeClass, disabledClass, isThin ? 'font-normal' : 'font-medium']"
  >
    <i
      v-if="icon && !loading"
      class="fa-light"
      :class="[icon, sizeIconWidth]"
    />
    <i v-if="loading" class="fa-light fa-spinner animate-spin" />
    <slot name="prefix" />
    {{ label && label?.startsWith('$t:') ? $t(label.slice(3)) : label }}
    <slot />
    <slot name="suffix" />
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    icon: {
      type: [String, Array],
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'Primary',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    isThin: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    className() {
      switch (this.type) {
        case 'secondary':
          return 'bg-[#060606] !border-b-black hover:bg-white/5 text-[#B0B0B0] hover:text-[#D9D9D9]';
        case 'tertiary':
          return 'opacity-70 hover:bg-white/5 hover:opacity-100';
        case 'quaternary':
          return 'bg-[#737373]/30 hover:bg-[#292929] text-[#d4d4d4] opacity-80 hover:opacity-100';
        case 'outline':
          return 'group/btn bg-[#101010] border box-border border-white/30 transition-all hover:!border-white/0 hover:bg-[#1c1c1c]';
        case 'error':
          return 'bg-[#B91C1C] hover:bg-[#EB4937] text-[#0A0A0A]';
        case 'error-outline':
          return 'group/btn border box-border border-[#B91C1C]/70 transition-all text-[#B91C1C] hover:bg-white/5 hover:!border-[#B91C1C]/100';
        case 'red-cancel':
          return 'bg-[#A20F0F]/5 text-[#94231b] hover:bg-[#a20f0f26]';
        case 'primary':
        default:
          return 'bg-[#F0CA41] text-[#101010] hover:bg-[#B59523]';
      }
    },
    sizeClass() {
      switch (this.size) {
        case 'small':
          return 'h-6 px-1.5 text-xs';
        case 'large':
          return 'h-8 px-2.5 text-base';
        default:
          return 'h-[1.875rem] px-2 text-sm max-sm:px-1.5 max-sm:text-xs';
      }
    },
    sizeIconWidth() {
      // fix different type icon size may cause the shrink problem
      switch (this.size) {
        case 'large':
          return 'w-4';
        case 'small':
          return 'w-3';
        default:
          return 'w-3.5';
      }
    },
    disabledClass() {
      const classNames = this.disabled
        ? 'bg-[#292929]/30 border-transparent hover:bg-[#292929]/30 text-[#303030] !cursor-not-allowed active:!scale-100'
        : this.loading
          ? `!cursor-not-allowed active:!scale-100  bg-opacity-70 ${this.className}`
          : this.className;

      // fix outline disabled shrink
      if (['outline', 'error-outline'].includes(this.type)) {
        return `${classNames} border`;
      }

      return classNames;
    },
  },
};
</script>
