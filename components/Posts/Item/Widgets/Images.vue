<template>
  <div>
    <!-- single -->
    <div v-if="realImages.length === 1" class="my-2">
      <img
        :src="realImages[0].url"
        :alt="$t('post.image')"
        class="h-auto w-full cursor-pointer"
        data-cy="60aeb96b9e840a0b"
        @click="onImgClick(realImages[0].fileId)"
      />
    </div>

    <!-- Multiple -->
    <div v-else-if="realImages.length > 1" class="my-2 grid grid-cols-2 gap-4">
      <div
        v-for="(image, index) in realImages.slice(0, 4)"
        :key="index"
        class="relative"
      >
        <img
          :src="image.url"
          :alt="$t('post.image')"
          class="h-[18rem] w-full cursor-pointer rounded-lg object-cover"
          data-cy="d4b6d6bd03e70f09"
          @click="onImgClick(image.fileId)"
        />
        <!-- more -->
        <div
          v-if="index === 3 && realImages.length > 4"
          class="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black bg-opacity-50 text-2xl text-white"
          @click="onImgClick(realImages[3].fileId)"
        >
          +{{ realImages.length - 4 }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    realImages: Array,
  },
  methods: {
    onImgClick(id) {
      this.$emit('imageClick', id);
    },
  },
};
</script>
