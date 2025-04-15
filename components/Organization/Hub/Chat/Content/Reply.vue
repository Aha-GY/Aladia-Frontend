<template>
  <div class="relative flex items-center gap-1.5 overflow-hidden py-1">
    <div v-if="isDraft" class="px-2">
      <i class="fa-regular fa-reply text-xl text-[#FFC700]/80" />
    </div>
    <div
      class="relative flex w-full flex-1 cursor-pointer flex-col gap-1.5 rounded-5 px-2.5 py-1"
      :class="!isDraft ? 'bg-white/5' : ''"
      :style="
        !isDraft ? `background:  ${darkenColor(item.author?.color)} ` : ''
      "
      data-cy="bb4141c2bd25db6e"
      @click="$emit('locate-reply-message', item.id)"
    >
      <div
        class="absolute left-0 top-0 h-full w-[0.1875rem] rounded-l-5 bg-[#FFC700]/80"
        :style="!isDraft ? `background:${item.author?.color}` : ''"
      />

      <div class="flex flex-1 flex-col">
        <div v-if="isDraft" class="mb-0.5 text-sm text-[#FFC700]/80">
          {{ $t('flux.comment.replyTo') }} {{ item?.author?.fullname }}
        </div>
        <div
          v-else
          class="text-sm font-bold leading-none text-white/60"
          :style="`color:${item.author.color}`"
        >
          {{ item?.author?.fullname }}
        </div>
        <div
          class="ql-editor leading-3.5 max-h-16 !cursor-pointer overflow-auto !p-0 text-xs text-white/30 [&_p]:cursor-pointer"
          style="word-break: break-word"
          v-html="item.content"
        />
      </div>
      <div v-if="file">
        <div v-if="file.category === 'file'">
          <BaseEditorAttachment :files="[file]" :is-close="false" />
        </div>
        <img
          v-else-if="file.mimetype.includes('image')"
          class="mr-1 max-h-8 max-w-[2.5rem] cursor-pointer object-cover"
          :src="file.url"
        />
        <video
          v-else-if="file.mimetype.includes('video')"
          :src="file.url"
          class="mb-1 max-h-8 max-w-[2.5rem] object-cover"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
    isDraft: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  computed: {
    file() {
      return this.item.attachments && this.item.attachments.length > 0
        ? this.item.attachments[0]
        : this.item.attachment;
    },
  },
  methods: {
    darkenColor(color) {
      if (!color) {
        return;
      }
      let rgbValues;

      if (color.startsWith('#')) {
        const hex = color.slice(1);
        if (hex.length === 3) {
          rgbValues = hex.split('').map((h) => parseInt(h + h, 16));
        } else if (hex.length === 6) {
          rgbValues = hex.match(/.{2}/g).map((h) => parseInt(h, 16));
        } else {
          throw new Error(this.$t('org.color.error.hex'));
        }
      } else if (color.startsWith('rgb')) {
        rgbValues = color.match(/\d+/g).map(Number);
        if (rgbValues.length !== 3) {
          throw new Error(this.$t('org.color.error.rgb'));
        }
      } else {
        throw new Error(this.$t('org.color.error.unsupported'));
      }

      const darkenedValues = rgbValues.map((value) => Math.floor(value * 0.2));
      return `rgb(${darkenedValues.join(', ')})`;
    },
  },
};
</script>
