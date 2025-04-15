<template>
  <GridLayout v-model:layout="layout" :row-height="30" class="min-h-screen">
    <GridItem
      v-for="item in layout"
      :key="item.i"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
      @resize="onMove"
      @resized="onMoved"
      @move="onMove"
      @moved="onMoved"
    >
      <component :is="item.component" :w="item.w" :h="item.h" />
    </GridItem>
  </GridLayout>
</template>

<script setup>
import { GridLayout, GridItem } from 'grid-layout-plus';

import OrganizationHubAnalyticsWidgetsCoursesFilter from '~/components/Organization/Hub/Analytics/Widgets/Courses/Filter';
import OrganizationHubAnalyticsWidgetsCoursesReport from '~/components/Organization/Hub/Analytics/Widgets/CoursesReport';
import OrganizationHubAnalyticsWidgetsIncoming from '~/components/Organization/Hub/Analytics/Widgets/Incoming';
import OrganizationHubAnalyticsWidgetsMonitoring from '~/components/Organization/Hub/Analytics/Widgets/Monitoring';
import OrganizationHubAnalyticsWidgetsUserFilter from '~/components/Organization/Hub/Analytics/Widgets/User/Filter';

const analyticsStore = useHubAnalyticsStore();

const items = shallowRef([
  {
    x: 0,
    y: 0,
    w: 5,
    h: 6,
    i: 'users-activity',
    component: OrganizationHubAnalyticsWidgetsUserFilter,
  },
  {
    x: 5,
    y: 0,
    w: 3,
    h: 6,
    i: 'courses-report',
    component: OrganizationHubAnalyticsWidgetsCoursesReport,
  },
  {
    x: 8,
    y: 0,
    w: 4,
    h: 18,
    i: 'courses-monitoring',
    component: OrganizationHubAnalyticsWidgetsCoursesFilter,
  },
  {
    x: 0,
    y: 6,
    w: 3,
    h: 12,
    i: 'incoming-events',
    component: OrganizationHubAnalyticsWidgetsIncoming,
  },
  {
    x: 3,
    y: 6,
    w: 5,
    h: 12,
    i: 'monitoring-activity',
    component: OrganizationHubAnalyticsWidgetsMonitoring,
  },
]);

const layout = shallowRef([...items.value]);

function onMove() {
  analyticsStore.widgetDragging = true;
}

function onMoved() {
  analyticsStore.widgetDragging = false;
}
</script>
