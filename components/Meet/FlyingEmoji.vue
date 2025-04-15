<template>
  <div
    class="botton-0 pointer-events-none absolute left-0 right-0 top-0 z-[999] h-full w-full select-none overflow-hidden"
  >
    <div
      v-for="emoji in emojis"
      :key="emoji.id"
      class="absolute bottom-0 flex flex-col items-center gap-1"
      :style="{
        left: emoji.startingPoint,
      }"
      :class="
        emoji.wiggleType === 0
          ? 'emoji-animation-right'
          : 'emoji-animation-left'
      "
      @animationend="removeEmoji(emoji.id)"
    >
      <img :src="emoji.url" class="object-cover" alt="" />
      <div class="rounded-5 bg-[#272932] px-2 py-1 text-xs text-white">
        {{ hmsLocalPeer.id === emoji.userId ? $t('meet.you') : emoji.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { selectSessionStore } from '@100mslive/hms-video-store';

import { hmsStore } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      flyAndFade: 'fly-and-fade',
      wiggleLeftRight: 'wiggle-left-right',
      wiggleRightLeft: 'wiggle-right-left',
      unsub: null,
      emojis: [],
    };
  },
  computed: {
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
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
      this.unsub = hmsStore.subscribe((emojis) => {
        this.emojis = emojis || [];
      }, selectSessionStore('emojis'));
    },
    removeEmoji(id) {
      hmsActions.sessionStore.set(
        'emojis',
        this.emojis.filter((emoji) => emoji.id !== id),
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.emoji-animation-right {
  animation:
    5s ease 0s 1 normal forwards running flyAndFade,
    1s ease-in-out 0s infinite alternate none running wiggleLeftRight;
}
.emoji-animation-left {
  animation:
    5s ease 0s 1 normal forwards running flyAndFade,
    1s ease-in-out 0s infinite alternate none running wiggleRightLeft;
}

@keyframes flyAndFade {
  20% {
    opacity: 1;
  }

  100% {
    bottom: 60%;
    opacity: 0;
  }
}
@keyframes wiggleLeftRight {
  0% {
    margin-left: -50px;
  }

  100% {
    margin-left: 50px;
  }
}
@keyframes wiggleRightLeft {
  20% {
    margin-left: 50px;
  }

  100% {
    margin-left: -50px;
  }
}
</style>
