<template>
  <el-drawer
    v-model="show"
    :with-header="true"
    :show-close="false"
    :lock-scroll="false"
    destroy-on-close
    :modal="false"
    :close-on-press-escape="false"
    :append-to-body="!isLeftDrawer"
    :class="{
      'is-body-drawer': !isLeftDrawer,
    }"
    class="groups-detail relative !w-[30rem]"
    @close="handleClose"
  >
    <template #header>
      <div class="flex items-center justify-between pr-6 text-[#b0b0b0]">
        <div class="flex items-center">
          <div
            class="mr-3 flex h-6 w-6 cursor-pointer items-center justify-center"
            data-cy="53cece51632c91d1"
            @click="handleClose"
          >
            <i class="fa-sharp fa-solid fa-arrow-left text-lg" />
          </div>
          <div class="line-clamp-1 text-lg">
            {{ groupDetail.name }}
          </div>
        </div>
      </div>
    </template>
    <div
      v-loading="loading"
      class="relative flex h-full flex-col overflow-hidden"
      :class="{
        'p-4': !isLeftDrawer,
      }"
    >
      <div
        class="flex h-[13rem] w-full overflow-hidden rounded-5 bg-[#e2e2e2] bg-opacity-5"
      >
        <div class="relative flex h-full w-[42%] items-center justify-center">
          <img
            v-if="groupDetail.picture"
            :src="groupDetail.picture"
            class="h-full w-full overflow-hidden object-cover"
          />
          <div
            v-else
            class="flex h-[90%] w-[90%] items-center justify-center rounded-5 border-[0.186rem] border-dashed border-[#D9D9D9]"
          >
            <i
              class="fa-light text-[6rem] text-[#565656]"
              :class="[
                groupDetail.icon ? groupDetail.icon : 'fa-regular fa-phone',
              ]"
              :style="{ color: groupDetail.color }"
            />
          </div>
          <el-tooltip effect="light" placement="bottom-start">
            <template #content>
              <span class="cursor-pointer">
                {{ groupDetail.id }}
              </span>
            </template>
            <div
              class="absolute cursor-pointer rounded-5 border-[0.3px] border-white/40 bg-black/40 px-1.5 py-1"
              :class="groupDetail.picture ? 'left-2 top-2' : 'left-5 top-5'"
              @click="handleCopy(groupDetail.id)"
            >
              <!-- Group ID -->

              {{
                $t('base.member.id', { groupId: shortenString(groupDetail.id) })
              }}
              <i class="fa-sharp fa-solid fa-copy ml-1 text-white" />
            </div>
          </el-tooltip>
        </div>
        <div
          class="flex flex-1 flex-col overflow-hidden p-4"
          :class="groupDetail.picture ? 'pl-3' : 'pl-0'"
        >
          <div class="flex w-full items-center">
            <div class="flex flex-1 items-center pr-2">
              <BaseAvatarNext
                :picture="profileStore.myProfileDetail.picture"
                :show-online="false"
                default-icon="fa-solid fa-building-ngo"
                size="sm"
              />
              <div
                class="ml-2 line-clamp-1 break-words pr-2 text-xs text-[#555555]"
              >
                {{ profileStore.myProfileDetail.fullName }}
              </div>
            </div>
            <BaseButton
              class="text-[#fff]"
              type="tertiary"
              @click="showEditDrawer = true"
            >
              <i class="fa-regular fa-pen-to-square text-sm" />
            </BaseButton>
          </div>
          <div
            class="mt-2 line-clamp-1 break-words pl-2 text-base font-medium text-[#D9D9D9]"
          >
            {{ groupDetail.name }}
          </div>
          <div
            class="hide-scrollbar mt-1.5 line-clamp-3 flex-1 overflow-auto break-words text-xs font-medium text-[#707070]"
          >
            <BaseEditorRenderContent :content="groupDetail.description" />
          </div>
          <div class="mt-1 flex items-center">
            <BaseButton
              :loading="removeALLmemberLoading"
              class="mr-1 text-xs text-[#fff]"
              type="tertiary"
              label="$t:base.member.group.empty"
              @click="handleRemoveOrgGroupAllMember"
            />
            <div
              class="cursor-pointer rounded-5 border border-[rgba(226,226,226,0.08)] bg-[#450A0A] px-1.5 py-1 text-xs font-medium text-[#EF4444] hover:bg-opacity-60"
              @click="handleRemoveUser"
            >
              <i
                v-if="removeLoading"
                class="fa-solid fa-spinner animate-spin text-xs"
              />
              {{ $t('base.member.group.delete') }}
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 flex flex-1 flex-col overflow-hidden">
        <div class="flex items-center gap-2">
          <div
            v-for="menu in menus"
            :key="menu"
            class="flex h-12 min-w-24 cursor-pointer items-center justify-center border-b px-4 text-base transition-all"
            :class="
              action === menu.type
                ? 'border-[#E9C238] font-semibold text-[#E9C238]'
                : 'hover:font-meduim border-transparent text-[#D9D9D9]/80 hover:border-[#D9D9D9] hover:text-[#D9D9D9]'
            "
            data-cy="49232f8babcd5b5a"
            @click="handleMenu(menu.type)"
          >
            {{ menu.label }}
          </div>
        </div>
        <div class="flex flex-1 flex-col justify-between overflow-hidden">
          <ProfileSettingDialogOrgMenuIAMComponentsGroupCompMemberList
            v-if="action === 'members'"
            ref="membersRef"
            show-map
            :group-id="groupDetail.id"
            @show-add-member-drawer="showAddMemberDrawer = true"
          />
          <ProfileSettingDialogOrgMenuIAMComponentsEditRole
            v-if="action === 'roles'"
            type="group"
            :invites="rolesDetail"
            @comfirm="getGroupDetail"
          />
          <div v-if="action === 'log'" class="pt-20">
            <BaseNoData />
          </div>
        </div>
      </div>
    </div>
    <ProfileSettingDialogOrgMenuIAMComponentsGroupCompEditGroupInfo
      v-model="showEditDrawer"
      :group-detail="groupDetail"
      @save="handleSaveEditGroupInfo"
    />
    <ProfileSettingDialogOrgMenuIAMComponentsGroupCompAddGroupMemberDrawer
      v-model="showAddMemberDrawer"
      :group-id="groupDetail.id"
      @save="updateMemberList"
    />
  </el-drawer>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import {
  getOrgGroupDetail,
  deleteOrgGroup,
  removeOrgGroupAllMember,
} from '~/api/v2/org';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  isLeftDrawer: {
    type: Boolean,
    default: false,
  },
  detail: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:modelValue', 'reference']);
