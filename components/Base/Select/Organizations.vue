<template>
  <div class="flex flex-col gap-1 rounded-md p-1 text-xs text-[#555555]">
    <div
      v-infinite-scroll="loadData"
      :infinite-scroll-disabled="loading || !next"
      :infinite-scroll-distance="20"
      class="flex max-h-[25rem] flex-col gap-1 overflow-y-auto"
    >
      <div
        v-for="item in sourceData"
        :key="item.id"
        class="group w-full cursor-pointer font-medium text-[#E5E5E5]"
        :data-cy="`${item.name.toLowerCase().split(' ').join('-')}-option`"
        @click="onClick(item)"
      >
        <div
          class="flex w-full items-center overflow-hidden rounded px-2 py-2 group-hover:bg-white/5"
          :class="active === item.name ? 'bg-white/5' : ''"
        >
          <img
            v-if="item.picture"
            :src="item.picture"
            class="h-6 w-6 rounded"
          />
          <div v-else class="flex h-6 w-6 items-center justify-center rounded">
            <i class="fa-solid fa-magnifying-glass" />
          </div>
          <div class="flex-1 overflow-hidden">
            <div class="ml-3 text-xs font-medium">
              <span>{{ item.name || item.domain }}</span>
            </div>
            <div class="ml-3 text-11 text-[#6a6a6a]">{{ item.domain }}</div>
          </div>
        </div>
      </div>
      <BaseSkeleton v-show="loading" height="1.5rem" class="w-full" />
    </div>
    <div v-if="!sourceData.length && !loading" class="w-full px-2 py-1">
      {{ $t('base.search.noResult') }}
    </div>
  </div>
</template>

<script>
import { getOrganizations } from '~/api/v2/org';

export default {
  props: {
    name: String,
    active: String,
  },
  data() {
    return {
      loading: false,
      sourceData: [],
      search: '',
      next: null,
      timer: null,
    };
  },
  watch: {
    name(val) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.search = val;
        this.init();
      }, 500);
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.next = null;
      this.sourceData = [];
      this.loadData();
    },
    async loadData() {
      this.loading = true;
      try {
        const {
          data,
          cursor: { next },
        } = await getOrganizations({
          limit: 20,
          next: this.next,
          name: this.search || undefined,
        });

        this.next = next;
        this.sourceData = [...this.sourceData, ...data];
      } finally {
        this.loading = false;
      }
    },
    onClick(item) {
      this.$emit('select', item);
    },
  },
};
</script>
