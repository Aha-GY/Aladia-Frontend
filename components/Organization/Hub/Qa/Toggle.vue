<template>
  <div
    class="absolute right-0 top-0 z-40 flex cursor-pointer items-center gap-2 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
    :class="hubQaStore.open ? 'rounded-bl rounded-tr' : 'rounded'"
    data-cy="37e237ccc7778595"
    @click="hubQaStore.open = !hubQaStore.open"
  >
    {{
      hubQaStore.open ? $t('filter.widget.closed') : $t('filter.widget.open')
    }}
    <i
      class="fa-light fa-chevron-up transition-all"
      :class="hubQaStore.open ? '' : 'rotate-180'"
    />
  </div>
</template>

<script>
export default {
  setup() {
    const hubQaStore = useHubQaStore();
    return { hubQaStore };
  },
};
</script>
