<template>
  <div class="bg-[#0D0D0D] px-4 py-2">
    <div
      class="flex h-10 cursor-pointer items-center gap-2 rounded-5 p-1.5 text-[#FAFAFA]"
      data-cy="3766964aeab61668"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      @click.stop="open = !open"
    >
      <div
        class="mx-3 flex h-6 w-6 items-center justify-center rounded-5"
        :class="hover ? 'bg-white/5' : ''"
      >
        <i
          class="fa-regular text-sm"
          :class="
            hover
              ? `fa-chevron-right transition-all ${open ? 'rotate-90' : ''}`
              : item.icon
          "
        />
      </div>
      <div
        class="flex h-6 items-center justify-center rounded-5 bg-[#262626] px-2 text-xs font-medium text-[#D4D4D4]"
      >
        {{ total }}
      </div>
      <div class="ml-1 text-base">{{ $t(item.name) }}</div>
      <div class="w-0 flex-1" />
      <BaseMemberPreview
        v-if="!open && allPeers.length"
        :members="allPeers"
        :total="4"
      />
      <el-popover
        v-if="role !== 'host' && isHost"
        v-model:visible="addShow"
        trigger="click"
        :width="392"
        :show-arrow="false"
        :placement="height < 700 ? 'left' : 'bottom'"
        popper-style="position: fixed"
        :persistent="false"
        :teleported="false"
      >
        <template #reference>
          <div
            class="-ml-4 flex h-6 w-8 items-center justify-center"
            @click.stop
          >
            <div
              class="flex h-[1.875rem] w-[1.875rem] cursor-pointer items-center justify-center rounded-full border border-dashed border-[#707070]"
            >
              <i class="fa-solid fa-user-plus text-xs text-[#D9D9D9]" />
            </div>
          </div>
        </template>
        <div class="h-80 p-2" @click.stop>
          <BaseMemberInvite
            :params="{
              scope: 'event',
              scopeId: meet.eventId,
            }"
            :invite-loading="inviteLoading"
            @close="addShow = false"
            @save="onSave"
          />
        </div>
      </el-popover>
      <!-- <div
        v-if="role !== 'host'"
        class="-ml-4 flex h-6 w-8 items-center justify-center"
      >
        <div
          class="flex h-[1.875rem] w-[1.875rem] cursor-pointer items-center justify-center rounded-full border border-dashed border-[#707070]"
        >
          <i class="fa-solid fa-user-plus text-xs text-[#D9D9D9]" />
        </div>
      </div> -->

      <el-popover
        v-if="role !== 'host' && (showAudio || showVideo)"
        v-model:visible="show"
        trigger="click"
        :show-arrow="false"
        :width="230"
        placement="bottom"
        :teleported="false"
        :persistent="false"
      >
        <template #reference>
          <div
            class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
            data-cy="847c8e298e8a77dd"
            @click.stop="getEnabled"
          >
            <i class="fa-regular fa-ellipsis text-xs text-[#FAFAFA]" />
          </div>
        </template>
        <div
          class="flex flex-col gap-1.5 p-1.5 text-xs text-[#E5E5E5]"
          @click.stop
        >
          <div
            v-if="showAudio"
            class="flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
            @click="onChange('audio')"
          >
            <div class="flex h-5 w-5 items-center justify-center">
              <i class="fa-regular" :class="icon('audio')" />
            </div>
            {{ $t(name('audio')) }}
          </div>
          <div
            v-if="showVideo"
            class="flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
            @click="onChange('video')"
          >
            <div class="flex h-5 w-5 items-center justify-center">
              <i class="fa-regular" :class="icon('video')" />
            </div>
            {{ $t(name('video')) }}
          </div>
        </div>
      </el-popover>
    </div>
    <el-collapse-transition>
      <div v-if="open">
        <div v-for="peer in hmsPeers" :key="peer.id">
          <MeetSidebarParticipantItem :role="role" :peer="peer" />
          <MeetSidebarParticipantShareItem
            v-if="sharingIds.includes(peer.id)"
            :role="role"
            :peer="peer"
          />
        </div>
        <MeetSidebarParticipantItem
          v-for="peer in notJoinPeers"
          :key="peer.id"
          :role="role"
          :peer="peer"
          :is-join="false"
        />
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import {
  selectPeerMetadata,
  selectIsPeerAudioEnabled,
  selectIsPeerVideoEnabled,
} from '@100mslive/hms-video-store';

import { hmsStore } from '~/utils/hms';

