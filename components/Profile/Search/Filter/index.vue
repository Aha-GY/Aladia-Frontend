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
      {{ $t('base.filter.label') }}
    </div>
    <div
      v-if="open"
      class="hide-scrollbar h-0 flex-1 overflow-y-auto overscroll-contain"
    >
      <ProfileSearchFilterType :query="query" />
      <ProfileSearchFilterInfo :query="query" />
      <ProfileSearchFilterExperiences :query="query" />
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
        type: '', // user, teacher
        country: '',
        state: '',
        city: '',
        skill: '',
        jobRole: '',
        companyName: '',
        degree: '',
        'certificate-name': '',
      },
    };
  },
  computed: {
    filter() {
      return {
        title: this.searchStore.query.title || undefined,
        type: this.query.type || undefined,
        country: this.query.country || undefined,
        state: this.query.state || undefined,
        city: this.query.city || undefined,
        skill: this.query.skill || undefined,
        jobRole: this.query.jobRole || undefined,
        companyName: this.query.companyName || undefined,
        degree: this.query.degree || undefined,
        certificate: this.query.certificate || undefined,
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
        type: query.type || '',
        country: query.country || '',
        state: query.state || '',
        city: query.city || '',
        skill: query.skill || '',
        jobRole: query.jobRole || '',
        companyName: query.companyName || '',
        degree: query.degree || '',
        certificate: query.certificate || '',
      };
    },
  },
};
</script>