const { t } = useI18n();
const $toast = useToast();
const { copy } = useClipboard();
const handleCopy = (value) => {
  if (!value) {
    return;
  }
  copy(value);
  $toast.success(t('index.copy.done'));
};

const profileStore = useProfileStore();
const show = computed(() => props.modelValue);
// const removeLoading = ref(false);
const groupDetail = ref(props.detail);
const rolesDetail = ref([]);
const removeLoading = ref(false);
const loading = ref(false);
const showEditDrawer = ref(false);
const membersRef = ref(null);
const showAddMemberDrawer = ref(false);
const handleClose = () => {
  emit('update:modelValue', false);
};
const menus = [
  {
    label: t('org.activity.member.label'),
    type: 'members',
  },
  {
    label: t('org.activity.roles'),
    type: 'roles',
  },
  {
    label: t('org.activity.log'),
    type: 'log',
  },
];
const action = ref('members');
const handleMenu = (type) => {
  action.value = type;
};

const getGroupDetail = async () => {
  loading.value = true;
  if (!props.detail.id) {
    return;
  }
  try {
    const data = await getOrgGroupDetail({
      organizationId: profileStore.myProfileDetail.id,
      groupId: props.detail.id,
    });
    groupDetail.value = data;
    rolesDetail.value = [
      {
        ...data.role,
        role: data.role?.organizationRole,
        id: data.id,
      },
    ];
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
const updateMemberList = () => {
  membersRef.value.getMembersList();
};

const handleSaveEditGroupInfo = () => {
  emit('reference');
  getGroupDetail();
};

const handleRemoveUser = async () => {
  if (removeLoading.value) {
    return;
  }
  removeLoading.value = true;
  try {
    await deleteOrgGroup({
      organizationId: profileStore.myProfileDetail.id,
      groupId: props.detail.id,
    });
    emit('reference');
    emit('update:modelValue', false);
    $toast.success(t('base.member.group.success.delete'));
  } catch (error) {
    console.log(error);
  } finally {
    removeLoading.value = false;
  }
};

const removeALLmemberLoading = ref(false);
const handleRemoveOrgGroupAllMember = async () => {
  if (removeALLmemberLoading.value) {
    return;
  }
  removeALLmemberLoading.value = true;
  try {
    await removeOrgGroupAllMember({
      organizationId: profileStore.myProfileDetail.id,
      groupId: props.detail.id,
    });
    updateMemberList();
    $toast.success(t('base.member.group.success.empty'));
  } catch (error) {
    console.log(error);
  } finally {
    removeALLmemberLoading.value = false;
  }
};

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      groupDetail.value = props.detail;
      rolesDetail.value = {
        ...props.detail.role,
        role: props.detail.role?.organizationRole,
      };
      getGroupDetail();
    } else {
      action.value = 'members';
      groupDetail.value = {};
      rolesDetail.value = {};
    }
  },
  { immediate: true, deep: true },
);
</script>
