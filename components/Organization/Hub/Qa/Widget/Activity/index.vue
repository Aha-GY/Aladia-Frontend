<template>
  <div class="relative w-1/4 rounded-md bg-black/50 p-4">
    <div class="mb-8 flex items-center justify-between">
      <div>
        {{ $t('filter.activity.mine') }}
      </div>
      <div class="flex items-center gap-5">
        <i
          v-if="hubQaStore.activityType !== 'general'"
          class="fa-light fa-rotate-left cursor-pointer"
          data-cy="6896cd24bbaa80c3"
          @click="hubQaStore.activityType = 'general'"
        />
        <i class="fa-light fa-ellipsis" />
      </div>
    </div>
    <OrganizationHubQaWidgetActivityGeneral
      v-if="hubQaStore.activityType === 'general'"
    />
    <OrganizationHubQaWidgetActivityQuestion
      v-if="hubQaStore.activityType === 'questions'"
    />
    <OrganizationHubQaWidgetActivityAnswer
      v-if="hubQaStore.activityType === 'answers'"
    />
    <div class="bg-gradient-top absolute bottom-0 h-[1px] w-full opacity-50" />
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
