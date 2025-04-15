<template>
  <div
    class="hide-scrollbar mb-4 h-0 flex-1 overflow-y-auto rounded bg-white/10 p-4"
  >
    <OrganizationHubAnalyticsWidgetsCoursesMainItem v-for="n in 4" :key="n" />
  </div>
</template>
