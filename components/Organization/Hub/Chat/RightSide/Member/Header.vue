<template>
  <div
    class="z-50 flex items-center justify-between gap-2 rounded p-[0.375rem] pr-[0.75rem]"
  >
    <div class="flex items-center gap-1">
      <div class="flex w-12 items-center justify-center">
        <i class="fa-light fa-users text-sm" />
      </div>
      <div>{{ $t('org.members.selected', { count: total || 0 }) }}</div>
    </div>
    <div v-if="!isO2ORoom" class="flex items-center gap-2">
      <el-popover :width="180" trigger="click" placement="bottom-end">
        <template #reference>
          <div
            class="flex size-6 cursor-pointer items-center justify-center rounded-sm hover:bg-[#252525]"
          >
            <i class="fa-solid fa-filter text-xs" />
          </div>
        </template>
        <div class="flex flex-col gap-1 p-1">
          <div
            v-for="role in roles"
            :key="role.value"
            class="flex cursor-pointer items-center justify-between rounded px-2 py-1 text-sm hover:bg-white/10"
            data-cy="8589a0e88a9b7bd8"
            @click="onCheck(role)"
          >
            <div class="flex items-center gap-1.5">
              <div class="flex size-5 items-center justify-center">
                <i :class="role.icon" />
              </div>
              {{ $t(role.label) }}
            </div>
            <BaseCheckbox :active="filterRoles.includes(role.value)" />
          </div>
        </div>
      </el-popover>
      <div
        v-if="canEdit"
        class="flex size-6 cursor-pointer items-center justify-center rounded-sm hover:bg-[#252525]"
        data-cy="9929941c564df987"
        @click="onInvite"
      >
        <i class="fa-solid fa-user-plus text-xs" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const hubChatStore = useHubChatStore();
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubChatStore, websocket, hubSpaces, hubSidebar };
  },
  data() {
    return {
      filterRoles: [],
      timer: null,
      query: '',
    };
  },
  computed: {
    room() {
      return this.hubChatStore.roomInfo;
    },
    isO2ORoom() {
      return this.room?.type === 'one-to-one';
    },
    canEdit() {
      return (
        this.room?.userRole === 'chat-room-owner' ||
        this.room?.userRole === 'chat-room-admin'
      );
    },
    roles() {
      return [
        {
          icon: 'fa-regular fa-user-gear',
          value: 'chat-room-owner',
          label: 'org.role.owner',
        },
        {
          icon: 'fa-regular fa-user-pen',
          value: 'chat-room-admin',
          label: 'org.role.administrator',
        },
        {
          icon: 'fa-regular fa-user',
          value: 'chat-room-member',
          label: 'org.role.member',
        },
      ];
    },
  },
  mounted() {
    this.filterRoles = this.roles.map((role) => role.value);
  },
  methods: {
    onInvite() {
      this.hubSidebar.invite.type = 'room'; // 类型
      this.hubSidebar.invite.state = true;
    },
    onCheck(role) {
      const index = this.filterRoles.indexOf(role.value);
      if (index === -1) {
        this.filterRoles.push(role.value);
      } else {
        if (this.filterRoles.length === 1) {
          return;
        }
        this.filterRoles.splice(index, 1);
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$emit('filter', this.filterRoles.join(','));
      }, 1000);
    },
    handleUserConnectStatus(res) {
      if (!res || !res.data) {
        return;
      }
      const { userId, online } = res.data;
      this.members.forEach((item) => {
        if (item.id === userId) {
          item.online = online;
        }
      });
    },
  },
};
</script>
