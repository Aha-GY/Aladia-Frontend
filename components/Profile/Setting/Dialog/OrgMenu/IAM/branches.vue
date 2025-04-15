<template>
  <div class="flex h-full flex-col overflow-hidden">
    <div
      v-if="showMap"
      :class="{
        'h-[13rem]': isOpenMemberMap,
      }"
      class="mb-2 h-0 w-full transition-all duration-300"
    >
      <ProfileSettingDialogOrgMenuIAMComponentsMembersMap
        ref="mapRef"
        is-left-drawer
        init-type="sites"
      />
    </div>
    <div class="relative flex w-full justify-end">
      <BaseButton
        icon="fa-solid fa-plus"
        label="$t:org.branches.add"
        data-cy="1cbc8ff589005831"
        @click="openAddEditBranches(null)"
      />
      <BaseButton
        v-if="showMap"
        type="tertiary"
        :icon="`fa-solid ${isOpenMemberMap ? 'fa-chevron-up' : 'fa-chevron-down'} transition-all duration-300`"
        class="ml-2 bg-[#000000] text-[#FAFAFA] !opacity-100"
        @click="openMemberMap"
      />
      <slot name="header" />
    </div>
    <BaseInput
      v-model="brnachName"
      search
      clear
      fixed
      class="my-3 text-sm"
      :placeholder="$t('org.branches.search')"
    />
    <div class="flex-1 overflow-auto">
      <div
        v-if="branchesList.headquarter?.length"
        class="mb-2 text-base text-[#FAFAFA]"
      >
        Headquarter
      </div>
      <div v-for="(item, index) in branchesList.headquarter" :key="index">
        <ProfileSettingDialogOrgMenuIAMComponentsBranchesCompItem
          :item="item"
          :search-value="brnachName"
          @row-click="openAddEditBranches(item)"
        />
      </div>
      <div
        v-if="branchesList.branches?.length"
        class="mb-2 text-base text-[#FAFAFA]"
      >
        Branches
      </div>
      <div v-for="(item, index) in branchesList.branches" :key="index">
        <ProfileSettingDialogOrgMenuIAMComponentsBranchesCompItem
          :item="item"
          :search-value="brnachName"
          @row-click="openAddEditBranches(item)"
        />
      </div>
      <div
        v-if="!branchesList.headquarter.length && !branchesList.branches.length"
        class="mt-[0.6rem]"
      >
        <BaseNoData />
      </div>
    </div>
  </div>
  <ProfileSettingDialogOrgMenuIAMComponentsBranchesCompAddEdit
    v-model="open"
    :edit-data="branchDetail"
    :is-left-drawer="isLeftDrawer"
    @reference="handlerReference"
  />
</template>
<script setup>
import { profileEvent } from '~/constant/eventBus';

const props = defineProps({
  isLeftDrawer: {
    type: Boolean,
    default: false,
  },
  showMap: {
    type: Boolean,
    default: false,
  },
});
const { $eventBus } = useNuxtApp();
const orgStore = useOrgStore();
const route = useRoute();
const brnachName = ref('');
const open = ref(false);
const isOpenMemberMap = ref(false);
const branchDetail = ref(null);

const branchesList = computed(() => {
  const list = orgStore.mapSites;
  const data = {
    headquarter:
      list.filter((item) => item.isHeadquarter && filterName(item.name)) || [],
    branches:
      list.filter((item) => !item.isHeadquarter && filterName(item.name)) || [],
  };
  return data;
});

const openMemberMap = () => {
  isOpenMemberMap.value = !isOpenMemberMap.value;
};

const filterName = (itemName) => {
  const res = brnachName.value
    ? itemName?.toLowerCase()?.includes(brnachName.value.toLowerCase())
    : true;
  return res;
};

const openAddEditBranches = (data) => {
  branchDetail.value = data;
  open.value = true;
};

const handlerReference = () => {
  $eventBus.emit(profileEvent.UPDATE_MAP);
  if (props.isLeftDrawer && route.path.includes('iam')) {
    $eventBus.emit(profileEvent.IAM_TAB_GET_DATA);
  }
};
</script>
