<template>
  <div class="mb-4 rounded bg-white/5 p-4">
    <div class="mb-4 text-center font-medium">
      {{ $t('course.type') }}
    </div>
    <div class="mb-10 flex items-center justify-center gap-12 text-sm">
      <div
        class="relative w-32 cursor-pointer rounded border-2 py-1 text-center text-13"
        :class="
          types.includes('live')
            ? 'border-[#bea134] text-[#bea134]'
            : 'border-transparent hover:text-[#bea134]'
        "
        data-cy="cf987f61c2a0b10f"
        @click="onChange('live')"
      >
        {{ $t('meet.live') }}
        <div
          v-if="types.includes('live')"
          class="absolute -bottom-1 -right-1 rounded-full bg-black p-0.5"
        >
          <BaseCheckboxStyle state="correctChecked" />
        </div>
      </div>
      <div
        class="relative w-32 cursor-pointer rounded border-2 py-1 text-center text-13"
        :class="
          types.includes('on-demand')
            ? 'border-[#bea134] text-[#bea134]'
            : 'border-transparent hover:text-[#bea134]'
        "
        data-cy="08a952ea4d3a673e"
        @click="onChange('on-demand')"
      >
        {{ $t('base.courses.type.onDemand') }}
        <div
          v-if="types.includes('on-demand')"
          class="absolute -bottom-1 -right-1 rounded-full bg-black p-0.5"
        >
          <BaseCheckboxStyle state="correctChecked" />
        </div>
      </div>
    </div>
    <MarketSearchFilterPrice
      v-if="priceHistogram.length"
      ref="price"
      :query="query"
    />
  </div>
</template>

<script>
export default {
  props: {
    query: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const searchStore = useSearchStore();
    const marketStore = useMarketStore();
    return { searchStore, marketStore };
  },
  data() {
    return {
      types: [],
    };
  },
  computed: {
    priceHistogram() {
      return this.searchStore.priceRange.priceHistogram;
    },
  },
  mounted() {
    this.types = this.query.type ? [this.query.type] : [];
  },
  methods: {
    reset() {
      this.types = [];
      this.$refs.price.reset();
    },
    async onChange(type) {
      if (this.types.includes(type)) {
        this.types = this.types.filter((t) => t !== type);
      } else {
        this.types.push(type);
      }
      await this.$nextTick();
      if (this.types.length === 0 || this.types.length === 2) {
        this.query.type = '';
      } else {
        this.query.type = this.types[0];
      }
    },
  },
};
</script>
