<template>
  <div
    ref="box"
    class="relative flex flex-1 flex-col items-center justify-center"
  >
    <div class="relative transition-all" :style="parentStyle">
      <img
        v-if="currentImg?.mimetype.includes('image')"
        :src="currentImg.url"
        class="carousel-media-style object-contain"
        alt=""
      />
      <iframe
        v-else-if="currentImg?.mimetype.includes('loom')"
        :src="currentImg.url"
        class="carousel-loom-style h-full w-full rounded-md"
      />
      <video
        v-else
        controls
        :src="currentImg?.url"
        class="carousel-media-style object-contain"
      />
    </div>
    <div
      v-if="currentIndex > 0"
      class="absolute left-0 top-0 flex h-full w-[7.375rem] max-w-[8vh] items-center justify-center"
    >
      <div
        class="absolute left-1/2 top-1/2 z-[10] flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/20 text-[#101010] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all hover:bg-white/30"
        data-cy="450f481ecf7d7a13"
        @click="onLeft"
      >
        <i class="fa-light fa-chevron-left text-base" />
      </div>
      <img
        v-if="preImg?.mimetype.includes('image')"
        :src="preImg.url"
        class="h-[50vh] object-cover object-right"
        :style="{
          maxHeight: `${preImg?.height}px`,
        }"
      />
      <video
        v-else-if="preImg?.mimetype.includes('video')"
        :src="preImg.url"
        class="h-[50vh] object-cover object-right"
        :style="{
          maxHeight: `${preImg?.height}px`,
        }"
      />
    </div>
    <div
      v-if="currentIndex + 1 < dataList.length"
      class="absolute right-0 top-0 flex h-full w-[7.375rem] max-w-[8vh] items-center justify-center"
    >
      <div
        class="absolute left-1/2 top-1/2 z-[10] flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/20 text-[#101010] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all hover:bg-white/30"
        data-cy="450f481ecf7d7a13"
        @click="onRight"
      >
        <i class="fa-light fa-chevron-right text-base" />
      </div>
      <img
        v-if="nextImg?.mimetype.includes('image')"
        :src="nextImg.url"
        class="h-[50vh] object-cover object-left"
        :style="{
          maxHeight: `${nextImg?.height}px`,
        }"
      />
      <video
        v-else-if="nextImg?.mimetype.includes('video')"
        :src="nextImg.url"
        class="h-[50vh] object-cover object-left"
        :style="{
          maxHeight: `${nextImg?.height}px`,
        }"
      />
    </div>
    <!-- <div
      class="absolute left-8 top-1/2 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white/70 opacity-30"
      :class="
        currentIndex === 0
          ? ''
          : 'cursor-pointer transition-all hover:opacity-100'
      "
      data-cy="450f481ecf7d7a13"
      @click="onLeft"
    >
      <i class="fa-solid fa-chevron-left text-3xl" />
    </div> -->
    <!-- <div
      class="absolute right-8 top-1/2 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white/70 opacity-30"
      :class="
        currentIndex + 1 === dataList.length
          ? ''
          : 'cursor-pointer transition-all hover:opacity-100'
      "
      data-cy="0d6d64fbf5980331"
      @click="onRight"
    >
      <i class="fa-solid fa-chevron-right text-3xl" />
    </div> -->
  </div>
</template>
<script>
export default {
  props: {
    dataList: Array,
  },
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      parentStyle: {},
      allWidth: 0,
      currentIndex: null,
      currentImg: null,
      scale: 1,
      rotate: 0,
    };
  },
  computed: {
    preImg() {
      return this.dataList[this.currentIndex - 1];
    },
    nextImg() {
      return this.dataList[this.currentIndex + 1];
    },
  },
  watch: {
    'hubChatStore.previewId'() {
      this.onInit();
    },
  },
  mounted() {
    this.onInit();
  },
  methods: {
    onInit() {
      this.currentIndex = this.dataList.findIndex(
        (r) => r.id === this.hubChatStore.previewId,
      );
      this.scale = 1;
      this.rotate = 0;
      this.parentStyle = {
        transform: `scale(1) rotate(0deg)`,
      };
      if (this.currentIndex > -1) {
        this.currentImg = this.dataList[this.currentIndex];
      }
    },
    onLeft() {
      if (this.currentIndex === 0) {
        return;
      }
      this.currentIndex--;
      this.hubChatStore.previewId = this.dataList[this.currentIndex].id;
    },
    onRight() {
      if (this.currentIndex + 1 >= this.dataList.length) {
        return;
      }
      this.currentIndex++;
      this.hubChatStore.previewId = this.dataList[this.currentIndex].id;
    },
    operate(type) {
      switch (type) {
        case 'zoom-in':
          this.scale += 0.25;
          this.parentStyle = {
            transform: `scale(${this.scale}) rotate(${this.rotate}deg)`,
          };
          break;
        case 'zoom-out':
          if (this.scale <= 0.25) {
            return;
          }
          this.scale -= 0.25;
          this.parentStyle = {
            transform: `scale(${this.scale}) rotate(${this.rotate}deg)`,
          };
          break;
        case 'rotate-left':
          this.rotate -= 90;
          this.parentStyle = {
            transform: `rotate(${this.rotate}deg) scale(${this.scale})`,
          };
          break;
        case 'rotate-right':
          this.rotate += 90;
          this.parentStyle = {
            transform: `rotate(${this.rotate}deg) scale(${this.scale})`,
          };
          break;
      }
    },
  },
};
</script>
<style scoped>
.carousel-media-style {
  max-height: 75vh;
  max-width: 80vw;
  object-fit: contain;
}
.carousel-loom-style {
  height: 75vh;
  width: 80vw;
}
</style>
