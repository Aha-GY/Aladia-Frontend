<template>
  <div
    class="group/progress relative flex size-[3.875rem] shrink-0 items-center justify-center rounded-full"
  >
    <BaseAvatarNext
      :picture="member?.picture"
      :user-id="member?.id"
      :story="member?.story"
      :source="'profile'"
      :size="'md'"
      :show-online="false"
      class="absolute inset-0 z-10"
    />
    <BaseProgress
      v-if="completion"
      :diameter="45"
      :stroke-width="3"
      :inner-stroke-width="2"
      :animate-speed="100"
      :completed-steps="completion"
      :total-steps="100"
      :start-color="completion === 100 ? '#4d854c' : '#9354e5'"
      :stop-color="completion === 100 ? '#4d854c' : '#9354e5'"
      inner-stroke-color="transparent"
      class="pointer-events-none absolute inset-0 z-20"
    />
    <div
      v-if="completion"
      class="absolute z-20 flex size-[3rem] items-center justify-center rounded-full bg-black/80 text-sm text-[#a66df2] opacity-0 group-hover/progress:opacity-100"
    >
      {{ completion }}%
    </div>
  </div>
</template>

<script>
export default {
  props: {
    member: {
      type: Object,
      default: () => ({}),
    },
    completion: {
      type: Number,
      default: 0,
    },
  },
};
</script>
