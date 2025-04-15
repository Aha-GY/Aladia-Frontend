<template>
  <div
    class="flex cursor-pointer items-center rounded border border-[#565656]/40 bg-[rgba(0,0,0,0.6)] p-0.5 backdrop-blur-sm transition-all duration-300 active:scale-95"
    data-cy="e6f24971d16737ac"
    @click="socialStore.reactId = socialStore.postItem.id"
  >
    <div
      v-for="react in reactions.reactions"
      :key="react.reaction"
      class="-ml-1 flex h-3 w-3 items-center justify-center transition-all duration-300 first:!ml-0 group-hover/item:-ml-0.5"
    >
      <img :src="react.url" class="object-contain" alt="" />
    </div>

    <div class="ml-2 text-xs">{{ reactions.allCount }}</div>
  </div>
</template>
<script>
// import Heart from '~/assets/icons/heart.svg';

export default {
  props: {
    item: Object,
    reactions: Object,
  },
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  computed: {
    // reactions() {
    //   const imgs = {
    //     Like: Heart,
    //     Lovely: Lovely,
    //     Angry: Angry,
    //     Funny: Funny,
    //     Sad: Sad,
    //   };
    //   return this.item.reactions.map((r) => {
    //     r.url = imgs[r.reaction];
    //     return r;
    //   });
    // },
  },
};
</script>
