<template>
  <div
    class="relative rounded-md bg-black px-4 py-2 transition-all duration-300"
  >
    <div class="flex w-full flex-col gap-1">
      <BaseEmoji
        :is-emoji="isEmoji"
        @on-hide="isEmoji = false"
        @on-emoji="onEmoji"
      />
      <BaseEditorAttachment :files="files" @remove="remove" />
      <div class="flex gap-2">
        <client-only>
          <LazyBaseEditor
            :value="answerBody"
            :placeholder="$t('post.create.new.placeholder')"
            :focus="focus"
            @on-input="($event) => (answerBody = $event)"
            @on-ready="onReady"
            @on-focus="focus = true"
            @on-blur="focus = false"
          />
        </client-only>
        <div
          v-show="focus || answerBody"
          class="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center text-white/50 transition-all hover:text-white active:scale-95"
          data-cy="ed880c1212637824"
          @click="answerBody = ''"
        >
          <i class="fa-light fa-close text-base" />
        </div>
      </div>
      <div class="flex items-center justify-between gap-2">
        <BaseEditorActions
          :is-emoji="isEmoji"
          :answer-body="answerBody"
          :upload="upload"
          @on-change-emoji="isEmoji = !isEmoji"
        />
        <div
          class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-white/70 transition-all hover:text-white/90 active:scale-95"
          data-cy="191e5c9c60d00bc0"
          @click="onSend"
        >
          <i class="fa-solid fa-paper-plane-top" />
        </div>
      </div>
    </div>

    <div
      class="absolute bottom-0 left-0 right-0 top-0 z-20 cursor-pointer rounded transition-all duration-300 hover:bg-black/30"
      data-cy="468f775bc8513d3f"
      @click="handleMaskClick"
    />
  </div>
</template>

<script>
export default {
  props: {
    replyItem: Object,
    onReply: Function,
    isLateral: Boolean,
  },
  setup() {
    const searchStore = useSearchStore();
    const socialStore = useSocialStore();
    return { socialStore, searchStore };
  },
  data() {
    return {
      focus: false,
      answerBody: '',
      isEmoji: false,
      quill: null,
      files: [],
    };
  },
  mounted() {
    document.addEventListener('paste', this.onPaste);
  },
  beforeUnmount() {
    document.removeEventListener('paste', this.onPaste);
  },
  methods: {
    onPaste(event) {
      const file = event.clipboardData.files[0];
      if (file) {
        this.upload(file);
      }
    },
    onReady(quill) {
      this.quill = quill;
    },
    onEmoji(emoji) {
      if (emoji) {
        const cursor = this.quill.selection.savedRange.index;
        this.quill.insertEmbed(cursor, emoji);
        this.quill.setSelection(cursor + emoji.length);
      }
    },
    upload(file) {
      this.files.push(file);
    },
    remove(file) {
      this.files = this.files.filter((item) => item !== file);
    },
    async onSend() {
      //
    },
    extractUrl(text) {
      const UrlRegExp =
        /\b(?:https?:\/\/|www\.)[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:[^\s<>[\]{}]*)\b/;
      const match = text.match(UrlRegExp);
      return match ? match[0] : null;
    },
    async handleMaskClick(event) {
      event.stopImmediatePropagation();

      if (this.searchStore.isFocus) {
        return;
      }

      this.socialStore.profileCreatingPost = true;
      this.searchStore.type = 'social';

      await sleep(400);
      this.searchStore.isFocus = true;
      await sleep(400);

      this.socialStore.answerCollapse = true;
      this.socialStore.answerReplying = true;
    },
  },
};
</script>
