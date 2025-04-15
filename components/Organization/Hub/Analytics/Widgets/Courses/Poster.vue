<template>
  <div class="relative mb-4 h-48 overflow-hidden rounded-md bg-black">
    <img
      class="absolute inset-0 h-full w-full object-cover"
      src="~/assets/images/requirements2.png"
    />
    <div class="absolute inset-0 group-hover/course:opacity-0">
      <div
        class="absolute left-0 right-0 top-0 flex items-center justify-between p-2"
      >
        <div
          class="flex size-5 items-center justify-center rounded-full bg-black/60 text-xs"
        >
          <i class="fa-solid fa-info" />
        </div>
        <div
          class="flex items-center gap-1 rounded bg-black/60 px-2 py-1 text-xs"
        >
          <img src="~/assets/blank.png" />
          {{ $t('org.courses.type.onDemand') }}
        </div>
      </div>
      <div
        class="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black/70 p-2 text-xs"
      >
        <div class="flex items-center gap-1">
          <i class="fa-light fa-calendars" />
          24 jun-28 nov 2024
        </div>
        <div>
          {{ $t('org.courses.lectures.label', { amount: 24 }) }}
        </div>
      </div>
    </div>
    <div
      class="absolute inset-0 flex flex-col justify-between rounded-md bg-black/80 px-2 py-4 text-13 opacity-0 group-hover/course:opacity-100"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-light fa-video" />
          {{ $t('org.courses.type.label') }}
        </div>
        <div>{{ $t('org.courses.type.onDemand') }}</div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-light fa-hourglass-end" />
          {{ $t('org.courses.time') }}
        </div>
        <div>12 Jan-12 Jun 2024</div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-light fa-file-lines" />
          {{ $t('org.courses.lectures.total') }}
        </div>
        <div>24</div>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-light fa-file-lines" />
          {{ $t('org.courses.lectures.remaining') }}
        </div>
        <div>5</div>
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
