<template>
  <div
    class="group/input relative flex h-[2.4rem] flex-1 flex-col items-center justify-end text-13"
  >
    <div class="flex h-6 w-full items-center gap-1">
      <slot />
      <div v-if="money" v-show="focus || value" class="font-thin text-white/50">
        ,00 USD
      </div>
    </div>
    <div
      class="pointer-events-none absolute bottom-0.5 left-0 z-10 flex items-center gap-2 transition-all"
      :class="{
        '-translate-y-6': value || focus,
        'text-[#b0a43e]': focus,
        'text-[#b0b0b0] group-hover/input:text-[#c0c0c0]': !focus,
      }"
    >
      <i v-if="disabled" class="fa-light fa-ban text-xs text-white/50" />
      {{ title }}
    </div>
    <div
      class="absolute bottom-0 left-0 right-0 flex h-[1px] justify-center bg-white/10 transition-all duration-300 group-hover/input:bg-white/30"
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
    value: [String, Number],
    focus: Boolean,
    money: Boolean,
    disabled: Boolean,
  },
};
</script>
