<template>
  <el-popover
    v-model:visible="open"
    trigger="click"
    :show-arrow="false"
    placement="top"
    :width="148"
    :teleported="false"
    :persistent="false"
  >
    <template #reference>
      <div class="flex items-center">
        <el-tooltip
          :disabled="$device.isMobile"
          effect="light"
          :content="$t('meet.leave.call')"
          placement="top"
          :hide-after="0"
          popper-class="text-[#FAFAFA]"
          :teleported="false"
        >
          <div
            class="flex cursor-pointer items-center justify-center rounded-5 bg-[#450A0A]"
            :class="sizeClass"
            data-cy="db92379e328bf701"
            @click="!isHost && leaveRoom()"
          >
            <i class="fa-regular fa-phone-slash text-[#EF4444]" />
          </div>
        </el-tooltip>
      </div>
    </template>

    <div class="flex flex-col gap-2.5 p-1.5 text-sm text-[#E5E5E5]">
      <div
        class="flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
        data-cy="da62d9912bc2cde7"
        @click="leaveRoom"
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <i class="fa-regular fa-phone-hangup" />
        </div>
        {{ $t('meet.leave.call') }}
      </div>
      <div
        v-if="isHost"
        class="flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
        data-cy="ce276be11e6e9a44"
        @click="endRoom"
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <i class="fa-regular fa-octagon-exclamation" />
        </div>
        {{ $t('meet.end.call') }}
      </div>
    </div>
  </el-popover>
</template>
<script>
import { hmsActions } from '~/utils/hms';

export default {
  props: {
    size: {
      type: String,
      default: 'md',
    },
  },
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      open: false,
      timer: null,
    };
  },
  computed: {
    meet() {
      return this.hmsStore.meet;
    },
    dates() {
      return this.meet?.dates;
    },
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    isHost() {
      const roleName = this.hmsLocalPeer.roleName;
      return roleName === 'host' || roleName === 'co-host';
    },
    hmsPeers() {
      return this.hmsStore.hmsPeers.filter(
        (peer) => peer.roleName === 'host' || peer.roleName === 'co-host',
      );
    },
    hmsHLSState() {
      return this.hmsStore.hmsHLSState;
    },
    isRunning() {
      return this.hmsHLSState?.running;
    },
    sizeClass() {
      return this.size === 'md' ? 'h-10 w-10 text-xl' : 'h-6 w-6 text-sm';
    },
  },
  mounted() {
    this.handleStatus();
    this.timer = setInterval(() => {
      this.handleStatus();
    }, 50000);
  },
  unmounted() {
    clearInterval(this.timer);
  },
  methods: {
    handleStatus() {
      const { startDate, endDate } = this.dates || {};
      if (startDate && endDate) {
        const status = getCurrentTimeStatus(startDate, endDate);
        if (status === 'past') {
          clearInterval(this.timer);
          this.isHost && this.endRoom();
        }
      }
    },
    async leaveRoom() {
      await hmsActions.leave();
      this.hmsStore.end.show = true;
      this.hmsStore.openPopup = '';

      if (documentPictureInPicture.window) {
        this.hmsStore.showPIP = false;
        documentPictureInPicture.window.close();
        return;
      }
    },
    async endRoom() {
      const roleName = this.hmsLocalPeer.roleName;
      if (roleName === 'host' || roleName === 'co-host') {
        if (this.isRunning) {
          hmsActions.stopHLSStreaming();
        }
        await hmsActions.endRoom(false, 'End Room');
        this.hmsStore.end.show = true;
        this.hmsStore.openPopup = '';

        if (documentPictureInPicture.window) {
          this.hmsStore.showPIP = false;
          documentPictureInPicture.window.close();
          return;
        }
      } else {
        this.$toast.error(this.$t('meet.end.error'));
      }
    },
  },
};
</script>
