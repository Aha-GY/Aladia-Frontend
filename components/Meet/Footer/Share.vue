<template>
  <el-popover
    :visible="open"
    trigger="click"
    :show-arrow="false"
    :width="isShare ? 208 : 126"
    placement="top"
    :teleported="false"
    :persistent="false"
  >
    <template #reference>
      <div ref="btnRef" @click="onClick">
        <el-tooltip
          effect="light"
          :content="$t('meet.screen.share.window')"
          placement="top"
          :hide-after="0"
          popper-class="text-[#FAFAFA]"
          :teleported="false"
        >
          <div
            class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-5 text-xl text-[#FAFAFA]"
            :class="[open || isShare ? 'bg-white/5' : 'hover:bg-white/5']"
          >
            <i class="fa-regular fa-square-arrow-up" />
          </div>
        </el-tooltip>
      </div>
    </template>

    <div class="flex flex-col gap-2.5 p-1.5 text-sm text-[#E5E5E5]">
      <div
        v-if="!isShare"
        class="flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
        data-cy="a1ddcb4bed2d257d"
        @click="toggleScreen"
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <i class="fa-solid fa-display" />
        </div>
        {{ $t('meet.screen.label') }}
      </div>
      <div
        v-if="isAdmin && !isShare"
        class="flex items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
        :class="
          !hmsWhiteboard?.open || (hmsWhiteboard?.open && isOwner)
            ? 'cursor-pointer'
            : 'pointer-events-none cursor-not-allowed opacity-50'
        "
        data-cy="167a3e91475971e6"
        @click="toggleWhiteboard"
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <i class="fa-solid fa-scribble" />
        </div>
        {{ $t('meet.screen.whiteBoard') }}
      </div>
      <div
        v-if="!isShare && !isPip"
        class="flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
        data-cy="74e5e7a3f4e4ae66"
        @click="togglePDF"
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <i class="fa-solid fa-file" />
        </div>
        {{ $t('meet.screen.share.pdf') }}
      </div>
      <div
        v-if="isShare"
        class="flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
        data-cy="4c7c15bddc0ae1b1"
        @click="onStop"
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <i class="fa-solid fa-window-restore" />
        </div>
        {{ $t('meet.screen.present') }}
      </div>
      <div
        v-if="isShare"
        class="flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/5"
        data-cy="4574713c6b764242"
        @click="
          onStop();
          open = false;
        "
      >
        <div class="flex h-5 w-5 items-center justify-center">
          <i class="fa-solid fa-square-xmark" />
        </div>
        {{ $t('meet.screen.stop.present') }}
      </div>
    </div>
  </el-popover>
</template>
<script>
import { selectSessionStore } from '@100mslive/hms-video-store';

import { hmsStore, hmsActions } from '~/utils/hms';

export default {
  props: {
    isPip: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const hmsStore = useHmsStore();
    const btnRef = ref(null);
    const open = ref(false);
    onClickOutside(
      btnRef,
      () => {
        open.value = false;
      },
      { ignore: ['.el-popper'] },
    );
    return { hmsStore, btnRef, open };
  },
  data() {
    return {
      // open: false,
      isAdmin: null,
      unsub: null,
      shareIds: [],
    };
  },
  computed: {
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    peer() {
      return this.hmsStore.hmsPeerScreenSharing;
    },
    isSame() {
      return this.hmsLocalPeer.id === this.peer.id;
    },
    hmsPermissions() {
      return this.hmsStore.hmsPermissions;
    },
    hmsWhiteboard() {
      return this.hmsStore.hmsWhiteboard;
    },
    hmsIsSomeoneScreenSharing() {
      return this.hmsStore.hmsIsSomeoneScreenSharing;
    },
    isOwner() {
      return this.hmsLocalPeer.customerUserId === this.hmsWhiteboard?.owner;
    },
    isShare() {
      return (
        this.hmsStore.hmsIsLocalScreenShared ||
        (this.hmsWhiteboard?.open && this.isOwner)
      );
    },
  },
  mounted() {
    this.init();
  },
  beforeUnmount() {
    if (this.unsub) {
      this.unsub();
    }
  },
  methods: {
    init() {
      this.unsub = hmsStore.subscribe((ids) => {
        this.shareIds = ids || [];
      }, selectSessionStore('shareIds'));

      const permissions = this.hmsPermissions?.whiteboard; // Array<'read' | 'write' | 'admin'>
      this.isAdmin = !!permissions?.includes('admin');
    },
    onClick() {
      // if (this.isPip) {
      //   hmsActions.setScreenShareEnabled(!this.hmsStore.hmsIsLocalScreenShared);
      //   if (this.hmsStore.hmsIsLocalScreenShared) {
      //     hmsActions.sessionStore.set(
      //       'shareIds',
      //       this.shareIds.filter((id) => id !== this.hmsLocalPeer.id),
      //     );
      //   } else {
      //     this.handleShareIds();
      //   }
      // } else {
      this.open = !this.open;
      // }
    },
    handleShareIds() {
      if (!this.shareIds.includes(this.hmsLocalPeer.id)) {
        hmsActions.sessionStore.set('shareIds', [
          ...this.shareIds,
          this.hmsLocalPeer.id,
        ]);
      }
    },
    async toggleScreen() {
      if (this.hmsIsSomeoneScreenSharing && !this.isPip) {
        this.hmsStore.dialog.share = true;
      } else {
        await hmsActions.setScreenShareEnabled(
          !this.hmsStore.hmsIsLocalScreenShared,
        );
        this.handleShareIds();
      }
      this.open = false;
    },
    async toggleWhiteboard() {
      if (!this.isAdmin) {
        return;
      }
      if (this.hmsWhiteboard?.open) {
        if (this.isOwner) {
          await hmsActions.interactivityCenter.whiteboard.close(
            this.hmsWhiteboard.id,
          );
          hmsActions.sessionStore.set(
            'shareIds',
            this.shareIds.filter((id) => id !== this.hmsLocalPeer.id),
          );
        }
      } else {
        await hmsActions.interactivityCenter.whiteboard.open();
        this.handleShareIds();
      }
      this.open = false;
    },
    togglePDF() {
      this.hmsStore.dialog.pdf = true;
      this.open = false;
    },
    // async otherShare() {
    //   await hmsActions.setScreenShareEnabled(false);
    //   await hmsActions.setScreenShareEnabled(true);
    // },
    async onStop() {
      if (this.hmsWhiteboard?.open && this.isOwner) {
        await hmsActions.interactivityCenter.whiteboard.close(
          this.hmsWhiteboard?.id,
        );
      }
      if (this.hmsStore.hmsIsLocalScreenShared) {
        await hmsActions.setScreenShareEnabled(false);
      }
      hmsActions.sessionStore.set(
        'shareIds',
        this.shareIds.filter((id) => id !== this.hmsLocalPeer.id),
      );
    },
  },
};
</script>
