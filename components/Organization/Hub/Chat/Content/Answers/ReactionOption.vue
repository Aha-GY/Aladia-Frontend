<template>
  <div
    class="flex flex-col gap-1.5 rounded-md border border-white/10 bg-[rgba(0,0,0,0.6)] py-2 backdrop-blur-sm transition-all duration-300"
  >
    <div
      v-for="react in reactions"
      :key="react.reaction"
      class="flex h-3 items-center justify-center"
    >
      <img :src="react.url" class="max-w-3.5" alt="" />
      <div
        class="ml-3 cursor-pointer text-xs underline-offset-2 transition-all hover:underline"
      >
        {{ react.count }}
      </div>
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
          });
        }
      }
      return reactions.map((r) => {
        r.url = imgs[r.reaction];
        return r;
      });
    },
  },
};
</script>
