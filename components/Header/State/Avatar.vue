<template>
  <div
    ref="buttonRef"
    v-click-outside="onClickOutside"
    class="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-base leading-none transition-all hover:bg-white/10 active:scale-95"
    :class="open ? 'bg-white/10' : 'text-[#D9D9D9]/80 hover:text-[#D9D9D9]'"
  >
    <BaseRipple class="!rounded-md" data-cy="header-avatar" @click="changeOpen">
      <BaseAvatarNext
        :picture="profileStore.myProfileDetail.picture"
        :show-online="false"
        size="sm"
        :default-icon="`fa-solid ${profileStore.myProfileDetail.entityType === 'organization' ? 'fa-building-ngo' : 'fa-user'}`"
      />
    </BaseRipple>
  </div>
  <el-popover
    :visible="open"
    :virtual-ref="buttonRef"
    virtual-triggering
    trigger="click"
    :show-arrow="false"
    :popper-style="{
      padding: '0px !important',
      width: '30rem',
    }"
    :teleported="false"
  >
    <HeaderProfile @handle-emit="handleEmit" />
  </el-popover>
</template>

<script setup>
import { profileEvent } from '~/constant/eventBus';

const { $eventBus } = useNuxtApp();
const profileStore = useProfileStore();
const webhook = useWebhookStore();
const open = ref(false);
const buttonRef = ref(null);
onMounted(() => {
  $eventBus.on(profileEvent.CLOSE_PROFILE_DRAWER, changeOpen);
});
onUnmounted(() => {
  $eventBus.off(profileEvent.CLOSE_PROFILE_DRAWER, changeOpen);
});

provide('parentOpen', open);

const changeOpen = () => {
  open.value = !open.value;
};
const handleEmit = (value) => {
  if (value === 'close') {
    open.value = false;
  }
};
onClickOutside(
  buttonRef,
  () => {
    if (webhook.isCreateInputsWebhookChange) {
      webhook.isCreateWebhookConfirm = true;
      return;
    }
    if (webhook.isEditInputsWebhookChange) {
      webhook.isEditWebhookConfirm = true;
      return;
    }
    setTimeout(() => {
      open.value = false;
      webhook.isEditWebhookConfirm = false;
      webhook.isCreateWebhookConfirm = false;
    }, 300);
  },
  {
    ignore: [
      '.el-popper',
      '.el-overlay-dialog',
      '.el-dialog',
      '.Vue-Toastification__container',
    ],
  },
);
</script>
