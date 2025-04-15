<template>
  <div class="flex items-center gap-2 text-white">
    <div v-if="useIcon" class="flex w-4 justify-center">
      <i v-if="type === 'on-demand'" class="fa-light fa-circle-play" />
      <div
        v-if="type === 'live'"
        class="relative h-1.5 w-1.5 rounded-full bg-red-600 group-hover/file:hidden"
      >
        <div
          class="absolute inset-0 scale-125 animate-ping rounded-full bg-red-600 opacity-75"
        />
      </div>
    </div>
    <div v-if="useName" class="text-nowrap">
      {{ type === 'live' ? $t('base.courses.type.onLive') : '' }}
      {{ type === 'on-demand' ? $t('base.courses.type.onDemand') : '' }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    useName: {
      type: Boolean,
      default: true,
    },
    useIcon: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
