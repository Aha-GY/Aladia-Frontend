<template>
  <BaseButton
    :label="$t('reviews.filters')"
    type="outline"
    icon="fa-filter-list"
    @click="isShow = true"
  />
  <Teleport to="body">
    <div
      class="fixed right-0 top-4 z-[70] flex h-[calc(100vh-2rem)] w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-5 border border-white/10 bg-[#020202] font-light transition-all duration-300 md:w-[28em]"
      :class="{
        'right-0': isShow,
        'right-[-100vw]': !isShow,
      }"
    >
      <!-- header -->
      <div class="grid grid-cols-9 items-center bg-[#0C0C0C] p-2">
        <BaseIconClose class="ml-2" @click="handleCloseDrawer" />
        <div class="col-span-5 flex items-center gap-2">
          <i class="fa-regular fa-filter text-sm" />
          <span class="text-base">
            {{ $t('reviews.filters') }}
          </span>
        </div>
        <div class="col-span-3 flex justify-end">
          <BaseButton
            :label="$t('reviews.cancelFilters')"
            size="small"
            :disabled="!hasFilter"
            @click="handleClearFilters"
          />
        </div>
      </div>
      <!-- body -->
      <div class="mt-2 flex-1 bg-[#0C0C0C] p-2 text-sm">
        <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
          icon-class="fa-regular fa-rectangle-history"
        >
          <BaseCategorySelect
            v-if="fromType === 'qa' && menuType === 'feed'"
            :filter-params="categorys"
            @change="handleChangeCategorys"
          />
          <BaseCourseSelect
            v-else
            :filter-params="courses"
            @change="handleChangeCourses"
          />
        </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>
        <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
          icon-class="fa-light fa-calendar"
          :sub-title="$t('base.occur.date')"
        >
          <OrganizationHubPaymentHistoryDrawerFilterCompsRangeDatePicker
            :filter-params="date"
            :filter-key-start="FILTER_KEYS.START_DATE"
            :filter-key-end="FILTER_KEYS.END_DATE"
            @change="handleDateChange"
          />
        </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>
        <template v-if="fromType === 'reviews'">
          <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
            icon-class="fa-regular fa-grid"
            :sub-title="$t('category.transaction.purpose')"
          >
            <ProfileReviewsFilterType
              :filter-params="courseType"
              @change="handleTypeChange"
            />
          </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem>
          <!-- <OrganizationHubPaymentHistoryDrawerFilterCompsRowItem
            icon-class="fa-regular fa-radar"
            :sub-title="$t('category.transaction.status')"
          >
            <ProfileReviewsFilterStatus
              :filter-params="status"
              @change="handleStatusChange"
            />
          </OrganizationHubPaymentHistoryDrawerFilterCompsRowItem> -->
        </template>
      </div>
      <!-- footer -->
      <div class="mt-2 flex items-end justify-end bg-[#0C0C0C] p-2">
        <BaseButton size="small" @click="handleClickFilter">
          {{ $t('category.transaction.result') }}
        </BaseButton>
      </div>
    </div>
  </Teleport>
</template>
<script setup>
import { FILTER_KEYS } from '~/constant/payment.js';

defineProps({
  fromType: {
    type: String,
    default: 'reviews',
  },
  menuType: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['change']);

const isShow = ref(false);
const courses = ref([]);
const categorys = ref([]);
const date = ref({});
const courseType = ref(null);
const status = ref([]);
const paramsObject = computed(() => ({
  courses: courses.value,
  categorys: categorys.value,
  date: date.value,
  courseType: courseType.value,
  status: status.value,
}));
const hasFilter = computed(
  () =>
    categorys.value.length > 0 ||
    courses.value.length > 0 ||
    !isEmptyObject(date.value) ||
    courseType.value ||
    status.value.length > 0,
);

const handleChangeCategorys = (data) => {
  categorys.value = data;
};
const handleChangeCourses = (data) => {
  courses.value = data;
};
const handleDateChange = (data) => {
  date.value = data;
};
const handleTypeChange = (data) => {
  courseType.value = data;
};
// const handleStatusChange = (data) => {
//   status.value = data;
// };

const handleCloseDrawer = () => {
  isShow.value = false;
};
const handleClearFilters = () => {
  courses.value = [];
  categorys.value = [];
  date.value = {};
  courseType.value = null;
  status.value = [];
};
const handleClickFilter = () => {
  emit('change', paramsObject.value);
  handleCloseDrawer();
};
</script>
