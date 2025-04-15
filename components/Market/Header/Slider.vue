<template>
  <div
    :data-index="item.index"
    class="relative shrink-0 select-none rounded-md transition-all"
  >
    <div class="group relative h-full w-full">
      <div
        ref="slide"
        class="relative flex h-24 w-full shrink-0 origin-bottom cursor-pointer items-center justify-center rounded-md shadow transition-all"
        :class="{
          'scale-[1.1] border-2 border-white bg-white': active,
          'scale-105 border-2 border-white bg-white active:scale-100':
            hover && !active,
          'scale-100 border border-white/50 bg-transparent': !hover && !active,
        }"
        data-cy="b53591c0863870cd"
        @click="onClick"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
      >
        <img
          draggable="false"
          class="absolute inset-0 z-0 h-full w-full rounded bg-white object-cover"
          :src="item.image?.url"
        />
        <div
          v-if="active"
          class="absolute bottom-0 left-0 h-1 rounded-sm bg-purple-800 transition-all"
          :style="{ width: `${width}px` }"
        />
      </div>
      <div
        class="pointer-events-none absolute inset-0 z-10 flex h-full w-full items-center justify-center overflow-hidden rounded-md border-2 border-transparent transition-all duration-200"
        :class="active ? 'origin-bottom scale-[1.1]' : ''"
      >
        <div
          class="flex items-center justify-center whitespace-nowrap rounded bg-black/50 px-2 text-13 backdrop-blur-sm transition-all duration-200"
          :style="
            active && categoryId ? { width: '100%', height: '100%' } : nameSize
          "
        >
          <div ref="name" class="inline-block px-2 py-0.5">{{ item.name }}</div>
        </div>
      </div>
      <div
        v-show="active && categoryId && closeDelay"
        class="absolute -top-4 z-20 flex h-[1.1rem] w-[1.1rem] cursor-pointer items-center justify-center rounded-full bg-red-600 transition-all hover:rotate-180 hover:scale-125"
        :class="{
          'opacity-0': moving,
          'opacity-100': !moving,
          '-right-4': $device.isMobile,
          '-right-5': !$device.isMobile,
        }"
        data-cy="37a270e200fc0715"
        @click.stop="onCloseClick"
      >
        <i class="fa-solid fa-xmark" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    moving: Boolean,
  },
  setup() {
    const marketStore = useMarketStore();
    return { marketStore };
  },
  data() {
    return {
      width: 0,
      hover: false,
      timer: null,
      closeDelay: false,
      nameSize: null,
    };
  },
  computed: {
    active() {
      return this.item.index === this.marketStore.categoryActive;
    },
    isLast() {
      return this.item.index === this.marketStore.categories.length - 1;
    },
    categoryId() {
      return this.$route.query?.categoryId;
    },
    subCategoryId() {
      return this.$route.query?.subCategoryId;
    },
    selected() {
      return this.categoryId || this.subCategoryId;
    },
  },
  watch: {
    async active(state) {
      this.checkAnimation();
      if (state && this.categoryId) {
        await sleep(300);
        this.closeDelay = true;
      } else {
        this.closeDelay = false;
      }
    },
    async categoryId(state) {
      if (state && this.active) {
        await sleep(300);
        this.closeDelay = true;
      } else {
        this.closeDelay = false;
      }
    },
    selected(state) {
      if (state) {
        this.width = 0;
        clearTimeout(this.timer);
      } else {
        this.checkAnimation();
      }
    },
  },
  mounted() {
    this.checkAnimation();
    this.closeDelay = this.active && this.categoryId;
  },
  beforeUnmount() {
    clearTimeout(this.timer);
  },
  methods: {
    onClick() {
      this.getNameSize();
      this.marketStore.categoryActive = this.item.index;
      this.$router.push(`/marketplace?categoryId=${this.item.id}`);
    },
    onCloseClick() {
      this.$router.push(`/marketplace`);
      this.closeDelay = false;
    },
    checkAnimation() {
      this.getNameSize();
      if (this.active && this.$refs.slide && !this.selected) {
        this.startAnimation();
      } else {
        this.width = 0;
        clearTimeout(this.timer);
      }
    },
    startAnimation() {
      const { clientWidth } = this.$refs.slide;
      if (this.width >= clientWidth) {
        this.width = 0;
        clearTimeout(this.timer);
        if (this.isLast) {
          this.marketStore.categoryActive = 0;
        } else {
          const next = this.marketStore.categoryActive + 1;
          this.marketStore.categoryActive = next;
        }
      } else {
        this.width += clientWidth / 100;
        this.timer = setTimeout(() => this.startAnimation(), 100);
      }
    },
    getNameSize() {
      const $name = this.$refs.name;
      this.nameSize = {
        width: `${$name.clientWidth}px`,
        height: `${$name.clientHeight}px`,
      };
    },
  },
};
</script>
