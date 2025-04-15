<template>
  <el-popover
    v-model:visible="notificationStore.show"
    trigger="click"
    :show-arrow="false"
    :popper-style="{
      padding: '0px !important',
      // width: '28rem',
    }"
    popper-class="!w-[30rem] max-sm:!w-full"
    :teleported="false"
  >
    <template #reference>
      <div
        class="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-base leading-none transition-all hover:bg-white/10 active:scale-95"
        :class="
          notificationStore.show
            ? 'bg-white/10'
            : 'text-[#D9D9D9]/80 hover:text-[#D9D9D9]'
        "
      >
        <BaseRipple class="!rounded-md">
          <i class="fa-solid fa-bell" />
        </BaseRipple>
        <!-- <div
          v-if="showBadge"
          class="absolute right-3 top-3 z-10 h-2 w-2 rounded-full border border-[#060606] bg-[#E4B53D]"
        /> -->
        <div
          v-if="showBadge && notificationStore.totalUnread"
          class="absolute top-1 z-10 flex items-center justify-center rounded-full bg-[#FFE072] px-1 py-0.5 text-10 leading-none text-[#252525]"
          :class="
            notificationStore.totalUnread > 9999
              ? '-right-2'
              : notificationStore.totalUnread > 99
                ? '-right-1'
                : notificationStore.totalUnread > 9
                  ? 'right-0'
                  : 'right-1'
          "
        >
          {{ badge }}
        </div>
      </div>
    </template>
    <HeaderNotice :open="open" />
  </el-popover>
</template>

<script>
export default {
  setup() {
    const notificationStore = useNotificationStore();
    return { notificationStore };
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    showBadge() {
      return !this.notificationStore.show &&
        this.notificationStore.list.length > 0 &&
        (!this.notificationStore.lastSeenNotificationDate ||
          new Date(this.notificationStore.list[0]?.updatedAt) >
            new Date(this.notificationStore.lastSeenNotificationDate))
        ? true
        : false;
    },
    badge() {
      if (this.notificationStore.totalUnread > 999) {
        return `${(this.notificationStore.totalUnread / 1000).toFixed(1)}k`;
      } else {
        return this.notificationStore.totalUnread;
      }
    },
    id() {
      return this.authStore.context;
    },
  },
};
</script>
