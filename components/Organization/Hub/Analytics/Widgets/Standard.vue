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

import OrganizationHubAnalyticsWidgetsCourses from '~/components/Organization/Hub/Analytics/Widgets/Courses';
import OrganizationHubAnalyticsWidgetsIncoming from '~/components/Organization/Hub/Analytics/Widgets/Incoming';
import OrganizationHubAnalyticsWidgetsPayment from '~/components/Organization/Hub/Analytics/Widgets/Payment';
import OrganizationHubAnalyticsWidgetsQa from '~/components/Organization/Hub/Analytics/Widgets/Qa';
import OrganizationHubAnalyticsWidgetsReviews from '~/components/Organization/Hub/Analytics/Widgets/Reviews';
import OrganizationHubAnalyticsWidgetsSpace from '~/components/Organization/Hub/Analytics/Widgets/Space/Standard';
import OrganizationHubAnalyticsWidgetsUser from '~/components/Organization/Hub/Analytics/Widgets/User';

const analyticsStore = useHubAnalyticsStore();

const general = shallowRef([
  {
    x: 0,
    y: 0,
    w: 4,
    h: 8,
    i: 'users-activity',
    component: OrganizationHubAnalyticsWidgetsUser,
  },
  {
    x: 0,
    y: 9,
    w: 4,
    h: 7,
    i: 'space-maintenance',
    component: OrganizationHubAnalyticsWidgetsSpace,
  },
  {
    x: 4,
    y: 0,
    w: 4,
    h: 5,
    i: 'payment-chart',
    component: OrganizationHubAnalyticsWidgetsPayment,
  },
  {
    x: 4,
    y: 5,
    w: 4,
    h: 5,
    i: 'qa-report',
    component: OrganizationHubAnalyticsWidgetsQa,
  },
  {
    x: 4,
    y: 10,
    w: 4,
    h: 5,
    i: 'reviews-report',
    component: OrganizationHubAnalyticsWidgetsReviews,
  },
  {
    x: 8,
    y: 0,
    w: 4,
    h: 15,
    i: 'incoming-events',
    component: OrganizationHubAnalyticsWidgetsIncoming,
  },
]);

const monitoring = shallowRef([
  {
    x: 0,
    y: 0,
    w: 4,
    h: 10,
    i: 'users-activity',
    component: OrganizationHubAnalyticsWidgetsUser,
  },
  {
    x: 0,
    y: 9,
    w: 8,
    h: 8,
    i: 'space-maintenance',
    component: OrganizationHubAnalyticsWidgetsSpace,
  },
  {
    x: 4,
    y: 0,
    w: 4,
    h: 10,
    i: 'incoming-events',
    component: OrganizationHubAnalyticsWidgetsIncoming,
  },
  {
    x: 8,
    y: 0,
    w: 4,
    h: 18,
    i: 'courses-monitoring',
    component: OrganizationHubAnalyticsWidgetsCourses,
  },
  {
    x: 4,
    y: 0,
    w: 4,
    h: 6,
    i: 'payment-chart',
    component: OrganizationHubAnalyticsWidgetsPayment,
  },
  {
    x: 4,
    y: 5,
    w: 4,
    h: 6,
    i: 'qa-report',
    component: OrganizationHubAnalyticsWidgetsQa,
  },
  {
    x: 4,
    y: 10,
    w: 4,
    h: 6,
    i: 'reviews-report',
    component: OrganizationHubAnalyticsWidgetsReviews,
  },
]);

const items = shallowRef(
  {
    general: general.value,
    monitoring: monitoring.value,
    personalized: general.value,
  }[analyticsStore.dashboardType],
);

const layout = shallowRef([...items.value]);

function onMove() {
  analyticsStore.widgetDragging = true;
}

function onMoved() {
  analyticsStore.widgetDragging = false;
}

watch(
  () => analyticsStore.widgetActive,
  () => {
    layout.value = [...items.value].filter((item) =>
      analyticsStore.widgetActive.includes(item.i),
    );
  },
  { immediate: true, deep: true },
);

watch(
  () => analyticsStore.dashboardType,
  () => {
    items.value = {
      general: general.value,
      monitoring: monitoring.value,
      personalized: general.value,
    }[analyticsStore.dashboardType];
    layout.value = [...items.value].filter((item) =>
      analyticsStore.widgetActive.includes(item.i),
    );
  },
);
</script>
