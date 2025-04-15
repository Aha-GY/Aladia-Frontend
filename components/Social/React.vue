<template>
  <div
    class="group relative -ml-1.5 flex h-12 w-12 cursor-pointer items-center justify-center transition-all duration-300 active:scale-75"
    @mouseenter="reactHover = true"
    @mouseleave="reactHover = false"
  >
    <img
      :src="reactHover ? getImgHover : getImg"
      class="h-10 w-10 cursor-pointer transition-all duration-300"
      :class="reactHover ? 'h-12 w-12 -translate-y-7' : ''"
      alt=""
    />
  </div>
</template>

<script>
import AngryGif from '~/assets/social/react/Angry.gif';
import Angry from '~/assets/social/react/Angry.svg';
import ClapGif from '~/assets/social/react/Clap.gif';
import Clap from '~/assets/social/react/Clap.svg';
import FunnyGif from '~/assets/social/react/Funny.gif';
import Funny from '~/assets/social/react/Funny.svg';
import LovelyGif from '~/assets/social/react/Lovely.gif';
import Lovely from '~/assets/social/react/Lovely.svg';
import SadGif from '~/assets/social/react/Sad.gif';
import Sad from '~/assets/social/react/Sad.svg';

export default {
  props: {
    name: String,
  },
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  data() {
    return {
      reactHover: false,
    };
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
    getImgHover() {
      const imgs = {
        clap: ClapGif,
        love: LovelyGif,
        angry: AngryGif,
        funny: FunnyGif,
        sad: SadGif,
      };
      return imgs[this.name];
    },
  },
};
</script>
