<template>
  <div class="bg-[#0D0D0D] px-2 pb-3">
    <div class="flex h-10 items-center gap-2">
      <div class="flex h-6 w-6 items-center justify-center">
        <i class="fa-regular fa-bolt text-xs text-[#707070]" />
      </div>
      <div class="text-base text-[#FAFAFA]">
        {{ $t('meet.actions.quick') }}
      </div>
    </div>
    <div class="mt-2 grid grid-cols-4 gap-y-4">
      <div
        v-if="hmsPermissions.hlsStreaming"
        class="flex cursor-pointer flex-col items-center gap-2.5"
        data-cy="ba53e377bdf72c29"
        @click="toggleRecording"
      >
        <div
          class="relative flex h-[4.375rem] w-[4.375rem] items-center justify-center rounded-5 bg-white/10 transition-all hover:bg-white/5 active:scale-95"
        >
          <i
            class="fa-regular fa-record-vinyl fill-color text-3xl text-[#FAFAFA]"
            style="
              background: linear-gradient(180deg, #4f85ee 0%, #00c9a7 100%);
            "
          />
          <div
            v-if="isRunning"
            class="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-bl-5 bg-[#060606]"
          >
            <div class="h-2.5 w-2.5 rounded-full bg-[#AE2B26]" />
          </div>
        </div>
        <div class="text-center text-xs text-[#D9D9D9]">
          {{ isRunning ? $t('meet.actions.stop') : $t('meet.actions.start') }}
          <br />
          {{ $t('meet.actions.recording') }}
        </div>
      </div>
      <div
        class="flex cursor-pointer flex-col items-center gap-2.5"
        data-cy="65b70dc76921c5f1"
        @click="onQuizzes"
      >
        <div
          class="flex h-[4.375rem] w-[4.375rem] items-center justify-center rounded-5 bg-white/10 transition-all hover:bg-white/5 active:scale-95"
        >
          <i
            class="fa-regular fa-comments-question fill-color text-3xl text-[#FAFAFA]"
            style="
              background: linear-gradient(
                146deg,
                #00c9a7 11.64%,
                #ff9671 88.36%
              );
            "
          />
        </div>
        <div class="text-center text-xs text-[#D9D9D9]">
          {{ $t('meet.banner.quiz.label') }}
        </div>
      </div>
      <div
        class="flex cursor-pointer flex-col items-center gap-2.5"
        data-cy="6e930fb6900e6934"
        @click="onPoll"
      >
        <div
          class="flex h-[4.375rem] w-[4.375rem] items-center justify-center rounded-5 bg-white/10 transition-all hover:bg-white/5 active:scale-95"
        >
          <i
            class="fa-regular fa-poll-people fill-color text-3xl text-[#FAFAFA]"
            style="
              background: linear-gradient(180deg, #4f85ee 0%, #00c9a7 100%);
            "
          />
        </div>
        <div class="text-center text-xs text-[#D9D9D9]">
          {{ $t('meet.banner.poll.title') }}
        </div>
      </div>
      <div
        v-if="isAdmin"
        class="flex flex-col items-center gap-2.5"
        :class="
          !hmsWhiteboard?.open || (hmsWhiteboard?.open && isOwner)
            ? 'cursor-pointer'
            : 'pointer-events-none cursor-not-allowed opacity-50'
        "
        data-cy="77d6f67c7e91c910"
        @click="toggleWhiteboard"
      >
        <div
          class="flex h-[4.375rem] w-[4.375rem] items-center justify-center rounded-5 bg-white/10 transition-all hover:bg-white/5 active:scale-95"
        >
          <i
            class="fa-regular fa-scribble fill-color text-3xl text-[#FAFAFA]"
            style="
              background: linear-gradient(180deg, #00c9a7 0%, #ff9671 100%);
            "
          />
        </div>
        <div class="text-center text-xs text-[#D9D9D9]">
          {{
            hmsWhiteboard?.open
              ? $t('meet.actions.stop')
              : $t('meet.actions.create')
          }}
          <br />
          {{ $t('meet.actions.whiteboard') }}
        </div>
      </div>
      <div
        class="flex cursor-pointer flex-col items-center gap-2.5"
        data-cy="7fd005b99179bc30"
        @click="hmsStore.dialog.pdf = true"
      >
        <div
          class="flex h-[4.375rem] w-[4.375rem] items-center justify-center rounded-5 bg-white/10 transition-all hover:bg-white/5 active:scale-95"
        >
          <i
            class="fa-regular fa-file-pdf fill-color text-3xl text-[#FAFAFA]"
            style="
              background: linear-gradient(
                146deg,
                #00c9a7 11.64%,
                #ff9671 88.36%
              );
            "
          />
        </div>
        <div class="text-center text-xs text-[#D9D9D9]">
          {{ $t('meet.screen.share.pdf') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { selectSessionStore } from '@100mslive/hms-video-store';

import { hmsActions, hmsStore } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      isAdmin: null,
    };
  },
  computed: {
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    hmsHLSState() {
      return this.hmsStore.hmsHLSState;
    },
    isRunning() {
      return this.hmsHLSState?.running;
    },
    hmsPermissions() {
      return this.hmsStore.hmsPermissions;
    },
    hmsWhiteboard() {
      return this.hmsStore.hmsWhiteboard;
    },
    isOwner() {
      return this.hmsLocalPeer.customerUserId === this.hmsWhiteboard?.owner;
    },
    hmsIsSomeoneScreenSharing() {
      return this.hmsStore.hmsIsSomeoneScreenSharing;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const permissions = this.hmsPermissions?.whiteboard; // Array<'read' | 'write' | 'admin'>
      this.isAdmin = !!permissions?.includes('admin');
    },
    toggleRecording() {
      if (this.isRunning) {
        this.hmsStore.dialog.stophls = true;
      } else {
        this.hmsStore.dialog.hls = true;
      }
    },
    async toggleWhiteboard() {
      if (!this.isAdmin) {
        return;
      }
      const shareIds = hmsStore.getState(selectSessionStore('shareIds')) || [];
      if (this.hmsWhiteboard?.open) {
        if (this.isOwner) {
          await hmsActions.interactivityCenter.whiteboard.close(
            this.hmsWhiteboard.id,
          );

          hmsActions.sessionStore.set(
            'shareIds',
            shareIds.filter((id) => id !== this.hmsLocalPeer.id),
          );
        }
      } else {
        await hmsActions.interactivityCenter.whiteboard.open();
        if (!shareIds.includes(this.hmsLocalPeer.id)) {
          hmsActions.sessionStore.set('shareIds', [
            ...shareIds,
            this.hmsLocalPeer.id,
          ]);
        }
      }
    },
    async onQuizzes() {
      this.hmsStore.pollId = null;
      this.hmsStore.openPopup = 'quiz';
    },
    async onPoll() {
      this.hmsStore.pollId = null;
      this.hmsStore.openPopup = 'poll';
    },
  },
};
</script>
<style scope lang="scss">
.fill-color {
  -webkit-text-fill-color: transparent;
  background-clip: text !important;
}
</style>
