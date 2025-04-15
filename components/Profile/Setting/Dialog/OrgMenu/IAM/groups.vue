<template>
  <div class="flex h-full flex-col overflow-hidden">
    <div class="relative flex w-full justify-end">
      <BaseButton
        icon="fa-solid fa-plus"
        label="$t:org.group.create"
        data-cy="1cbc8ff589005838"
        @click="openCreate"
      />
      <slot name="header" />
    </div>
    <BaseInput
      v-model="groupname"
      search
      clear
      fixed
      class="my-3 text-sm"
      placeholder="Search Group..."
    />
    <div class="flex-1 overflow-auto">
      <BaseTable v-loading="loading" border :data="groupList">
        <el-table-column>
          <template #default="scope">
            <ProfileSettingDialogOrgMenuIAMComponentsGroupCompGroupName
              :search-value="groupname"
              :item="scope.row"
              @row-click="openGroupDetail(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column width="100">
          <template #default="scope">
            <div
              class="group flex cursor-pointer items-center justify-end text-xs font-medium text-[#FAFAFA]"
              @click="openGroupDetail(scope.row)"
            >
              <span class="pr-2 capitalize group-hover:opacity-70">More</span>
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
          <div class="pt-8">
            <BaseNoData />
          </div>
        </template>
      </BaseTable>
    </div>
    <div class="flex w-full items-center justify-between py-3">
      <div class="text-sm text-[#707070]">
        {{ groupList.length }} results out of
        {{ cursorInfo.totalItems || 0 }}
      </div>
      <BasePagination :cursor="cursorInfo" @change="onChange" />
    </div>
  </div>
  <ProfileSettingDialogOrgMenuIAMComponentsGroupCompCreateGroupDrawer
    v-model="showCreateGroups"
    :is-left-drawer="isLeftDrawer"
    @reference="handlerReference"
  />
  <ProfileSettingDialogOrgMenuIAMComponentsGroupDetailDrawer
    v-model="showGroupDetail"
    :detail="groupDetail"
    :is-left-drawer="isLeftDrawer"
    @reference="handlerReference"
  />
</template>
<script setup>
import { organizationsGroups } from '~/api/v2/org';
import { profileEvent } from '~/constant/eventBus';

const props = defineProps({
  isLeftDrawer: {
    type: Boolean,
    default: false,
  },
});
const { $eventBus } = useNuxtApp();
const route = useRoute();
const groupname = ref('');
const showCreateGroups = ref(false);
const openCreate = () => {
  showCreateGroups.value = true;
};

const profileStore = useProfileStore();
const loading = ref(false);
const groupList = ref([]);
const cursorInfo = ref({});

const onChange = (cursor) => {
  getGroupsList({
    [cursor.type]: cursor.token,
  });
};

const getGroupsList = async (params) => {
  try {
    if (loading.value) {
      return false;
    }
    loading.value = true;
    const { data, cursor } = await organizationsGroups({
      organizationId: profileStore.myProfileDetail.id,
      limit: 10,
      name: groupname.value || undefined,
      ...params,
    });
    groupList.value = data;
    cursorInfo.value = cursor;
  } finally {
    loading.value = false;
  }
};

const debouncedLoadData = debounce(() => {
  cursorInfo.value = {};
  getGroupsList();
}, 500);

const handlerReference = () => {
  getGroupsList();
  $eventBus.emit(profileEvent.UPDATE_MAP);
  if (props.isLeftDrawer && route.path.includes('iam')) {
    $eventBus.emit(profileEvent.IAM_TAB_GET_DATA);
  }
};

watch(
  () => groupname.value,
  () => {
    debouncedLoadData();
  },
  { immediate: true },
);

// group detail
const showGroupDetail = ref(false);
const groupDetail = ref(null);
const openGroupDetail = (data) => {
  groupDetail.value = data;
  showGroupDetail.value = true;
};

defineExpose({
  getData: getGroupsList,
});
</script>
