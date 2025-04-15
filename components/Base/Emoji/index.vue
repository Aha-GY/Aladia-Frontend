<template>
  <div
    ref="emoji"
    class="__base-emoji absolute left-2 z-40 h-[25rem] w-[18.75rem] rounded-xl border border-white/20 bg-black shadow-[0px_2px_6px_#000000] transition-all duration-300"
    :class="
      isEmoji
        ? 'bottom-10 opacity-100'
        : 'pointer-events-none bottom-12 opacity-0'
    "
  >
    <div>
      <div class="flex p-1 text-sm transition-all">
        <div
          class="w-20 cursor-pointer border-white/60 py-2 text-center"
          :class="type === 'emoji' ? 'border-b-[0.0625rem]' : ''"
          data-cy="e17edc1055191301"
          @click="type = 'emoji'"
        >
          {{ $t('base.upload.emoji') }}
        </div>
        <el-tooltip
          v-if="hideGif && withActionTooltip"
          :content="toolTipContent"
          effect="light"
          placement="top"
        >
          <button
            class="w-20 border-white/60 py-2 text-center"
            :class="[
              type === 'gif' ? 'border-b-[0.0625rem]' : '',
              hideGif ? 'cursor-not-allowed text-[#707007]' : '',
            ]"
            data-cy="a7a8c572c607e10b"
            disabled
          >
            {{ $t('base.upload.gif') }}
          </button>
        </el-tooltip>
        <div
          v-if="!hideGif"
          class="w-20 cursor-pointer border-white/60 py-2 text-center"
          :class="type === 'gif' ? 'border-b-[0.0625rem]' : ''"
          data-cy="a7a8c572c607e10b"
          @click="type = 'gif'"
        >
          {{ $t('base.upload.gif') }}
        </div>
      </div>
      <LazyBaseEmojiPicker v-show="type === 'emoji'" @change="onSelectEmoji" />
      <LazyBaseEmojiGif
        v-show="type === 'gif'"
        :initial-gifs="gifs"
        :initialial-page="1"
        @select="$emit('onGif', $event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isEmoji: {
      type: Boolean,
      default: false,
    },
    autoHide: {
      type: Boolean,
      default: true,
    },
    hideGif: {
      type: Boolean,
      default: false,
    },
    toolTipContent: {
      type: String,
      default: '',
    },
    withActionTooltip: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['onEmoji', 'onHide', 'onGif'],
  setup(props, { emit }) {
    const emoji = ref(null);
    onClickOutside(
      emoji,
      () => {
        emit('onHide', false);
      },
      { ignore: ['.btn-emoji'] },
    );
    return { emoji };
  },
  data() {
    return {
      type: 'emoji',
      loading: false,
      gifs: [],
    };
  },
  watch: {
    hideGif(newVal) {
      if (newVal) {
        this.type = 'emoji';
      }
    },
    type(newVal) {
      if (newVal === 'gif') {
        this.fetchGifs();
      }
    },
  },
  methods: {
    onSelectEmoji(emoji) {
      if (this.autoHide) {
        this.$emit('onHide', false);
      }
      this.$emit('onEmoji', emoji.i);
    },
    async fetchGifs() {
      if (this.loading) {
        return;
      }

      this.loading = true;

      const params = {
        q: this.searchQuery || undefined,
        limit: 9,
        offset: 0,
      };

      try {
        const response = await searchGifs(params);
        this.gifs = [...response.data];
      } catch (error) {
        console.error('Error fetching GIFs:', error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