export default {
  props: {
    role: {
      type: String,
      default: 'host',
    },
  },
  setup() {
    const hmsStore = useHmsStore();
    const hubEvent = useHubEventStore();
    const { height } = useWindowSize();
    return { hmsStore, hubEvent, height };
  },
  data() {
    return {
      hover: false,
      open: false,
      roles: {
        host: {
          name: 'meet.roles.hosts',
          icon: 'fa-user-lock',
        },
        'co-host': {
          name: 'meet.roles.coHosts',
          icon: 'fa-user-gear',
        },
        guest: {
          name: 'meet.roles.guests',
          icon: 'fa-user',
        },
      },
      show: false,
      options: [
        {
          type: 'audio',
        },
        {
          type: 'video',
        },
      ],
      next: null,
      loading: false,
      addShow: false,
      inviteLoading: false,
      isAudioEnabled: false,
      isVideoEnabled: false,
    };
  },
  computed: {
    item() {
      return this.roles[this.role];
    },
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    isHost() {
      const roleName = this.hmsLocalPeer.roleName;
      return roleName === 'host' || roleName === 'co-host';
    },
    meet() {
      return this.hmsStore.meet;
    },
    course() {
      return this.hmsStore.course;
    },
    allHmsPeers() {
      return this.hmsStore.hmsPeers.map((peer) => {
        const metadata = hmsStore.getState(selectPeerMetadata(peer.id));
        return {
          ...peer,
          picture: metadata?.picture,
          userId: metadata?.userId,
          online: true,
        };
      });
    },
    hmsPeers() {
      return this.allHmsPeers.filter((peer) => peer.roleName === this.role);
    },
    members() {
      return this.hmsStore.users[this.role] || [];
    },
    notJoinPeers() {
      return uniqBy(this.members, 'id').filter(
        (r) => !this.allHmsPeers.some((p) => p.userId === r.id),
      );
    },
    allPeers() {
      return [...this.hmsPeers, ...this.notJoinPeers];
    },
    hmsPermissions() {
      return this.hmsStore.hmsPermissions;
    },
    sharingIds() {
      return this.hmsStore.hmsPeersScreenSharing.map((r) => r.id);
    },
    total() {
      let sameNum = 0;
      this.hmsPeers.forEach((peer) => {
        if (this.sharingIds.includes(peer.id)) {
          sameNum++;
        }
      });
      return this.allPeers.length + sameNum;
    },
    showAudio() {
      return (
        (this.hmsPermissions.mute && this.isAudioEnabled) ||
        (this.hmsPermissions.unmute && !this.isAudioEnabled)
      );
    },
    showVideo() {
      return (
        (this.hmsPermissions.mute && this.isVideoEnabled) ||
        (this.hmsPermissions.unmute && !this.isVideoEnabled)
      );
    },
  },
  watch: {
    hmsPeers() {
      this.getEnabled();
    },
  },
  created() {
    this.init();
  },
  methods: {
    getEnabled() {
      this.isAudioEnabled = this.hmsPeers.some((peer) =>
        hmsStore.getState(selectIsPeerAudioEnabled(peer.id)),
      );
      this.isVideoEnabled = this.hmsPeers.some((peer) =>
        hmsStore.getState(selectIsPeerVideoEnabled(peer.id)),
      );
    },
    async init() {
      if (this.hmsStore.users[this.role]) {
        return;
      }
      this.next = null;
      // this.members = [];
      this.load();
    },
    async load() {
      try {
        this.loading = true;
        const {
          data,
          cursor: { next },
        } = await this.hubEvent.getMembers({
          limit: 0,
          next: this.next || undefined,
          roles: this.course
            ? {
                host: 'course-observer',
                'co-host': 'course-teacher',
                guest: 'course-attendant',
              }[this.role]
            : this.role,
          calendarId: this.meet.calendarId,
          eventId: this.meet.eventId,
        });
        this.next = next;
        this.hmsStore.users[this.role] = [...data];
        // this.members = [...this.members, ...data];
      } finally {
        this.loading = false;
      }
    },
    async onSave(selecteds) {
      this.inviteLoading = true;
      const ids = selecteds
        .filter((r) => r.id && !r.isEmail)
        .map((r) => ({
          profileId: r.id,
          role: this.role,
        }));
      const emails = selecteds
        .filter((r) => r.isEmail)
        .map((r) => ({
          email: r.email,
          role: this.role,
        }));

      await this.hmsStore.updateEvent({
        id: this.meet.eventId,
        calendarId: this.meet.calendarId,
        addedMembers: {
          ids,
          emails,
        },
      });
      this.hmsStore.users[this.role] = [...this.members, ...selecteds];
      // this.members = [...this.members, ...selecteds];
      this.addShow = false;
      this.inviteLoading = false;
    },
    async onChange(type) {
      try {
        const options = {
          enabled:
            type === 'audio' ? !this.isAudioEnabled : !this.isVideoEnabled, // false to mute, true to unmute
          roles: [this.role], // optional, array of roles to mute, mutes everyone if not passed
          type, // optional, audio/video, mutes both if not passed
        };
        await hmsActions.setRemoteTracksEnabled(options);
      } catch (error) {
        // Permission denied or invalid track ID or not connected to room
        console.error(error);
      }
      this.show = false;
    },
    name(type) {
      if (type === 'audio') {
        return this.isAudioEnabled
          ? 'meet.actions.request.audio.mute'
          : 'meet.actions.request.audio.unmute';
      } else {
        return this.isVideoEnabled
          ? 'meet.actions.request.video.mute'
          : 'meet.actions.request.video.unmute';
      }
    },
    icon(type) {
      if (type === 'audio') {
        return this.isAudioEnabled ? 'fa-microphone-slash' : 'fa-microphone';
      } else {
        return this.isVideoEnabled ? 'fa-video-slash' : 'fa-video';
      }
    },
  },
};
</script>
