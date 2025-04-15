<template>
  <div
    class="absolute z-20 max-h-0 w-[4.8rem] translate-y-full overflow-hidden rounded bg-[rgba(0,0,0,0.6)] py-2 opacity-0 backdrop-blur-sm transition-all duration-300"
    :class="[
      type === 'story'
        ? '-bottom-4 right-3 border border-[#565656]/40'
        : '-bottom-8 right-0',
    ]"
  >
    <div
      v-for="react in reactions.reactions"
      :key="react.reaction"
      class="mb-1.5 flex h-3 items-center justify-center"
    >
      <img :src="react.url" class="max-w-3" alt="" />
      <div
        class="ml-3 cursor-pointer text-xs underline-offset-2 transition-all hover:underline"
      >
        {{ react.count }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
    reactions: Object,
    type: {
      type: String,
      default: 'story',
    },
  },
};
</script>
