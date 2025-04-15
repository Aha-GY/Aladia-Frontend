<template>
  <div class="my-4 flex items-center gap-4">
    <BaseInput v-model="name" :title="$t('org.courses.search')" fixed search />
    <div
      class="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded text-sm hover:bg-white/10"
      data-cy="7bd7e8e71d2e0137"
      @click="onChange"
    >
      <i v-if="isList" class="fa-light fa-shuffle" />
      <i v-else class="fa-light fa-list-ul" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isList: Boolean,
  },
  setup() {
    const analyticsStore = useHubAnalyticsStore();
    return { analyticsStore };
  },
  data() {
    return {
      name: '',
    };
  },
  methods: {
    onChange() {
      this.$emit('change', !this.isList);
    },
  },
};
</script>
