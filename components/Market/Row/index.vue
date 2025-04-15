<template>
  <div class="group/row relative mb-8">
    <div class="mb-4 flex items-center justify-between px-8 text-xl">
      <MarketTitle :image="image" :icon="icon" :title="title" />
      <div
        v-if="pages > 1"
        class="hidden items-center gap-1 transition-all sm:flex"
      >
        <div
          v-for="n in pages"
          :key="n"
          class="h-1 w-6 cursor-pointer rounded transition-all"
          :class="page === n - 1 ? 'bg-white' : 'bg-white/20'"
          data-cy="eb2a9804367cda05"
          @click="page = n - 1"
        />
      </div>
    </div>
    <div
      ref="cards"
      class="hide-scrollbar flex overflow-x-auto overflow-y-hidden pl-6 pr-6 md:overflow-x-hidden"
    >
      <slot />
    </div>
    <div
      v-if="pages > 1"
      class="pointer-events-none absolute inset-0 z-50 -mb-4 hidden items-center transition-all sm:flex"
    >
      <div
        v-if="page !== 0"
        class="pointer-events-auto absolute left-5 top-1/2 -mt-4 flex h-12 w-7 cursor-pointer items-center justify-center"
        data-cy="f4d7c5d946f405f1"
        @click="onLeftClick"
      >
        <div
          class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
        />
        <i
          class="fa-light fa-chevron-left pointer-events-none relative z-10 text-base text-white"
        />
      </div>
      <div
        v-if="page !== pages - 1"
        class="pointer-events-auto absolute right-5 top-1/2 -mt-4 flex h-12 w-7 cursor-pointer items-center justify-center"
        data-cy="90448974e7dfe1ab"
        @click="onRightClick"
      >
        <div
          class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
        />
        <i
          class="fa-light fa-chevron-right pointer-events-none relative z-10 text-base text-white"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: '',
    },
    length: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
  },
  setup() {
    const cards = ref(null);
    const { width } = useElementSize(cards);
    const marketStore = useMarketStore();
    return { marketStore, cards, width };
  },
  data() {
    return {
      page: 0,
      size: 5,
      timer: null,
    };
  },
  computed: {
    pages() {
      return Math.ceil(this.length / this.size);
    },
  },
  watch: {
    page() {
      this.scrollTo();
    },
    width() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getSize();
      }, 500);
    },
  },
  mounted() {
    this.getSize();
  },
  methods: {
    getSize() {
      const $cards = this.$refs.cards;

      if (!$cards || !$cards.children.length) {
        return;
      }

      const $card = $cards.children[0];
      this.size = Math.floor(this.width / $card.clientWidth);

      if (
        this.type === 'popular' ||
        this.type === 'instructors' ||
        this.type === 'new'
      ) {
        this.size += 1;
      }
    },
    onLeftClick() {
      this.page = this.page === 0 ? this.pages - 1 : this.page - 1;
    },
    onRightClick() {
      this.page = this.page === this.pages - 1 ? 0 : this.page + 1;
    },
    scrollTo() {
      if (!this.$refs.cards) {
        return;
      }
      const index = this.page * this.size;
      const $card = this.$refs.cards.children[index];
      if (!$card) {
        return;
      }
      this.$refs.cards.scrollTo({
        left: $card.offsetLeft - 24,
        behavior: 'smooth',
      });
    },
  },
};
</script>
