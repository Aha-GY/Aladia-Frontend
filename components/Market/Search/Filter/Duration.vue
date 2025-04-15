<template>
  <div class="mb-4 rounded bg-white/5 p-4">
    <div class="text-center font-medium">
      {{ $t('course.duration.name') }}
    </div>
    <MarketSearchFilterRange :range="range" @change="onChange" />
    <div class="flex justify-between gap-16 text-sm">
      <div class="flex w-60 items-end gap-1">
        <span class="mb-0.5 text-white/50">
          {{ $t('course.duration.min') }}
        </span>
        <BaseInput v-model="query.minDuration" fixed number>
          <template #suffix>
            <span class="text-white/50">
              {{ $t('course.duration.hour') }}
            </span>
          </template>
        </BaseInput>
      </div>
      <div class="flex w-60 items-end gap-1">
        <span class="mb-0.5 text-white/50">
          {{ $t('course.duration.max') }}
        </span>
        <BaseInput v-model="query.maxDuration" fixed number>
          <template #suffix>
            <span class="text-white/50">
              {{ $t('course.duration.hours') }}
            </span>
          </template>
        </BaseInput>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    query: {
      type: Object,
      required: true,
    },
  },
  computed: {
    range() {
      return [this.query.minDuration, this.query.maxDuration];
    },
  },
  methods: {
    onChange(range) {
      this.query.minDuration = range[0];
      this.query.maxDuration = range[1];
    },
  },
};
</script>
