<template>
  <div
    class="relative flex cursor-pointer items-center justify-center transition-all duration-300 active:scale-75"
    :class="!isImage ? 'h-12 w-12' : ''"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
  >
    <span
      v-if="mouseHover && hoverShowText"
      class="absolute -top-6 left-1/2 -translate-x-1/2 text-sm text-white"
      :class="hoverTextStyle"
    >
      {{ firstUpperCase }}
    </span>
    <img
      :src="
        isImage
          ? imageType === 'static'
            ? getImg
            : getImgGif
          : reactHover
            ? getImgGif
            : getImg
      "
      class="cursor-pointer transition-all duration-300"
      :class="
        isImage
          ? `size-${size} object-contain`
          : reactHover
            ? 'h-10 w-10'
            : 'h-9 w-9'
      "
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
    isImage: {
      type: Boolean,
      default: false,
    },
    imageType: {
      type: String,
      default: 'static', // static,gif
    },
    size: {
      type: Number,
      default: 6,
    },
    hoverShowText: {
      type: Boolean,
      default: false,
    },
    hoverTextStyle: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      reactHover: false,
      mouseHover: false,
    };
  },
  computed: {
    getImg() {
      const imgs = {
        Like: Clap,
        Clap,
        Lovely,
        Love: Lovely,
        Angry,
        Funny,
        Sad,
      };
      return imgs[this.capitalizeFirstLetter(this.name)];
    },
    getImgGif() {
      const imgs = {
        Like: ClapGif,
        Clap: ClapGif,
        Lovely: LovelyGif,
        Love: LovelyGif,
        Angry: AngryGif,
        Funny: FunnyGif,
        Sad: SadGif,
      };
      return imgs[this.capitalizeFirstLetter(this.name)];
    },
    firstUpperCase() {
      return this.capitalizeFirstLetter(this.name);
    },
  },
  methods: {
    capitalizeFirstLetter(str) {
      if (!str) {
        return '';
      }
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    mouseEnter() {
      this.$emit('mouseenter');
      if (this.isImage) {
        return;
      }
      this.reactHover = true;
      this.mouseHover = true;
    },
    mouseLeave() {
      if (this.isImage) {
        return;
      }
      setTimeout(() => {
        this.reactHover = false;
      }, 1000);
      this.mouseHover = false;
    },
    flicker() {
      this.reactHover = true;
      setTimeout(() => {
        if (!this.mouseHover) {
          this.reactHover = false;
        }
      }, 3000);
    },
  },
};
</script>
