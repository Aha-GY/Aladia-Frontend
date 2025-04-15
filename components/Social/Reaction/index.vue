<template>
  <div class="group relative flex flex-col transition-all duration-300">
    <div class="relative flex h-8 w-8 items-center justify-center">
      <span
        v-if="reactHover && capitalizeFirstLetter(name) !== 'Like'"
        class="absolute !-top-8 left-1/2 -translate-x-1/2 rounded-full bg-black px-2 py-0.5 text-sm text-white"
      >
        {{ curreName }}
      </span>
      <div
        v-if="name === 'like'"
        class="group relative flex cursor-pointer items-center justify-center rounded-5 px-2 py-1 transition-all active:scale-95 active:text-[#E0B92C]"
        @mouseenter="mouseEnter"
      >
        <span
          class="block text-center text-[#f1f1f1] opacity-100 group-hover:text-white"
        >
          <BaseButton
            type="tertiary"
            icon="fa-regular fa-heart text-shadow !w-auto"
            class="text-shadow flex items-center justify-center !text-white !opacity-100"
            :class="[type === 'stories' ? 'text-xl' : 'text-sm']"
          />
        </span>
      </div>
      <div
        v-else
        class="mb-[0.3rem] flex size-9 items-center justify-center rounded-5 px-1 hover:bg-white/5"
        @mouseenter="mouseEnter"
      >
        <img
          :src="reactHover ? getImgHover : getImg"
          class="size-6 cursor-pointer transition-all duration-300"
          :class="reactHover ? '' : ''"
        />
      </div>
    </div>

    <div class="text-shadow mt-1 text-center text-xs text-[#f1f1f1f1]">
      {{ numberFormat }}
    </div>
  </div>
</template>

<script>
import AngryGif from '~/assets/social/react/Angry.gif';
import Angry from '~/assets/social/react/Angry.svg';
import ClapGif from '~/assets/social/react/Clap.gif';
import Clap from '~/assets/social/react/Clap.svg';
import FunnyGif from '~/assets/social/react/Funny.gif';
import Funny from '~/assets/social/react/Funny.svg';
import Like from '~/assets/social/react/Like.svg';
import LovelyGif from '~/assets/social/react/Lovely.gif';
import Lovely from '~/assets/social/react/Lovely.svg';
import SadGif from '~/assets/social/react/Sad.gif';
import Sad from '~/assets/social/react/Sad.svg';

export default {
  props: {
    name: String,
    count: [String, Number],
    type: {
      type: String,
      default: 'stories',
    },
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
        like: Like,
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
        like: Like,
      };
      return imgs[this.name];
    },
    numberFormat() {
      const number = ~~this.count;
      if (number > 999) {
        return `${(number / 1000).toFixed(1)}k`;
      } else {
        return number;
      }
    },
    curreName() {
      const mapsName = {
        clap: 'Clap',
        love: 'Lovely',
        angry: 'Angry',
        funny: 'Funny',
        sad: 'Sad',
        like: 'Like',
      };

      return mapsName[this.name];
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
    },
  },
};
</script>
<style scoped>
.text-shadow {
  text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.5);
}
</style>
