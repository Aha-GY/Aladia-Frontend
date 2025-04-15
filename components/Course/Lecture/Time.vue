<template>
  <div
    v-if="type === 'on-demand'"
    class="absolute bottom-0 right-0 z-10 flex origin-bottom-right scale-90 items-center rounded-br rounded-tl bg-white/20 px-1 py-0 text-xs font-bold shadow backdrop-blur"
  >
    {{
      active && player.currentTime
        ? secondToTime(player.currentTime)
        : secondToTime(lecture.duration || 0)
    }}
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    player: {
      type: Object,
      required: true,
    },
    lecture: {
      type: Object,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
