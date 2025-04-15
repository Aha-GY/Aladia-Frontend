<template>
  <el-drawer
    v-model="show"
    :with-header="true"
    :show-close="false"
    :lock-scroll="false"
    destroy-on-close
    :modal="false"
    :append-to-body="!isLeftDrawer"
    :close-on-press-escape="false"
    :class="{
      'is-body-drawer': !isLeftDrawer,
    }"
    class="create-groups !w-[30rem]"
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
          <div class="text-lg">
            {{ $t('org.create') }}
          </div>
        </div>
      </div>
    </template>
    <div class="flex h-full flex-col overflow-hidden">
      <div
        class="mb-4 flex cursor-pointer bg-[#e2e2e205] p-4"
        @click="showEditDrawer = true"
      >
        <div
          class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-5 border border-dashed border-[#565656]"
        >
          <img
            v-if="groupDetail.picture"
            :src="groupDetail.picture"
            class="h-full w-full overflow-hidden rounded-5"
          />
          <i
            v-else
            class="fa-light text-3xl text-[#565656]"
            :class="[
              groupDetail.icon ? groupDetail.icon : 'fa-regular fa-phone',
            ]"
            :style="{ color: groupDetail.color }"
          />
        </div>
        <div class="ml-4 flex flex-1 flex-col justify-center">
          <div class="line-clamp-1 text-lg font-medium text-white">
            {{ groupDetail.name || $t('org.group.title') }}
          </div>
          <div class="text-xs text-[#707070]">
            {{
              groupDetail.createdAt
                ? timeAgo(groupDetail.createdAt)
                : $t('org.group.created')
            }}
          </div>
        </div>
      </div>
      <ProfileSettingDialogOrgMenuIAMComponentsGroupCompEditGroupInfo
        v-model="showEditDrawer"
        :group-detail="groupDetail"
        @save="handleSave"
      />
      <div class="relative flex flex-1 flex-col overflow-hidden px-[1rem]">
        <BaseMemberInvite
          :placeholder="$t('org.group.placeholder')"
          :actives="invites"
          :is-enter="false"
          height="h-[98%]"
          type="group"
          from="organization"
          :params="{
            organizationId: profileStore.myProfileDetail.id,
            alreadyMembers: true,
          }"
          use-popover
          @save="onSelectUser"
        />
        <ProfileSettingDialogOrgMenuIAMComponentsCreateRole
          :invites="invites"
          type="group"
          :group-detail="groupDetail"
          @comfirm="handleComfirm"
        />
      </div>
    </div>
  </el-drawer>
</template>
<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  isLeftDrawer: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:modelValue', 'reference']);
const profileStore = useProfileStore();
const showEditDrawer = ref(false);
const groupDetail = ref({});

const handleSave = (data) => {
  groupDetail.value = data;
  emit('reference');
};

const show = computed(() => props.modelValue);
const invites = ref([]);
const onSelectUser = (user) => {
  invites.value = user;
};

const handleClose = () => {
  invites.value = '';
  emit('update:modelValue', false);
  groupDetail.value = {};
};

const handleComfirm = () => {
  emit('reference');
  handleClose();
};
</script>
<style lang="scss">
.ProfileMenuDrawer {
  .create-groups {
    .el-drawer__body {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
}
.create-groups {
  .el-drawer__body {
    border-width: 0;
  }
}
</style>
