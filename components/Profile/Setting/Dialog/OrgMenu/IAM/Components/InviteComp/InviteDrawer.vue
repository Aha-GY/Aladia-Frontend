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
    class="invite-user-drawer !w-[30rem]"
    :class="{
      'is-body-drawer': !isLeftDrawer,
    }"
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
          <div class="text-lg">invite</div>
        </div>
        <div
          class="cursor-pointer text-base font-medium text-[#FAFAFA]"
          data-cy="53cece51632c91d2"
          @click="showInviteLink = true"
        >
          <i class="fa-solid fa-link mr-2" />
          <span>
            {{ $t('base.member.invite.link') }}
          </span>
        </div>
      </div>
    </template>
    <div
      class="relative flex h-full flex-col overflow-hidden"
      :class="{
        'px-4': !isLeftDrawer,
      }"
    >
      <BaseMemberInvite
        :placeholder="$t('base.member.searchUser')"
        :actives="invites"
        :is-enter="true"
        only-enter-email
        height="h-[98%]"
        from="organization"
        :params="{
          scope: 'organization',
          scopeId: profileStore.myProfileDetail.id,
        }"
        use-popover
        @save="onSelectUser"
      />
      <ProfileSettingDialogOrgMenuIAMComponentsCreateRole
        :invites="invites"
        @comfirm="handleComfirm"
      />
    </div>
  </el-drawer>
  <ProfileSettingDialogOrgMenuIAMComponentsInviteCompInviteLinkPopup
    v-model="showInviteLink"
    :organization-id="profileStore.myProfileDetail.id"
    :role-list="roleList"
  />
</template>
<script setup>
import { roleList } from '../../CONST';

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
const showInviteLink = ref(false);
const show = computed(() => props.modelValue);
const invites = ref([]);
const onSelectUser = (user) => {
  invites.value = user || [];
};

const handleClose = () => {
  invites.value = [];
  emit('update:modelValue', false);
};

const handleComfirm = () => {
  emit('reference');
  handleClose();
};
</script>
<style lang="scss">
.invite-user-drawer {
  .el-drawer__body {
    border-width: 0;
  }
}
</style>
