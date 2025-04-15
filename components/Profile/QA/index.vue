<template>
  <div class="w-full">
    <ProfileReviewsHeader from-type="qa" @change="handleChangeFilter" />
    <div class="mt-10 flex w-full justify-between pb-[2rem]">
      <div class="mr-4 flex-1 overflow-hidden">
        <ProfileQAList
          v-if="filterObject.viewType === 'list'"
          :filter="filterObject"
          :owner-id="detail.id"
          :status-options="statusOptions"
        />
        <ProfileQAGrid
          v-if="filterObject.viewType === 'grid'"
          :filter="filterObject"
          :owner-id="detail.id"
        />
      </div>
      <div class="flex w-[20rem] flex-col items-center overflow-hidden">
        <div class="relative h-[14rem] w-[14rem]">
          <OrganizationHubQaWidgetGlobalChart
            :data="chartData"
            :color="chartColor"
            :highlight="highlight"
            @selectchanged="onChangeChart"
          />
          <BaseSvgCircle
            class="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 scale-[0.82]"
          />
          <div
            class="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center text-[#D9D9D9]"
          >
            <div class="text-2xl font-semibold">
              {{ moneyFormat(total, 0) }}
            </div>
            <div class="text-xs">
              {{ $t('qa.QA') }}
            </div>
          </div>
        </div>
        <div class="mt-2 w-full">
          <div
            v-for="(item, index) in chartData"
            :key="item.name"
            :class="`flex cursor-pointer items-center justify-between rounded-5 px-2 py-2 text-base hover:bg-white/10`"
            :style="{
              color: item.color,
            }"
            @click="handleChangeFilter({ status: item.key }, index)"
          >
            <div class="flex items-center">
              <BaseCheckbox :active="filterObject.status === item.key" />
              <span class="ml-2">{{ item.name }}</span>
            </div>
            <div>{{ item.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';

import {
  getQuestionsOverview,
  getQuestionsAnsweredByMeOverview,
} from '~/api/v2/analytics';
import { profileEvent } from '~/constant/eventBus';

const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
});

const { $eventBus } = useNuxtApp();

const { t } = useI18n();
const chartData = ref([]);
const highlight = ref(null);
const filterObject = ref({});
const chartColor = computed(() => {
  const list = chartData.value.map((item) => item.color) || [];
  return list;
});
const total = computed(() => chartData.value.reduce((a, b) => a + b.value, 0));

const statusOptions = computed(() => {
  const list = [
    {
      name: t('qa.status.options.NotAnswered'),
      key: 'not-answered',
      chartKey: 'notAnswered',
      value: 0,
      color: '#F23557',
    },
    {
      name: t('qa.status.options.Answered'),
      key: 'answered',
      value: 0,
      color: '#F0D43A',
    },
    {
      name: t('qa.status.options.AnsweredByTeacher'),
      key: 'answered-by-teacher',
      chartKey: 'answeredByTeacher',
      value: 0,
      color: '#22B2DA',
    },
    {
      name: t('qa.status.options.Solved'),
      key: 'solved',
      value: 0,
      color: '#2ECC71',
    },
  ];
  if (filterObject.value?.selectType === 'answered-by-me') {
    return list.filter(
      (item) =>
        item.key !== 'not-answered' && item.key !== 'answered-by-teacher',
    );
  }
  if (filterObject.value?.selectType === 'posted') {
    return list.filter((item) => item.key !== 'answered-by-teacher');
  }
  return list;
});

chartData.value = statusOptions.value;

const handleChangeFilter = (data, index) => {
  data.status = data.status === filterObject.value.status ? '' : data.status;
  highlight.value = data.status ? index : null;
  filterObject.value = {
    ...filterObject.value,
    ...data,
  };
};

const onChangeChart = (params) => {
  const { data, index } = params;
  handleChangeFilter({ status: data.key }, index);
};

const handleChartData = async () => {
  const API =
    filterObject.value.selectType === 'answered-by-me'
      ? getQuestionsAnsweredByMeOverview
      : getQuestionsOverview;

  const res = await API({
    [filterObject.value.selectType === 'posted' ? 'postOwner' : 'userId']:
      props.detail.id,
    entityType: filterObject.value.menuType === 'feed' ? 'category' : 'course',
    entityIds:
      filterObject.value.menuType === 'feed'
        ? filterObject.value.categorys?.map((item) => item.id)
        : filterObject.value.courses?.map((item) => item.id),
    startDate: filterObject.value.date?.startDate,
    endDate: filterObject.value.date?.endDate,
  });
  statusOptions.value.forEach((item) => {
    item.value = res[item.chartKey || item.key] || 0;
  });
  chartData.value = statusOptions.value;
};
onBeforeMount(() => {
  $eventBus.on(profileEvent.DELETE_PROFILE_QA_REVIEWS, initFetch);
});

onBeforeUnmount(() => {
  $eventBus.off(profileEvent.DELETE_PROFILE_QA_REVIEWS, initFetch);
});
const initFetch = () => {
  filterObject.value = {
    ...filterObject.value,
    i: new Date().getTime(),
  };
};

watch(
  () => filterObject.value,
  () => {
    handleChartData();
  },
  {},
);
</script>
