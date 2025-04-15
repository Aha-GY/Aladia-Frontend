<template>
  <div class="absolute inset-0 z-10 flex items-center justify-center text-lg">
    <div
      class="flex items-center justify-center rounded-full bg-white/20 backdrop-blur transition-all duration-500"
      :class="active ? 'h-6 w-6 opacity-100' : 'h-full w-full opacity-0'"
    >
      <i
        v-if="loading"
        class="fa-solid fa-spinner animate-spin text-xs text-violet-600"
      />
      <i
        v-else
        class="fa-solid text-violet-600"
        :class="playing ? 'fa-circle-pause' : 'fa-circle-play'"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    playing: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
