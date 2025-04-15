<template>
  <div class="relative">
    <div class="flex items-center justify-between group-hover/course:opacity-0">
      <div class="flex items-center gap-2">
        <img
          class="size-8 rounded-full object-cover"
          src="https://storage.googleapis.com/testing_uploads/elijah.jpeg"
        />
        <div>
          <div class="text-sm">Lincoln Botosh</div>
          <div class="text-xs text-[#707070]">
            {{ $t('nav.header.time.day', { days: 3 }) }}
          </div>
        </div>
      </div>
      <div class="relative">
        <BaseProgress
          :diameter="36"
          :stroke-width="3"
          :inner-stroke-width="3"
          :animate-speed="100"
          :completed-steps="45"
          :total-steps="100"
          start-color="#ddb754"
          stop-color="#ddb754"
          inner-stroke-color="#707070"
        />
        <div
          class="absolute bottom-0 left-0 right-0 top-0 flex scale-75 items-center justify-center text-xs"
        >
          45%
        </div>
      </div>
    </div>
    <div class="absolute inset-0 opacity-0 group-hover/course:opacity-100">
      <div class="mb-1 text-sm">
        <span class="text-[#ddb754]">
          {{ $t('org.courses.progress', { current: 17, total: 24 }) }}
        </span>
        {{ $t('base.courses.lectures') }}
      </div>
      <div class="relative h-2 w-full overflow-hidden rounded-2xl bg-[#707070]">
        <div class="h-full w-1/3 bg-[#ddb754]" />
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
