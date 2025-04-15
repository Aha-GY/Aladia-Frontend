<template>
  <div class="flex flex-1 flex-col overflow-hidden">
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
    <div class="mt-[1rem]">
      <BaseInput
        v-model="username"
        search
        clear
        fixed
        class="my-3 text-sm"
        :placeholder="$t('base.member.search')"
      >
        <template #suffix>
          <div class="flex items-center">
            <div
              class="mb-[0.5rem] mr-2.5"
              @click="emit('showAddMemberDrawer')"
            >
              <i
                class="fa-solid fa-user-plus cursor-pointer text-white hover:text-white/80"
              />
            </div>
            <BaseButton
              v-if="showMap"
              type="tertiary"
              :icon="`fa-solid ${isOpenMemberMap ? 'fa-chevron-up' : 'fa-chevron-down'} transition-all duration-300`"
              class="mb-[0.5rem] ml-2 mr-2.5 bg-[#000000] text-[#FAFAFA] !opacity-100"
              @click="openMemberMap"
            />
          </div>
        </template>
      </BaseInput>
    </div>
    <BaseNoData v-if="!loading && !memberList.length" class="mt-20" />
    <BaseTable
      v-else
      v-loading="loading"
      class="hide-scrollbar !h-[90%] flex-1 overflow-y-hidden"
      border
      :data="memberList"
    >
      <el-table-column>
        <!-- <template #header>E-mail</template> -->
        <template #default="scope">
          <ProfileSettingDialogOrgMenuIAMComponentsUserName
            from="groups"
            :item="scope.row"
          />
        </template>
      </el-table-column>
      <el-table-column width="100">
        <template #default="scope">
          <div>
            <div
              class="flex cursor-pointer items-center justify-center rounded-5 border border-[rgba(226,226,226,0.08)] bg-[#450A0A] px-1.5 py-1 text-center text-xs font-medium text-[#EF4444] hover:bg-opacity-60"
              @click="handleRemoveUser(scope.row)"
            >
              <i
                v-if="removeLoading && scope.row.id === removeLoadingId"
                class="fa-solid fa-spinner mr-1 animate-spin text-xs"
              />
              {{ $t('base.member.invite.remove') }}
            </div>
          </div>
        </template>
      </el-table-column>
    </BaseTable>
  </div>
  <div class="flex w-full items-center justify-between py-3">
    <div class="text-sm text-[#707070]">
      {{
        $t('base.member.list', {
          memberList: memberList.length,
          itemLength: cursorInfo.totalItems || 0,
        })
      }}
    </div>
    <BasePagination :cursor="cursorInfo" @change="onChange" />
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { getOrgGroupMemberList, removeOrgGroupMember } from '~/api/v2/org';

const props = defineProps({
  groupId: {
    type: String,
    required: true,
  },
  showMap: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['showAddMemberDrawer']);
const { t } = useI18n();
const $toast = useToast();
const username = ref('');
const profileStore = useProfileStore();
const loading = ref(false);
const memberList = ref([]);
const cursorInfo = ref({});
const removeLoading = ref(false);
const removeLoadingId = ref(null);
const isOpenMemberMap = ref(false);
const openMemberMap = () => {
  isOpenMemberMap.value = !isOpenMemberMap.value;
};
const handleRemoveUser = async (memberInfo) => {
  if (removeLoading.value) {
    return;
  }
  removeLoadingId.value = memberInfo.id;
  removeLoading.value = true;
  try {
    await removeOrgGroupMember({
      organizationId: profileStore.myProfileDetail.id,
      groupId: props.groupId,
      profileIds: [memberInfo.profile?.id],
    });
    $toast.success(t('org.activity.member.removed'));
    debouncedLoadData();
  } finally {
    removeLoading.value = false;
    removeLoadingId.value = null;
  }
};

const onChange = (cursor) => {
  getMembersList({
    [cursor.type]: cursor.token,
  });
};

const getMembersList = async (params) => {
  try {
    if (loading.value) {
      return false;
    }
    loading.value = true;
    const { data, cursor } = await getOrgGroupMemberList({
      organizationId: profileStore.myProfileDetail.id,
      groupId: props.groupId,
      limit: 10,
      text: username.value || undefined,
      ...params,
    });
    memberList.value = data;
    cursorInfo.value = cursor;
  } finally {
    loading.value = false;
  }
};

const debouncedLoadData = debounce(() => {
  cursorInfo.value = {};
  getMembersList();
}, 500);

watch(
  () => username.value,
  () => {
    debouncedLoadData();
  },
  { immediate: true },
);

defineExpose({
  getMembersList: () => debouncedLoadData(),
});
</script>
