<template>
  <div
    class="fixed top-16 z-50 flex h-[calc(100vh-5rem)] w-[26em] flex-col overflow-hidden rounded bg-black font-light transition-all duration-300"
    :class="open ? 'right-2 opacity-100' : '-right-[26em] opacity-0'"
  >
    <div
      class="mb-4 flex h-12 shrink-0 items-center justify-between rounded-t bg-white/5 px-2 text-sm"
    >
      <div class="flex items-center gap-1">
        <BaseIconClose
          class="shrink-0"
          data-cy="b693c750b47af875"
          @click="onClose"
        />
        {{ $t('base.courses.filters') }}
      </div>
      <div
        class="cursor-pointer rounded bg-[#E0B92C] px-1.5 py-0.5 text-black transition-all active:scale-95"
        data-cy="c53c440ea3a497a1"
        @click="onClear"
      >
        {{ $t('base.courses.filter.clean') }}
      </div>
    </div>
    <div
      v-if="open"
      class="hide-scrollbar h-0 flex-1 overflow-y-auto overscroll-contain px-4"
    >
      <MarketSearchFilterType ref="type" :query="query" />
      <MarketSearchFilterDuration v-if="query.type !== 'live'" :query="query" />
      <MarketSearchFilterTime
        v-if="query.type !== 'on-demand'"
        :query="query"
      />
      <MarketSearchFilterSkills :query="query" />
      <MarketSearchFilterLanguage :query="query" />
    </div>
    <div class="flex h-12 items-center justify-between bg-white/5 px-4 text-sm">
      <div
        class="cursor-pointer rounded px-2 py-1 hover:bg-white/10"
        data-cy="0744767baf5ad9a3"
        @click="onClose"
      >
        {{ $t('base.upload.cancel') }}
      </div>
      <div
        class="cursor-pointer rounded bg-[#E0B92C] px-2 py-1 text-black transition-all active:scale-95"
        data-cy="c53c440ea3a497a1"
        @click="onApply"
      >
        {{ $t('base.upload.apply') }}
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const searchStore = useSearchStore();
    const marketStore = useMarketStore();
    return { searchStore, marketStore };
  },
  data() {
    return {
      query: {
        type: '',
        minCost: 0,
        maxCost: 1000,
        minDuration: 1,
        maxDuration: 100,
        startDate: null,
        endDate: null,
        languageIds: [],
        skills: [],
      },
    };
  },
  computed: {
    filter() {
      const minCost = Math.floor(this.query.minCost) ?? undefined;
      const maxCost = Math.floor(this.query.maxCost) ?? undefined;
      const minDuration = Math.floor(this.query.minDuration) ?? undefined;
      const maxDuration = Math.floor(this.query.maxDuration) ?? undefined;

      const { startDate, endDate } = this.getDates(
        this.query.startDate,
        this.query.endDate,
      );

      const result = {
        type: this.query.type || undefined,
        languageIds: this.query.languageIds.join(',') || undefined,
        skills: this.query.skills.join(',') || undefined,
        startDate:
          startDate && this.query.type !== 'on-demand' ? startDate : undefined,
        endDate:
          endDate && this.query.type !== 'on-demand' ? endDate : undefined,
      };

      if (typeof minCost === 'number' && minCost !== 0) {
        result.minCost = minCost;
      }

      if (typeof maxCost === 'number' && maxCost !== 1000) {
        result.maxCost = maxCost;
      }

      if (this.query.type !== 'live') {
        if (typeof minDuration === 'number' && minDuration !== 1) {
          result.minDuration = minDuration;
        }

        if (typeof maxDuration === 'number' && maxDuration !== 100) {
          result.maxDuration = maxDuration;
        }
      }

      return result;
    },
  },
  mounted() {
    this.init();
    this.getPriceRange();
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onApply() {
      this.$emit('apply', this.filter);
    },
    onClear() {
      this.query = {
        type: '',
        minCost: 0,
        maxCost: 1000,
        minDuration: 1,
        maxDuration: 100,
        startDate: null,
        endDate: null,
        languageIds: [],
        skills: [],
      };
      this.$refs.type.reset();
      this.onApply();
    },
    getPriceRange() {
      this.searchStore.getPriceRange({
        type: this.$route.query.type || undefined,
        categoryId: this.$route.query.categoryId || undefined,
        subCategoryId: this.$route.query.subCategoryId || undefined,
      });
    },
    init() {
      const { query } = useRoute();

      this.query = {
        type: query.type || '',
        minCost: query.minCost || 0,
        maxCost: query.maxCost || 1000,
        minDuration: query.minDuration || 1,
        maxDuration: query.maxDuration || 100,
        languageIds: query.languageIds ? query.languageIds.split(',') : [],
        skills: query.skills ? query.skills.split(',') : [],
        ...this.setDates(query.startDate, query.endDate),
      };
    },
    setDates(startDate, endDate) {
      if (!startDate || !endDate) {
        return {
          startDate: null,
          endDate: null,
        };
      }
      const currentTime = dayjs().format('HH:mm');
      const startDay = startDate.split('T')[0];
      const endDay = endDate.split('T')[0];
      return {
        startDate: dayjs(`${startDay} ${currentTime}`).toDate(),
        endDate: dayjs(`${endDay} ${currentTime}`).toDate(),
      };
    },
    getDates(startDate, endDate) {
      if (!startDate || !endDate) {
        return {
          startDate: null,
          endDate: null,
        };
      }
      const start = dayjs(startDate).format('YYYY-MM-DD');
      const end = dayjs(endDate).format('YYYY-MM-DD');
      return {
        startDate: `${start}T00:00:00.000Z`,
        endDate: `${end}T23:59:59.999Z`,
      };
    },
  },
};
</script>
