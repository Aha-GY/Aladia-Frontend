<template>
  <div
    class="relative aspect-video shrink-0 overflow-hidden rounded bg-black/50"
  >
    <img
      v-if="url"
      ref="thumbnail"
      :src="url"
      draggable="false"
      loading="lazy"
      class="h-full w-full select-none object-cover"
    />
    <div v-else class="flex h-full w-full items-center justify-center">
      <i class="fa-solid fa-image text-white/50" />
    </div>

    <slot />
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
    },
  },
};
</script>
