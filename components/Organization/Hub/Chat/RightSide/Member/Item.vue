<template>
  <div
    v-loading="loading"
    class="flex items-center justify-between gap-2 rounded py-2 pr-1 hover:bg-white/10"
  >
    <div v-if="member.username" class="flex flex-1 items-center gap-2">
      <div class="relative">
        <BaseAvatarNext
          :picture="member.image"
          :story="member.story"
          :user-id="member.id"
          :online="member.isOnline"
          size="md"
          source="chat"
        >
          <template #button>
            <div
              v-if="isOwner"
              class="absolute inset-0 flex size-full items-center justify-center rounded-full bg-[#6419B4]"
            >
              <i
                class="fa-solid fa-key text-[0.5rem] font-extrabold text-white"
              />
            </div>
          </template>
        </BaseAvatarNext>
      </div>
      <div>
        <div
          class="w-40 truncate text-sm text-white"
          v-html="member.fullName"
        />
        <div class="flex items-center gap-1 text-11">
          <div v-if="isOwner" class="text-white/50">Chat Creator</div>
          <div v-else-if="member.isOnline" class="text-white/50">Online</div>
          <div v-else class="w-32 truncate text-white/50">
            {{ $t('base.member.lastSeen') }} {{ timeAgo(member.lastActivity) }}
          </div>
          <div
            v-if="member.invited"
            class="flex items-center gap-1 text-[#dabb4b]"
          >
            <div class="size-2 rounded-full bg-[#dabb4b]" />
            {{ $t('org.invited.label') }}
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-1 items-center gap-2">
      <div
        class="flex size-10 items-center justify-center rounded-full bg-white/5"
      >
        <i class="fa-solid fa-envelope text-white/50" />
      </div>
      <div>
        <div class="w-40 truncate text-sm text-white">{{ member.email }}</div>
        <div class="flex items-center gap-1 text-11">
          <div class="flex items-center gap-1 text-white/50">
            {{
              $t('org.invited.time', {
                time: timeAgo(member.invitedAt),
              })
            }}
          </div>
          <div
            v-if="member.invited"
            class="flex items-center gap-1 text-[#dabb4b]"
          >
            <div class="size-2 rounded-full bg-[#dabb4b]" />
            {{ $t('org.invited.label') }}
          </div>
        </div>
      </div>
    </div>
    <el-select
      v-model="member.role"
      style="width: 8rem"
      placeholder="Role"
      :disabled="member.invited || isOwner || !canEdit"
      @change="updateMember"
    >
      <el-option
        v-for="role in roles"
        :key="role.value"
        :label="$t(role.label)"
        :value="role.value"
      >
        {{ $t(role.label) }}
      </el-option>
    </el-select>
    <el-popover
      ref="more"
      :disabled="isOwner || !canEdit"
      :width="150"
      trigger="click"
      placement="bottom-end"
    >
      <template #reference>
        <div
          class="flex size-6 items-center justify-center rounded text-xs"
          :class="
            isOwner || !canEdit
              ? 'text-white/40'
              : 'cursor-pointer hover:bg-white/10'
          "
        >
          <i class="fa-solid fa-ellipsis" />
        </div>
      </template>
      <div class="flex flex-col gap-1 p-1">
        <div
          v-if="member.invited"
          class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
          data-cy="12f106cfd928ee89"
          @click="resendInvite"
        >
          <div class="flex size-4 items-center justify-center text-xs">
            <i class="fa-solid fa-reply-clock" />
          </div>
          {{ $t('org.invited.resend') }}
        </div>
        <div
          class="flex cursor-pointer items-center gap-2 rounded bg-[#1a0a0a] px-2 py-1 hover:bg-[#3b1616]"
          data-cy="80e7e936cc3c1b57"
          @click="removeMember"
        >
          <div class="flex size-4 items-center justify-center text-xs">
            <i class="fa-solid fa-trash" />
          </div>
          {{
            member.invited ? $t('org.invited.delete') : $t('org.invited.remove')
          }}
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    member: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const authStore = useAuthStore();
    const hubChatStore = useHubChatStore();
    return { authStore, hubChatStore };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    room() {
      return this.hubChatStore.roomInfo;
    },
    isOwner() {
      return this.member.role === 'chat-room-owner';
    },
    canEdit() {
      // return (
      //   this.room.userRole === 'chat-room-owner' ||
      //   this.room.userRole === 'chat-room-admin'
      // );
      return true;
    },
    roles() {
      const result = [
        {
          value: 'chat-room-admin',
          label: 'org.role.administrator',
        },
        {
          value: 'chat-room-member',
          label: 'org.role.member',
        },
      ];

      if (this.isOwner && this.member.role) {
        const label = this.member.role.split('-')[2];
        result.push({
          value: this.member.role,
          label: label.charAt(0).toUpperCase() + label.slice(1),
        });
      }

      return result;
    },
  },
  methods: {
    async updateMember(role) {
      const oldRole = this.member.role;
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        this.member.role = role;
        await this.hubChatStore.changeRoomMembersRole({
          role,
          roomId: this.room.id,
          userId: this.member.id,
        });
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.member.role = oldRole;
        throw error;
      }
    },
    async resendInvite() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        // this.$refs.more.hide();
        // await this.hubSpaces.inviteMembers({
        //   spaceId: this.space.id,
        //   membersWithId: this.member.id
        //     ? [{ profileId: this.member.id, role: this.member.role }]
        //     : [],
        //   membersWithEmail: this.member.id
        //     ? []
        //     : [{ email: this.member.email }],
        // });
        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async removeMember() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      try {
        this.$refs.more.hide();
        await this.hubChatStore.deleteRoomMembers({
          roomId: this.room.id,
          members: [this.member.id],
        });
        await this.hubChatStore.retrieveRoom({
          roomId: this.room.id,
        });
        this.$el.classList.add('hidden');
        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
  },
};
</script>
