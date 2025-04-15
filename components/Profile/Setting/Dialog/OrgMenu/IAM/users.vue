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
        init-type="members"
      />
    </div>
    <div class="relative flex w-full justify-end">
      <BaseButton
        icon="fa-solid fa-plus"
        label="$t:org.group.invite.label"
        data-cy="1cbc8ff589005838"
        @click="openInvite"
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
      v-model="username"
      search
      clear
      fixed
      class="my-3 text-sm"
      :placeholder="$t('base.member.search')"
    />
    <div class="flex-1 overflow-auto">
      <BaseTable v-loading="loading" border :data="usersList">
        <el-table-column>
          <!-- <template #header>E-mail</template> -->
          <template #default="scope">
            <ProfileSettingDialogOrgMenuIAMComponentsUserName
              :search-value="username"
              :item="scope.row"
              @row-click="openMemberDetail(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column width="100">
          <template #default="scope">
            <div
              class="group flex cursor-pointer items-center justify-end text-xs font-medium text-[#FAFAFA]"
              @click="openMemberDetail(scope.row)"
            >
              <span class="pr-2 capitalize group-hover:opacity-70">
                {{ scope.row.role.split('-')[1] || $t('base.member.label') }}
              </span>
              <div
                class="flex cursor-pointer items-center justify-center rounded-5 px-2 py-2 group-hover:bg-white/5"
                data-cy="3e47b872904dc73e"
              >
                <i class="fa-regular fa-arrow-right" />
              </div>
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <BaseNoData />
        </template>
      </BaseTable>
    </div>
    <div class="flex w-full items-center justify-between py-3">
      <div class="text-sm text-[#707070]">
        {{
          $t('base.member.list', {
            memberList: usersList.length,
            itemLength: cursorInfo.totalItems || 0,
          })
        }}
      </div>
      <BasePagination :cursor="cursorInfo" @change="onChange" />
    </div>
  </div>
  <ProfileSettingDialogOrgMenuIAMComponentsInviteCompInviteDrawer
    v-model="inviting"
    :is-left-drawer="isLeftDrawer"
    @reference="handlerReference"
  />
  <ProfileSettingDialogOrgMenuIAMComponentsMemberDetailDrawer
    v-model="showMemberDetail"
    :member-detail="memberDetail"
    :is-left-drawer="isLeftDrawer"
    @reference="handlerReference"
  />
</template>
<script setup>
import { organizationsMembers } from '~/api/v2/org';
import { profileEvent } from '~/constant/eventBus';

const props = defineProps({
  memberType: {
    type: String,
    default: '', // already,external
  },
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
const route = useRoute();
const username = ref('');
const inviting = ref(false);
const openInvite = () => {
  inviting.value = true;
};

const profileStore = useProfileStore();
const loading = ref(false);
const usersList = ref([]);
const cursorInfo = ref({});
const isOpenMemberMap = ref(false);
const openMemberMap = () => {
  isOpenMemberMap.value = !isOpenMemberMap.value;
};

const onChange = (cursor) => {
  getMembersList({
    [cursor.type]: cursor.token,
  });
};

const memberParams = {};
if (props.memberType === 'already') {
  memberParams.alreadyMembers = true;
} else if (props.memberType === 'external') {
  memberParams.externalMembers = true;
}
const getMembersList = async (params) => {
  try {
    if (loading.value || !profileStore.myProfileDetail.id) {
      return false;
    }
    loading.value = true;
    const { data, cursor } = await organizationsMembers({
      organizationId: profileStore.myProfileDetail.id,
      limit: 10,
      text: username.value || undefined,
      ...params,
      ...memberParams,
    });
    usersList.value = data;
    cursorInfo.value = cursor;
  } finally {
    loading.value = false;
  }
};

const debouncedLoadData = debounce(() => {
  cursorInfo.value = {};
  getMembersList();
}, 500);

const handlerReference = () => {
  getMembersList();
  $eventBus.emit(profileEvent.UPDATE_MAP);
  if (props.isLeftDrawer && route.path.includes('iam')) {
    $eventBus.emit(profileEvent.IAM_TAB_GET_DATA);
  }
};

watch(
  () => username.value,
  () => {
    debouncedLoadData();
  },
  { immediate: true },
);

// member detail
const showMemberDetail = ref(false);
const memberDetail = ref(null);
const openMemberDetail = (data) => {
  memberDetail.value = data;
  showMemberDetail.value = true;
};

defineExpose({
  getData: getMembersList,
});
</script>
