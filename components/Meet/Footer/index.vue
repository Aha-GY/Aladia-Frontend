<template>
  <div
    class="flex w-full items-center justify-between gap-2 pb-2.5 pl-2 pr-5 pt-1.5"
  >
    <div>
      <div v-if="width > 768" class="flex items-center gap-2">
        <el-tooltip
          :disabled="$device.isMobile"
          effect="light"
          :content="$t('index.copy.title')"
          placement="top"
          :hide-after="0"
        >
          <div
            class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
            data-cy="9e8ab38c05fd3138"
            @click="copyLink"
          >
            <i class="fa-regular fa-copy text-xl" />
          </div>
        </el-tooltip>
        <img
          v-if="courseImg"
          :src="courseImg"
          class="h-7 w-12 rounded-sm"
          alt=""
        />
        <div class="text-sm text-white">{{ hmsStore.meet?.eventName }}</div>
      </div>
    </div>
    <div
      class="flex items-center"
      :class="$device.isMobile ? 'gap-1' : 'gap-5'"
    >
      <client-only>
        <LazyMeetAudioSettings />
      </client-only>
      <MeetVideoSettings />
      <MeetFooterShare v-if="!$device.isMobile" />
      <MeetFooterEmoji />
      <MeetFooterHand />
      <MeetFooterMore />
      <MeetFooterLeave />
    </div>
    <MeetFooterRight v-if="width < 768" />
    <div v-else class="flex items-center gap-4">
      <el-tooltip
        effect="light"
        :disabled="$device.isMobile"
        :content="$t('meet.footer.emoji.participants')"
        placement="top"
        :hide-after="0"
      >
        <div
          class="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-5 text-xl"
          :class="
            hmsStore.openPopup === 'user'
              ? 'bg-white/5'
              : 'text-[#FAFAFA] hover:bg-white/5'
          "
          data-cy="1609bdcf46eef053"
          @click="toggleUser"
        >
          <i class="fa-regular fa-people-group" />
          <div
            class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E0B92C] px-1 text-xs font-medium text-black"
          >
            {{ handleLength(hmsPeers.length) }}
          </div>
        </div>
      </el-tooltip>
      <el-tooltip
        effect="light"
        :disabled="$device.isMobile"
        :content="$t('course.header.chat')"
        placement="top"
        :hide-after="0"
      >
        <div
          class="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-5 text-xl"
          :class="
            hmsStore.openPopup === 'chat'
              ? 'bg-white/5'
              : 'text-[#FAFAFA] hover:bg-white/5'
          "
          data-cy="0392ac634f9a6795"
          @click="toggleChat"
        >
          <i class="fa-regular fa-comments" />
          <div
            v-if="hmsMessages.length"
            class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E0B92C] px-1 text-xs font-medium text-black"
          >
            {{ handleLength(hmsMessages.length) }}
          </div>
        </div>
      </el-tooltip>
      <el-tooltip
        effect="light"
        :disabled="$device.isMobile"
        :content="$t('meet.footer.emoji.activities')"
        placement="top"
        :hide-after="0"
      >
        <div
          class="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-5 text-xl"
          :class="
            ['active', 'poll', 'quiz'].includes(hmsStore.openPopup)
              ? 'bg-white/5'
              : 'text-[#FAFAFA] hover:bg-white/5'
          "
          data-cy="b6b9c458ed86306f"
          @click="toggleActive"
        >
          <i class="fa-regular fa-shapes" />
          <div
            v-if="hmsPolls.length"
            class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E0B92C] px-1 text-xs font-medium text-black"
          >
            {{ handleLength(hmsPolls.length) }}
          </div>
        </div>
      </el-tooltip>
      <el-tooltip
        effect="light"
        :disabled="$device.isMobile"
        :content="$t('meet.settings')"
        placement="top"
        :hide-after="0"
      >
        <div
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-5 text-xl"
          :class="
            hmsStore.openPopup === 'setting'
              ? 'bg-white/5'
              : 'text-[#FAFAFA] hover:bg-white/5'
          "
          data-cy="ddcf8ec29764978d"
          @click="toggleSetting"
        >
          <i class="fa-regular fa-gear" />
        </div>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import { selectPeerMetadata } from '@100mslive/hms-video-store';

import { hmsActions, hmsStore } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    const { width } = useWindowSize();
    return { hmsStore, width };
  },
  data() {
    return {
      metaData: {},
      unsub1: null,
    };
  },
  computed: {
    courseImg() {
      return this.hmsStore.course?.thumbnail?.url;
    },
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    isHost() {
      const roleName = this.hmsLocalPeer.roleName;
      return roleName === 'host' || roleName === 'co-host';
    },
    hmsPeers() {
      return this.hmsStore.hmsPeers;
    },
    hmsMessages() {
      return this.hmsStore.hmsMessages.filter(
        (msg) => msg.type !== 'EMOJI_REACTION' && !msg.read,
      );
    },
    hmsPolls() {
      return this.hmsStore.hmsPolls.filter(
        (item) => item.visibility && item.state === 'started',
      );
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.metaData = hmsStore.getState(
        selectPeerMetadata(this.hmsLocalPeer.id),
      );
    },
    toggleActive() {
      this.hmsStore.openPopup =
        this.hmsStore.openPopup === 'active' ? '' : 'active';
    },
    toggleChat() {
      this.hmsStore.openPopup =
        this.hmsStore.openPopup === 'chat' ? '' : 'chat';
    },
    toggleUser() {
      this.hmsStore.openPopup =
        this.hmsStore.openPopup === 'user' ? '' : 'user';
    },
    toggleSetting() {
      this.hmsStore.openPopup =
        this.hmsStore.openPopup === 'setting' ? '' : 'setting';
    },
    async toggleBRB() {
      if (this.metaData?.isBRBOn) {
        this.metaData.isBRBOn = false;
      } else {
        this.metaData.isBRBOn = true;
        await hmsActions.lowerLocalPeerHand();
      }
      await hmsActions.changeMetadata(this.metaData);
    },
    copyLink() {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      this.$toast.success(this.$t('index.copy.success'));
    },
    handleLength(length) {
      return length > 99 ? '99+' : length;
    },
  },
};
</script>
