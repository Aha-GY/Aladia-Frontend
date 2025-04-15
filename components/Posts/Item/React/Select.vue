<template>
  <div class="fixed z-50 transition-all duration-300 ease-in">
    <img :src="getImgHover" class="object-over" alt="" />
  </div>
</template>
<script>
import AngryGif from '~/assets/social/react/Angry.gif';
import ClapGif from '~/assets/social/react/Clap.gif';
import FunnyGif from '~/assets/social/react/Funny.gif';
import LovelyGif from '~/assets/social/react/Lovely.gif';
import SadGif from '~/assets/social/react/Sad.gif';

export default {
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  data() {
    return {
      reaction: '',
    };
  },
  computed: {
    reactItem() {
      return this.socialStore.reactSelect;
    },
    getImgHover() {
      const imgs = {
        clap: ClapGif,
        love: LovelyGif,
        angry: AngryGif,
        funny: FunnyGif,
        sad: SadGif,
      };
      return imgs[this.reaction];
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.reaction = this.reactItem.name;
      this.$el.style.left = `${this.reactItem.target.left}px`;
      this.$el.style.top = `${this.reactItem.target.top}px`;
      this.$el.style.width = `${this.reactItem.target.width}px`;
      this.$el.style.height = `${this.reactItem.target.height}px`;
      await sleep(100);
      this.$el.style.left = `${this.reactItem.originTarget.left}px`;
      this.$el.style.top = `${this.reactItem.originTarget.top}px`;
      this.$el.style.width = `${this.reactItem.originTarget.width}px`;
      this.$el.style.height = `${this.reactItem.originTarget.height}px`;
      await sleep(500);
      this.socialStore.reactSelect = null;
    },
  },
};
</script>
