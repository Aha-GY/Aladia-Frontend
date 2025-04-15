<template>
  <div class="flex items-center gap-2 text-sm">
    <div class="flex items-center gap-1.5">
      <span class="text-white/70">
        {{ $t('org.search.results', { total: total }) }}
      </span>
      <span class="text-white">"{{ title }}"</span>
    </div>
    <div
      class="flex size-5 cursor-pointer items-center justify-center rounded hover:bg-white/10"
      @click="$emit('close')"
    >
      <i class="fa-regular fa-xmark" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    title() {
      const route = useRoute();
      return route.query.title;
    },
  },
};
</script>
