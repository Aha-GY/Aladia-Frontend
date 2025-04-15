<template>
  <div
    class="group relative -ml-1.5 flex cursor-pointer items-center justify-center transition-all duration-300 active:scale-75"
  >
    <img
      :src="getImg"
      class="size-4 cursor-pointer transition-all duration-300"
      :class="reactHover ? 'h-12 w-12 -translate-y-7' : ''"
      alt=""
    />
  </div>
</template>

<script>
import Angry from '~/assets/social/react/Angry.svg';
import Clap from '~/assets/social/react/Clap.svg';
import Funny from '~/assets/social/react/Funny.svg';
import Lovely from '~/assets/social/react/Lovely.svg';
import Sad from '~/assets/social/react/Sad.svg';

export default {
  props: {
    name: String,
  },
  computed: {
    getImg() {
      const imgs = {
        clap: Clap,
        love: Lovely,
        angry: Angry,
        funny: Funny,
        sad: Sad,
      };
      return imgs[this.name];
    },
  },
};
</script>
