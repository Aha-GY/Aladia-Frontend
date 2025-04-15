<template>
  <div class="relative flex h-[88vh] flex-col overflow-hidden">
    <div
      class="h-0 w-full overflow-hidden transition-all duration-300"
      :class="{
        'h-[20rem] pb-4 pt-2': isOpenMemberMap,
      }"
    >
      <ProfileSettingDialogOrgMenuIAMComponentsMembersMap ref="mapRef" />
    </div>
    <div class="relative flex items-center gap-1">
      <div
        v-for="item in menu"
        :key="item.title"
        class="flex h-8 cursor-pointer items-center justify-center gap-2 px-6 text-sm opacity-60 transition-all hover:opacity-80 active:scale-95"
        :class="{
          '!opacity-100': active === item.title,
          'border-b border-white': active === item.title,
        }"
        @click="onTabChange(item)"
      >
        <i class="fa-solid" :class="item.icon" />
        {{ $t(item.label) }}
      </div>
    </div>
    <ClientOnly>
      <div class="flex-1 overflow-hidden">
        <ProfileSettingDialogOrgMenuIAMUsers
          v-if="active === 'Users'"
          ref="userRef"
        >
          <template #header>
            <BaseButton
              type="tertiary"
              :icon="`fa-solid ${isOpenMemberMap ? 'fa-chevron-up' : 'fa-chevron-down'} transition-all duration-300`"
              class="ml-2 bg-[#000000] text-[#FAFAFA] !opacity-100"
              @click="openMemberMap"
            />
          </template>
        </ProfileSettingDialogOrgMenuIAMUsers>
        <ProfileSettingDialogOrgMenuIAMGroups
          v-if="active === 'Groups'"
          ref="groupRef"
        >
          <template #header>
            <BaseButton
              type="tertiary"
              :icon="`fa-solid ${isOpenMemberMap ? 'fa-chevron-up' : 'fa-chevron-down'} transition-all duration-300`"
              class="ml-2 bg-[#000000] text-[#FAFAFA] !opacity-100"
              @click="openMemberMap"
            />
          </template>
        </ProfileSettingDialogOrgMenuIAMGroups>
        <ProfileSettingDialogOrgMenuIAMBranches
          v-if="active === 'Branches'"
          ref="groupRef"
        >
          <template #header>
            <BaseButton
              type="tertiary"
              :icon="`fa-solid ${isOpenMemberMap ? 'fa-chevron-up' : 'fa-chevron-down'} transition-all duration-300`"
              class="ml-2 bg-[#000000] text-[#FAFAFA] !opacity-100"
              @click="openMemberMap"
            />
          </template>
        </ProfileSettingDialogOrgMenuIAMBranches>
        <ProfileSettingDialogOrgMenuIAMUsers
          v-if="active === 'External'"
          ref="externalRef"
          member-type="external"
        >
          <template #header>
            <BaseButton
              type="tertiary"
              :icon="`fa-solid ${isOpenMemberMap ? 'fa-chevron-up' : 'fa-chevron-down'} transition-all duration-300`"
              class="ml-2 bg-[#000000] text-[#FAFAFA] !opacity-100"
              @click="openMemberMap"
            />
          </template>
        </ProfileSettingDialogOrgMenuIAMUsers>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
import { profileEvent } from '~/constant/eventBus';

useElementClass(document?.body, ['hide-scrollbar']);

const { $eventBus } = useNuxtApp();
const menu = [
  {
    label: 'base.users.label',
    title: 'Users',
    icon: 'fa-user',
  },
  {
    label: 'org.tab.groups',
    title: 'Groups',
    icon: 'fa-users',
  },
  {
    label: 'org.tab.branches',
    title: 'Branches',
    icon: 'fa-buildings',
  },
  {
    label: 'org.tab.external',
    title: 'External',
    icon: 'fa-code-branch',
  },
];
const mapRef = ref(null);
const userRef = ref(null);
const externalRef = ref(null);
const groupRef = ref(null);
const active = ref('Users');
const isOpenMemberMap = ref(true);
const openMemberMap = () => {
  isOpenMemberMap.value = !isOpenMemberMap.value;
};

const onTabChange = (item) => {
  active.value = item.title;
};

const getActiveData = () => {
  if (active.value === 'Users') {
    userRef.value?.getData();
  } else if (active.value === 'External') {
    externalRef.value?.getData();
  } else {
    groupRef.value?.getData();
  }
};
const updateMapData = () => {
  mapRef.value?.getMembersMapData();
};

onBeforeMount(() => {
  $eventBus.on(profileEvent.IAM_TAB_GET_DATA, getActiveData);
  $eventBus.on(profileEvent.UPDATE_MAP, updateMapData);
});

onBeforeUnmount(() => {
  $eventBus.off(profileEvent.IAM_TAB_GET_DATA, getActiveData);
  $eventBus.off(profileEvent.UPDATE_MAP, updateMapData);
});
</script>
