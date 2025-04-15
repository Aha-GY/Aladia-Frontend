<template>
  <div :class="isHover ? 'group/course' : ''">
    <div class="group/course mb-4 flex items-center justify-between">
      <div class="cursor-pointer text-lg">
        <i class="fa-regular fa-angle-left" />
      </div>
      <div class="flex-1 text-center text-sm">
        {{ $t('org.title') }}
      </div>
      <div class="cursor-pointer text-lg">
        <i class="fa-regular fa-angle-right" />
      </div>
    </div>
    <OrganizationHubAnalyticsWidgetsCoursesPoster
      @mouseenter="isHover = true"
      @mouseleave="isHover = false"
    />
    <OrganizationHubAnalyticsWidgetsCoursesTab />
    <div class="flex flex-col gap-4">
      <OrganizationHubAnalyticsWidgetsCoursesMenber v-for="n in 10" :key="n" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isHover: false,
    };
  },
};
</script>
