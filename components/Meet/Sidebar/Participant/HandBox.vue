<template>
  <div v-if="hmsHandRaisedPeers.length" class="bg-[#0D0D0D] px-4 py-2">
    <div
      class="flex h-10 cursor-pointer items-center gap-2 rounded-5 p-1.5 text-[#FAFAFA]"
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
              : 'fa-hands'
          "
        />
      </div>
      <div
        class="flex h-6 items-center justify-center rounded-5 bg-[#262626] px-2 text-xs font-medium text-[#D4D4D4]"
      >
        {{ hmsHandRaisedPeers.length }}
      </div>
      <div class="ml-1 text-base">
        {{ $t('meet.partecipants.hand.title') }}
        <div class="text-xs font-medium text-[#707070]">
          {{ $t('meet.partecipants.hand.label') }}
        </div>
      </div>
      <div class="w-0 flex-1" />
      <div
        v-if="isHost"
        class="flex h-6 items-center rounded-5 px-1.5 text-xs font-medium text-[#FAFAFA] hover:bg-white/5"
        @click="lowerRaiseHand()"
      >
        {{ $t('meet.partecipants.hand.lowerAll') }}
      </div>
    </div>
    <el-collapse-transition>
      <div v-if="open">
        <div
          v-for="peer in hmsHandRaisedPeers"
          :key="peer.id"
          class="flex items-center gap-2 rounded-5 py-1.5 pl-0.5 pr-1.5 hover:bg-white/5"
        >
          <BaseAvatarNext
            :picture="peer.picture"
            size="md"
            :online="peer.online"
          />
          <div class="w-0 flex-1">
            <div class="truncate text-base text-[#F1F1F1]">
              {{ peer.name || peer.fullName || peer.email }}
              <span v-if="hmsLocalPeer.id === peer.id">
                ({{ $t('meet.you') }})
              </span>
            </div>
            <!-- <div class="text-xs font-medium text-[#707070]">
              {{
                peer.online
                  ? $t('base.member.online')
                  : $t('base.member.offline')
              }}
            </div> -->
          </div>
          <div
            class="group/item relative h-6 w-6 shrink-0 cursor-pointer text-xs text-[#FAFAFA]"
          >
            <div
              v-if="isHost || peer.id === hmsLocalPeer.id"
              class="absolute right-0 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-5 px-1.5 font-medium opacity-0 transition-all duration-300 hover:bg-white/5 group-hover/item:w-12 group-hover/item:opacity-100"
              @click="lowerRaiseHand(peer.id)"
            >
              {{ $t('meet.partecipants.hand.lower') }}
            </div>
            <div
              class="flex h-6 w-6 items-center justify-center rounded-5 hover:bg-white/5"
              :class="
                isHost || peer.id === hmsLocalPeer.id
                  ? 'group-hover/item:opacity-0'
                  : ''
              "
            >
              <i class="fa-regular fa-hand" />
            </div>
          </div>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import {
  selectPeerMetadata,
  selectSessionStore,
} from '@100mslive/hms-video-store';

import { hmsStore, hmsActions } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    const hubEvent = useHubEventStore();
    return { hmsStore, hubEvent };
  },
  data() {
    return {
      hover: false,
      handHover: false,
      open: true,
      unsub: null,
      handIds: [],
    };
  },
  computed: {
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    isHost() {
      const roleName = this.hmsLocalPeer.roleName;
      return roleName === 'host' || roleName === 'co-host';
    },
    hmsHandRaisedPeers() {
      const list = cloneDeep(this.hmsStore.hmsHandRaisedPeers);
      list.sort(
        (a, b) => this.handIds.indexOf(a.id) - this.handIds.indexOf(b.id),
      );
      return list.map((peer) => {
        const metadata = hmsStore.getState(selectPeerMetadata(peer.id));
        return {
          ...peer,
          picture: metadata?.picture,
          userId: metadata?.userId,
          online: true,
        };
      });
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
        this.handIds = ids || [];
      }, selectSessionStore('handIds'));
    },
    lowerRaiseHand(peerId) {
      if (peerId) {
        if (peerId === this.hmsLocalPeer.id) {
          hmsActions.lowerLocalPeerHand();
        } else {
          hmsActions.lowerRemotePeerHand(peerId);
        }
      } else {
        this.hmsHandRaisedPeers.forEach((peer) => {
          hmsActions.lowerRemotePeerHand(peer.id);
        });
      }
    },
  },
};
</script>
