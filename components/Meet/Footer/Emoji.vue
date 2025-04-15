<template>
  <el-popover
    v-model:visible="open"
    :show-arrow="false"
    :width="sizeWidth"
    trigger="click"
    placement="top"
    :teleported="false"
    :persistent="false"
  >
    <template #reference>
      <div>
        <el-tooltip
          :disabled="$device.isMobile"
          effect="light"
          :content="$t('meet.footer.emoji.tooltip')"
          :hide-after="0"
          placement="top"
          popper-class="text-[#FAFAFA]"
          :teleported="false"
        >
          <div
            class="flex cursor-pointer items-center justify-center rounded-5 text-[#FAFAFA]"
            :class="[sizeClass, open ? 'bg-white/5' : 'hover:bg-white/5']"
          >
            <i class="fa-regular fa-face-smile" />
          </div>
        </el-tooltip>
      </div>
    </template>
    <div class="flex items-center justify-between p-1.5">
      <div
        v-for="emoji in emojis"
        :key="emoji.id"
        class="flex cursor-pointer items-center justify-center rounded-5"
        :class="iconClass"
        data-cy="02732b0ffa16fa96"
        @click="onEmoji(emoji)"
      >
        <!-- <div class="text-2xl">{{ emoji.i }}</div> -->
        <img :src="emoji.url" class="h-full w-full object-cover" alt="" />
      </div>
    </div>
  </el-popover>
</template>
<script>
import { selectSessionStore } from '@100mslive/hms-video-store';

import { hmsStore } from '~/utils/hms';

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
      emojiCount: 1,
      open: false,
      emojis: [
        {
          i: '😊',
          url: 'https://cdn.jsdelivr.net/npm/emoji-datasource-google@14.0.0/img/google/64/1f60a.png',
        },
        {
          i: '😍',
          url: 'https://cdn.jsdelivr.net/npm/emoji-datasource-google@14.0.0/img/google/64/1f61d.png',
        },
        {
          i: '😂',
          url: 'https://cdn.jsdelivr.net/npm/emoji-datasource-google@14.0.0/img/google/64/1f602.png',
        },
        {
          i: '😯',
          url: 'https://cdn.jsdelivr.net/npm/emoji-datasource-google@14.0.0/img/google/64/1f62f.png',
        },
        {
          i: '😢',
          url: 'https://cdn.jsdelivr.net/npm/emoji-datasource-google@14.0.0/img/google/64/1f613.png',
        },
        {
          i: '👋',
          url: 'https://cdn.jsdelivr.net/npm/emoji-datasource-google@14.0.0/img/google/64/1f44b.png',
        },
        {
          i: '👌',
          url: 'https://cdn.jsdelivr.net/npm/emoji-datasource-google@14.0.0/img/google/64/1f44c.png',
        },
        {
          i: '👍',
          url: 'https://cdn.jsdelivr.net/npm/emoji-datasource-google@14.0.0/img/google/64/1f44d.png',
        },
        {
          i: '👎',
          url: 'https://cdn.jsdelivr.net/npm/emoji-datasource-google@14.0.0/img/google/64/1f44e.png',
        },
        {
          i: '🔥',
          url: 'https://cdn.jsdelivr.net/npm/emoji-datasource-google@14.0.0/img/google/64/1f525.png',
        },
        {
          i: '🎉',
          url: 'https://cdn.jsdelivr.net/npm/emoji-datasource-google@14.0.0/img/google/64/1f389.png',
        },
      ],
      unsub: null,
      emojiList: [],
    };
  },
  computed: {
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    sizeClass() {
      return this.size === 'md' ? 'h-10 w-10 text-xl' : 'h-8 w-8 text-sm';
    },
    sizeWidth() {
      return this.size === 'md' ? 396 : 286;
    },
    iconClass() {
      return this.size === 'md' ? 'size-6' : 'size-5';
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
        this.emojiList = emojis || [];
      }, selectSessionStore('emojis'));
    },
    onEmoji(emoji) {
      const startingPoints = this.getStartingPoints(this.$device.isMobile);
      const startingPoint =
        startingPoints[this.emojiCount % startingPoints.length];

      hmsActions.sessionStore.set('emojis', [
        ...this.emojiList,
        {
          ...emoji,
          id: new Date().getTime(),
          wiggleType: Math.random() < 0.5 ? 0 : 1,
          startingPoint: `${startingPoint}%`,
          userId: this.hmsLocalPeer?.id,
          name: this.hmsLocalPeer?.name,
        },
      ]);
    },
    getStartingPoints(isMobile) {
      const arr = [];
      const min = 5;
      const max = isMobile ? 30 : 20;
      const inc = isMobile ? 8 : 5;
      for (let i = min; i <= max; i += inc) {
        arr.push(i);
      }
      return arr;
    },
  },
};
</script>
