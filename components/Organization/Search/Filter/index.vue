<template>
  <div
    class="fixed top-16 z-50 flex h-[calc(100vh-5rem)] w-[26em] flex-col overflow-hidden rounded bg-black font-light transition-all duration-300"
    :class="open ? 'right-2 opacity-100' : '-right-[26em] opacity-0'"
  >
    <div
      class="mb-4 flex h-12 shrink-0 items-center gap-1 rounded-t bg-white/5 px-2 text-sm"
    >
      <BaseIconClose
        class="shrink-0"
        data-cy="8c8835f33fa190b3"
        @click="onClose"
      />
      {{ $t('org.filter') }}
    </div>
    <div
      v-if="open"
      class="hide-scrollbar h-0 flex-1 overflow-y-auto overscroll-contain"
    >
      <OrganizationSearchFilterInfo :query="query" />
      <OrganizationSearchFilterDetail :query="query" />
    </div>
    <div class="flex h-12 items-center justify-between bg-white/5 px-4 text-sm">
      <div
        class="cursor-pointer rounded px-2 py-1 hover:bg-white/10"
        data-cy="18a9b26efdb7b27a"
        @click="onClose"
      >
        {{ $t('base.upload.cancel') }}
      </div>
      <div
        class="cursor-pointer rounded bg-[#E0B92C] px-2 py-1 text-black transition-all active:scale-95"
        data-cy="42af4d7bd485b092"
        @click="onApply"
      >
        {{ $t('base.upload.apply') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const searchStore = useSearchStore();
    return { searchStore };
  },
  data() {
    return {
      query: {
        country: '',
        state: '',
        city: '',
        totalEmployees: '',
        industryId: '',
        numberOfMembers: '',
        numberOfPosts: '',
      },
    };
  },
  computed: {
    filter() {
      return {
        title: this.searchStore.query.title || undefined,
        country: this.query.country || undefined,
        state: this.query.state || undefined,
        city: this.query.city || undefined,
        totalEmployees: this.query.totalEmployees || undefined,
        industryId: this.query.industryId || undefined,
        numberOfMembers: this.query.numberOfMembers || undefined,
        numberOfPosts: this.query.numberOfPosts || undefined,
      };
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onApply() {
      this.$router.push({ query: this.filter });
    },
    init() {
      const { query } = useRoute();
      this.query = {
        country: query.country || '',
        state: query.state || '',
        city: query.city || '',
        totalEmployees: query.totalEmployees || '',
        industryId: query.industryId || '',
        numberOfMembers: query.numberOfMembers || '',
        numberOfPosts: query.numberOfPosts || '',
      };
    },
  },
};
</script>
