<template>
  <div class="w-full">
    <div class="flex h-12 w-full items-center justify-between rounded-5">
      <div class="flex h-full flex-1 items-center">
        <el-select
          v-model="selectType"
          :empty-values="[null, undefined]"
          :value-on-clear="null"
          style="width: 10rem"
          :placeholder="$t('filter.select')"
          @change="onMenuClick"
        >
          <template #label="{ label }">
            <!-- <i
            :class="selectMenu.find((item) => item.label === label)?.iconClass"
            class="mr-2"
          /> -->
            {{ label }}
          </template>
          <el-option
            v-for="item in selectMenu"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <!-- <i :class="item.iconClass" class="mr-2" /> -->
            {{ item.label }}
          </el-option>
        </el-select>
        <div
          v-for="(item, index) in PurPubList"
          :key="index"
          class="ml-3 flex h-full cursor-pointer items-center justify-center border-b px-6 text-xs text-[#D9D9D9] transition-all duration-300"
          :class="{
            'border-[#D9D9D9]': item.value === activePurPub,
            'border-transparent': item.value !== activePurPub,
            'hover:border-[#D9D9D9]': item.value !== activePurPub,
          }"
          data-cy="f7d92d35f420a54f"
          @click="handlePurOrPub(item.value)"
        >
          {{ $t(item.label) }}
        </div>
      </div>
      <div class="flex h-full items-center">
        <el-popover
          v-model:visible="showSearchData"
          :show-arrow="false"
          trigger="click"
          width="fit-content"
          :trigger-keys="[]"
          popper-style="background-color: #060606"
        >
          <template #reference>
            <BaseInput
              v-model="name"
              search
              fixed
              clear
              placeholder="Search"
              class="!w-64"
            />
          </template>
          <BaseSelectCourses
            :show-search-data="showSearchData"
            :type="selectType"
            :enrollment-type="activePurPub"
            :profile-id="profileId"
            :name="name"
            @select="handleSelectSearch"
          />
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  profileId: {
    type: String,
    default: '',
  },
});
const emits = defineEmits(['change']);
const profileStore = useProfileStore();
const { t } = useI18n();
const name = ref(''); // search value
const showSearchData = ref(false);
const handleSelectSearch = (value) => {
  name.value = value;
  handleEmitsParams();
};

const selectMenu = ref([
  {
    value: '',
    iconClass: 'fa-solid fa-rectangle-history',
    label: t('personal.profile.all'),
  },
  {
    value: 'on-demand',
    iconClass: 'fa-light fa-circle-play',
    label: t('personal.profile.onDemand'),
  },
  {
    value: 'live',
    iconClass: 'fa-solid fa-circle text-[#ED3C28]',
    label: t('personal.profile.onLive'),
  },
]);
const selectType = ref('');
const onMenuClick = (value) => {
  selectType.value = value;
  handleEmitsParams();
};

const PurPubList = computed(() => {
  const purPubList = [{ value: 'enrolled', label: 'course.purchased' }];
  if (
    profileStore?.getPersonalProfileDetail()?.type === 'teacher' ||
    profileStore?.getOrganizationProfileDetail()?.stripeConnectOnboard ===
      'completed'
  ) {
    purPubList.push({ value: 'owner', label: 'course.published' });
  }
  return purPubList;
});
const activePurPub = ref('enrolled');
const handlePurOrPub = (type) => {
  activePurPub.value = type;
  handleEmitsParams();
};

const handleEmitsParams = () => {
  emits('change', {
    type: selectType.value || undefined,
    enrollmentType: activePurPub.value,
    name: name.value || undefined,
  });
};
watch(
  () => name.value,
  () => {
    if (!name.value) {
      handleEmitsParams();
    }
  },
  { immediate: true, deep: true },
);
// handleEmitsParams();
</script>
