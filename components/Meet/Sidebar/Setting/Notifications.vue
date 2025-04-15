<template>
  <div
    class="flex h-full w-full flex-col gap-2 overflow-hidden rounded-5 bg-[#0C0C0C]"
  >
    <MeetSidebarHeader :title="$t('meet.setting.notifications')">
      <template #prefix>
        <div
          class="flex h-5 w-5 cursor-pointer items-center justify-center"
          @click="onBack"
        >
          <i class="fa-regular fa-arrow-left text-lg text-[#FAFAFA]" />
        </div>
      </template>
    </MeetSidebarHeader>

    <div
      class="hide-scrollbar flex flex-col gap-2 overflow-y-auto bg-[#0D0D0D] px-6 py-2"
    >
      <BaseSwitcherList
        v-for="item in notificationList"
        :key="item.key"
        :icon="item.icon"
        :name="$t(item.title)"
        :active="activeNotification(item.type)"
        :change="() => onNotificationChange(item.type)"
      />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      notificationList: [
        {
          title: 'meet.peer.joined',
          key: 'Peer Joined',
          type: 'peerJoined',
          icon: 'fa-light fa-user-plus text-sm',
        },
        {
          title: 'meet.peer.leave',
          key: 'Peer Leave',
          type: 'peerLeave',
          icon: 'fa-light fa-user-minus text-sm',
        },
        {
          title: 'meet.peer.handRaised',
          key: 'Hand raised',
          type: 'handRaised',
          icon: 'fa-light fa-hand text-sm',
        },
        {
          title: 'meet.peer.error',
          key: 'Error',
          type: 'error',
          icon: 'fa-light fa-circle-exclamation text-sm',
        },
      ],
    };
  },
  computed: {
    notifications() {
      return this.hmsStore.notifications;
    },
  },
  methods: {
    onBack() {
      this.$emit('back');
    },
    activeNotification(type) {
      return this.notifications[type];
    },
    onNotificationChange(type) {
      this.notifications[type] = !this.notifications[type];
    },
  },
};
</script>
