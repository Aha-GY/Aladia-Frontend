<template>
  <div
    class="group/item relative flex h-6 w-full cursor-pointer items-center gap-1 text-white/50 transition-all group-hover/item:text-white/70"
    data-cy="a53406d41032f732"
    @click="() => $emit('onChange')"
  >
    <div
      class="flex-1 text-sm font-semibold text-white/50 transition-all group-hover/item:text-white/70"
    >
      {{ title }}
    </div>

    <div
      class="flex h-6 w-6 items-center justify-center opacity-0 transition-all group-hover/item:opacity-100"
    >
      <i
        v-if="!active"
        class="fa-sharp fa-solid fa-arrow-up-right-and-arrow-down-left-from-center text-xs"
      />
      <i v-else class="fa-solid fa-down-left-and-up-right-to-center text-xs" />
    </div>
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    active: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      name: '',
    };
  },
};
</script>
