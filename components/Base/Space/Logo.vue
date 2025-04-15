<template>
  <div class="flex size-4 items-center justify-center text-xs">
    <i v-if="isShopping" class="fa-solid fa-book-open-reader" />
    <img
      v-else-if="url"
      :src="url"
      class="h-full w-full rounded bg-white/10 object-cover"
    />
    <i
      v-else-if="space.icon"
      :class="{
        [space.icon]: true,
        'fa-light': !expand,
        'fa-solid': expand,
      }"
      :style="{ color: space.color }"
    />
    <i
      v-else
      class="fa-hexagon"
      :class="expand ? 'fa-solid' : 'fa-light'"
      :style="{ color: space.color }"
    />
  </div>
</template>

<script>
export default {
  props: {
    space: Object,
    expand: Boolean,
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces };
  },
  computed: {
    isShopping() {
      return this.space?.mode === 'shopping';
    },
    url() {
      return this.space.image?.url;
    },
  },
};
</script>
