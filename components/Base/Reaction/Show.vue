<template>
  <div class="flex cursor-pointer items-center rounded-md p-1">
    <div
      v-for="react in reactions"
      :key="react.reaction"
      class="-ml-1.5 flex h-3 w-3 items-center justify-center first:!ml-0"
    >
      <img :src="react.url" class="max-w-3.5 object-contain" alt="" />
    </div>
    <div v-if="allCount" class="ml-1.5 text-xs text-white/50">
      +{{ allCount }}
    </div>
  </div>
</template>
<script>
// import Heart from "~/assets/icons/heart.svg";
import Angry from '~/assets/social/react/Angry.svg';
import Clap from '~/assets/social/react/Clap.svg';
import Funny from '~/assets/social/react/Funny.svg';
import Lovely from '~/assets/social/react/Lovely.svg';
import Sad from '~/assets/social/react/Sad.svg';

export default {
  props: {
    item: Object,
  },
  computed: {
    reactions() {
      const imgs = {
        Like: Clap,
        Lovely,
        Angry,
        Funny,
        Sad,
      };
      if (!this.item.reactions) {
        return [];
      }
      const reactions = [];
      for (const key in this.item.reactions) {
        const count = this.item.reactions[key];
        if (count && count > 0) {
          reactions.push({
            reaction: key,
            count,
            url: imgs[key],
          });
        }
      }
      return reactions;
    },
    allCount() {
      return this.reactions.reduce((acc, cur) => acc + cur.count, 0);
    },
  },
};
</script>
