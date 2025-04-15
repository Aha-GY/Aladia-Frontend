<template>
  <div class="flex items-center gap-2 bg-[#0C0C0C] p-4 text-xl text-[#FAFAFA]">
    <slot name="prefix" />
    <i v-if="icon" class="fa-regular" :class="icon" />
    <div class="ml-3 flex w-0 flex-1 items-center gap-1.5">
      {{ title }}
      <slot />
    </div>
    <BaseIconClose data-cy="ec11cd4bdf10a893" @click.stop="close" />
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    icon: String,
  },
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  methods: {
    close() {
      this.hmsStore.openPopup = '';
    },
  },
};
</script>
