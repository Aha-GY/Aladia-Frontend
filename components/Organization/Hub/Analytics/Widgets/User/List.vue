<template>
  <div class="hide-scrollbar flex-1 overflow-y-auto">
    <div
      v-for="n in 10"
      :key="n"
      class="flex items-center justify-between border-b border-white/20 py-1 text-13 font-light"
    >
      <div class="flex w-0 flex-1 items-center gap-2">
        <img
          class="size-7 rounded-full object-cover"
          src="https://storage.googleapis.com/testing_uploads/elijah.jpeg"
        />
        <div class="flex-1">
          {{
            $t('org.share', {
              name: 'John Watson',
              room: 'Arcode',
            })
          }}
        </div>
      </div>
      <div class="w-20 text-right text-white/50">
        {{ $t('nav.header.time.min', { min: 10 }) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const analyticsStore = useHubAnalyticsStore();
    return { analyticsStore };
  },
};
</script>
