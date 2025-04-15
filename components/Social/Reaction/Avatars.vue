<template>
  <BaseAvatarNext
    :picture="viewer?.picture"
    :user-id="viewer?.id"
    :show-online="false"
    :show-story="false"
    size="sm"
  >
    <template #button>
      <div
        v-if="props.name"
        class="relative flex cursor-pointer items-center justify-center transition-all duration-300 active:scale-75"
      >
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
        />
      </div>
      <div
        v-else
        class="flex size-full scale-75 items-center justify-center rounded-full bg-black"
      >
        <i class="fa-solid fa-eye text-[10px] text-white" />
      </div>
    </template>
  </BaseAvatarNext>
</template>

<script setup>
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

const props = defineProps({
  name: String,
  isImage: {
    type: Boolean,
    default: false,
  },
  imageType: {
    type: String,
    default: 'static',
  },
  viewer: {
    type: Object,
    default: () => ({}),
  },
});

const reactHover = false;
const getImg = computed(() => {
  const imgs = {
    Like: Clap,
    Clap,
    Lovely,
    Love: Lovely,
    Angry,
    Funny,
    Sad,
  };
  if (!props.name) {
    return 'view';
  }
  return imgs[capitalizeFirstLetter(props.name)];
});

const getImgGif = computed(() => {
  const imgs = {
    Like: ClapGif,
    Clap: ClapGif,
    Lovely: LovelyGif,
    Love: LovelyGif,
    Angry: AngryGif,
    Funny: FunnyGif,
    Sad: SadGif,
  };

  if (!props.name) {
    return 'view';
  }
  return imgs[capitalizeFirstLetter(props.name)];
});
const capitalizeFirstLetter = (str) => {
  if (!str) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};
</script>
