<template>
  <div class="relative flex h-0 w-full flex-1">
    <MeetConferencePIP
      :spotlight-id="spotlightId"
      :pin-id="pinId"
      :share-ids="shareIds"
    />
    <div
      class="flex h-full gap-4"
      :class="[
        width < 960 ? 'w-0 flex-1 flex-col' : 'w-full',
        hmsStore.showPIP && !pdfConfig
          ? 'pointer-events-none absolute opacity-0'
          : '',
      ]"
    >
      <div
        v-if="hmsIsSomeoneScreenSharing || hmsWhiteboard?.open || pdfConfig"
        class="relative z-10 flex w-full justify-around gap-4"
        :class="width < 960 ? 'h-0 flex-1' : 'h-full'"
      >
        <MeetConferenceWhiteboard v-if="hmsWhiteboard?.open" />
        <MeetConferenceScreenShare
          v-else-if="!pdfConfig"
          :peer="peer"
          :pin-id="pinId || hmsStore.pinId"
          :share-ids="shareIds"
        />
        <MeetConferencePDFShare v-if="pdfConfig" />
      </div>
      <MeetConferenceSpotlightView
        v-if="spotlightId || hmsStore.spotlightId"
        :spotlight-id="spotlightId"
        :pin-id="pinId"
        :share-ids="shareIds"
      />
      <MeetConferenceGalleryView
        v-else
        :is-sharing="
          !!hmsWhiteboard?.open || !!hmsIsSomeoneScreenSharing || !!pdfConfig
        "
        :spotlight-id="spotlightId"
        :is-popup="isSidebar"
        :pin-id="pinId"
        :share-ids="shareIds"
        :class="width < 960 ? 'h-[5rem] shrink-0' : 'h-full w-0'"
      />
    </div>
    <div
      v-if="isSidebar && !$device.isMobile"
      class="relative ml-4 h-full shrink-0 overflow-hidden"
      :class="width <= 960 ? 'w-[22.5rem]' : 'w-[25.75rem]'"
    >
      <Transition name="slide-fade-left">
        <MeetSidebarChat v-if="hmsStore.openPopup === 'chat'" />
        <MeetSidebarParticipant v-else-if="hmsStore.openPopup === 'user'" />
        <MeetSidebarQuizzes v-else-if="hmsStore.openPopup === 'quiz'" />
        <MeetSidebarPolls v-else-if="hmsStore.openPopup === 'poll'" />
        <MeetSidebarActive v-else-if="hmsStore.openPopup === 'active'" />
        <MeetSidebarSetting v-else-if="hmsStore.openPopup === 'setting'" />
        <MeetSidebarVisualEffects v-else-if="hmsStore.openPopup === 'visual'" />
      </Transition>
    </div>
  </div>
</template>
<script>
import { selectSessionStore } from '@100mslive/hms-video-store';

import { hmsActions, hmsStore } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    const { width } = useWindowSize();
    return { hmsStore, width };
  },
  data() {
    return {
      unsub1: null,
      unsub2: null,
      unsub3: null,
      spotlightId: null,
      pinId: null,
      shareIds: [],
    };
  },
  computed: {
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    hmsIsSomeoneScreenSharing() {
      return this.hmsStore.hmsIsSomeoneScreenSharing;
    },
    pdfConfig() {
      return this.hmsStore.pdfConfig;
    },
    hmsWhiteboard() {
      return this.hmsStore.hmsWhiteboard;
    },
    isSidebar() {
      return !![
        'chat',
        'user',
        'poll',
        'active',
        'quiz',
        'setting',
        'visual',
      ].includes(this.hmsStore.openPopup);
    },
    sharingId() {
      const ids = this.hmsStore.hmsPeers.map((r) => r.id);
      const shareIds = this.shareIds.filter((r) => ids.includes(r));
      let id = shareIds[shareIds.length - 1];
      if (ids.includes(this.pinId || this.hmsStore.pinId)) {
        id = this.pinId || this.hmsStore.pinId;
      }
      return id;
    },
    peer() {
      return (
        this.hmsStore.hmsPeersScreenSharing.find(
          (peer) => peer.id === this.sharingId,
        ) || {}
      );
    },
    hmsIsLocalScreenShared() {
      return this.hmsStore.hmsIsLocalScreenShared;
    },
  },
  watch: {
    hmsIsLocalScreenShared() {
      if (!this.hmsIsLocalScreenShared) {
        this.hmsStore.pdfConfig = null;
        hmsActions.sessionStore.set(
          'shareIds',
          this.shareIds.filter((id) => id !== this.hmsLocalPeer.id),
        );
      }
    },
  },
  mounted() {
    this.init();
  },
  beforeUnmount() {
    if (this.unsub1) {
      this.unsub1();
    }
    if (this.unsub2) {
      this.unsub2();
    }
    if (this.unsub3) {
      this.unsub3();
    }
  },
  methods: {
    init() {
      hmsActions.sessionStore.observe([
        'emojis',
        'pinId',
        'spotlightId',
        'msgPins',
        'shareIds',
        'handIds',
      ]);

      this.unsub1 = hmsStore.subscribe((id) => {
        this.spotlightId = id;
      }, selectSessionStore('spotlightId'));
      this.unsub2 = hmsStore.subscribe((id) => {
        this.pinId = id;
      }, selectSessionStore('pinId'));
      this.unsub3 = hmsStore.subscribe((ids) => {
        this.shareIds = ids || [];
      }, selectSessionStore('shareIds'));
    },
  },
};
</script>
