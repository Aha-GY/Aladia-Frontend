<template>
  <div class="__mention-creation">
    <BaseEmoji
      :is-emoji="showEmoji"
      :auto-hide="false"
      class="!left-auto !right-2"
      :hide-gif="type === 'textarea' || hideGifPicker"
      :tool-tip-content="toolTipContent"
      :with-action-tooltip="true"
      @on-emoji="onEmoji"
      @on-hide="showEmoji = false"
      @on-gif="onGif"
    />
    <div
      class="relative ml-2 flex flex-col gap-5 overflow-y-auto border-l-[1px] border-[#b0b0b0] bg-[#0e0e0e] pl-8 pt-1"
    >
      <div class="!max-h-[15vh] overflow-y-auto">
        <BaseEditorQuill
          v-model="content"
          :name="name"
          :type="'quill-editor'"
          :area-height="computedAreaHeight"
          :enable="!loading"
          :get-tag-list="getTagList"
          :data-cy="dataCy"
          :auto-focus="autoFocus"
          :limit-character="limitCharacter"
          :characters-limit="charactersLimit"
          @ready="onReady"
          @tag="taggedUsers = $event"
          @change="onChange"
          @text="onText"
          @focus="$emit('focus', $event)"
        />
      </div>

      <PostsItemMentionItem
        v-if="item"
        :item="item"
        class="hide-scrollbar mb-10 mr-2 max-h-[35vh] overflow-y-auto rounded-5 border-[1px] border-[#b0b0b0]"
      />
    </div>
    <div class="absolute inset-x-0 bottom-0 z-50 bg-[#0e0e0e]">
      <BaseEditorMedia
        v-if="shouldShowMedia"
        :files="files"
        :looms="loomFiles"
        @remove="onRemoveFile"
        @item-click="onLoomClick"
        @show="showAllMedia = true"
      />
      <BaseEditorGif v-if="showGif" class="py-2" />

      <BaseEditorAllMedias
        v-if="showAllMedia"
        class="overflow-y-auto"
        :style="{ height: areaHeight }"
        :medias="[...files, ...loomFiles]"
        :editor-loading="loading"
        @remove="onRemoveFile"
        @item-click="onLoomClick"
        @back="showAllMedia = false"
      />

      <div class="flex items-end justify-between pr-1">
        <client-only>
          <el-popover
            v-model:visible="showAction"
            placement="top-start"
            :show-arrow="false"
            width="100%"
            trigger="click"
            :teleported="false"
            popper-class="flex justify-center"
            :popper-style="{
              padding: '0px !important',
              borderColor: 'transparent',
              width: '15rem',
            }"
          >
            <BaseEditorActionToolTip
              :location-allowed="locationAllowed"
              :has-gif="hasGif"
              :tool-tip-content="toolTipContent"
              :show-loom="showLoom"
              :show-file="showFile"
              @upload="onUpload"
              @loom="onLoomUpload"
            />
            <template #reference>
              <div
                class="flex size-[1.875rem] cursor-pointer items-center justify-center rounded-[0.3125rem] text-white/60 hover:bg-[#151515] hover:text-white/80 active:scale-95"
              >
                <i class="fa-solid fa-plus" />
              </div>
            </template>
          </el-popover>
        </client-only>
        <div class="flex flex-1 items-center justify-end gap-[0.63rem]">
          <div
            v-if="limitCharacter"
            class="flex gap-[0.3rem] rounded px-2 text-sm text-gray-500"
            :class="{
              'font-bold text-red-500': plainText.length >= charactersLimit,
            }"
          >
            <div>
              <i
                v-if="plainText.length >= charactersLimit"
                class="fa-solid fa-circle-exclamation"
              />
            </div>
            <div>{{ plainText.length }}/{{ charactersLimit }}</div>
          </div>

          <div
            class="btn-emoji flex size-[1.875rem] cursor-pointer items-center justify-center rounded-[0.3125rem] text-white/60 hover:bg-[#151515] hover:text-white/80 active:scale-95"
            :data-cy="`${dataCy}-emoji-popup-trigger`"
            @click="showEmoji = !showEmoji"
          >
            <i
              class="fa-regular fa-face-smile ml-[0.12] mt-[0.21rem] cursor-pointer text-white/60 hover:text-white/80"
            />
          </div>
          <div
            class="flex size-[1.875rem] cursor-pointer items-center justify-center rounded-[0.3125rem] text-white/60 hover:bg-[#151515] hover:text-white/80 active:scale-95"
            @click="onSend"
          >
            <i v-if="loading" class="fa-solid fa-spinner animate-spin" />
            <i
              v-else
              class="fa-solid fa-send ml-[0.12] mt-[0.21rem]"
              :class="loading ? 'pointer-events-none' : ''"
              :data-cy="`${dataCy}-send-button`"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null,
    },
    name: {
      type: String,
      default: 'quill-editor',
    },
    modelValue: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'line',
    },
    uniformBg: {
      type: Boolean,
      default: false,
    },
    areaHeight: {
      type: String,
      default: '20rem',
    },
    editorClass: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    autoFocus: {
      type: Boolean,
      default: true,
    },
    autoClear: {
      type: Boolean,
      default: true,
    },
    sendWhitespace: {
      type: Boolean,
      default: false,
    },
    getTagList: {
      type: Function,
    },
    dataCy: {
      type: String,
      default: 'default',
    },
    isAction: {
      type: Boolean,
      default: true,
    },
    initFiles: {
      type: Array,
      default: () => [],
    },
    initLoomFiles: {
      type: Array,
      default: () => [],
    },
    locationAllowed: {
      type: Boolean,
      default: false,
    },
    toolTipContent: {
      type: String,
      default: '',
    },
    limitCharacter: {
      type: Boolean,
      default: false,
    },
    charactersLimit: {
      type: Number,
      default: 63206,
    },
    showGif: {
      type: Boolean,
      default: false,
    },
    showLoom: {
      type: Boolean,
      default: true,
    },
    showFile: {
      type: Boolean,
      default: true,
    },
    isShare: {
      type: Boolean,
      default: false,
    },
    autoSendGif: {
      type: Boolean,
      default: false,
    },
    hideGifPicker: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'ready',
    'change',
    'send',
    'update:modelValue',
    'focus',
    'locationClose',
    'sendGif',
    'upload',
    'loom',
    'removeLoom',
    'removeFile',
  ],
  setup() {
    const globalStore = useGlobalStore();
    const socialStore = useSocialStore();
    return { globalStore, socialStore };
  },
  data() {
    return {
      showAction: false,
      showEmoji: false,
      showLocation: false,
      showAllMedia: false,
      quill: null,
      content: '',
      files: [],
      taggedUsers: [],
      loomFiles: this.initLoomFiles,
      plainText: '',
    };
  },
  computed: {
    computedAreaHeight() {
      if (this.shouldShowLocation) {
        return '5rem';
      }

      if (
        this.options.showMedia &&
        (this.files.length > 0 || this.loomFiles.length > 0)
      ) {
        return '15.375rem';
      }
      return this.areaHeight;
    },
    shouldShowMedia() {
      if (this.options.showMedia) {
        return (
          !this.showAllMedia &&
          (this.files.length > 0 || this.loomFiles.length > 0)
        );
      }
      return false;
    },
    loading() {
      return this.globalStore.editorLoading;
    },
    shouldShowLocation() {
      return (
        this.files.length === 0 &&
        this.loomFiles.length === 0 &&
        this.showLocation
      );
    },
    hasGif() {
      return !!this.socialStore.gif && !!this.showGif;
    },
  },
  watch: {
    modelValue(value) {
      this.content = value;
    },
    initFiles(value) {
      if (value && value.length > 0) {
        this.files = value;
      }
    },
    initLoomFiles(value) {
      if (value && value.length > 0) {
        this.loomFiles = value;
      }
    },
    'options.location': {
      handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          if (newVal.displayMap !== undefined) {
            this.showLocation = newVal.displayMap;
          } else {
            this.showLocation = true;
          }
        } else if (!newVal && oldVal) {
          this.showLocation = false;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  beforeMount() {
    document.removeEventListener('paste', this.onPaste);
    this.globalStore.editorLoading = false;
  },
  mounted() {
    if (this.initFiles) {
      this.files = this.initFiles;
    }
    document.addEventListener('paste', this.onPaste);
  },
  methods: {
    onReady(quill) {
      this.quill = quill;
      this.$emit('ready', quill);
      this.quill.root.innerHTML = this.modelValue;
    },
    onUpload(file) {
      this.files.push(file);
      this.showAction = false;
      this.$emit('upload');
    },
    onLoomUpload(video) {
      this.loomFiles.push(video);
      this.showAction = false;
      this.$emit('loom');
    },
    async onPaste(event) {
      const file = (event.clipboardData || window.clipboardData).files[0];
      if (file) {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          file.src = await getMediaUrl(file);
        }
        if (file.type.startsWith('image/')) {
          file.dimensions = await getImageDimensions(file);
        } else {
          file.dimensions = await getVideoDimensions(file);
        }
        this.onUpload(file);
      }
    },
    onRemoveFile(file) {
      if (this.loading) {
        return;
      }
      this.files = this.files.filter((item) => item !== file);
      this.loomFiles = this.loomFiles.filter((item) => item?.id !== file?.id);
      if (this.files.length === 0) {
        this.$emit('removeFile');
      }
    },
    onText(text) {
      text = text.trim();
      this.plainText = text;
    },
    onRemoveLoom(file) {
      if (this.loading) {
        return;
      }
      this.loomFiles = this.loomFiles.filter((item) => item !== file);
      if (this.loomFiles.length === 0) {
        this.$emit('removeLoom');
      }
    },
    onLoomClick(file) {
      if (file.sharedUrl) {
        window.open(file.sharedUrl, '_blank', 'noopener,noreferrer');
      }
    },
    onEmoji(emoji) {
      if (this.loading) {
        return;
      }
      if (emoji) {
        const quill = window[this.name];
        const cursor = quill.selection.savedRange.index;
        quill.insertEmbed(cursor, emoji);
        quill.setSelection(cursor + emoji.length);
      }
    },
    async onGif(gif) {
      if (this.autoSendGif) {
        this.$emit('sendGif', gif);
        this.showEmoji = false;
      } else {
        const file = await generateGifFile(gif);
        this.files.push(file);
      }
    },
    onChange(content) {
      this.$emit('change', content);
      this.$emit('update:modelValue', content);
    },
    stripHtmlTags(html) {
      return html.replace(/<[^>]*>/g, '');
    },
    trimEmptyTags(html) {
      html = html.replace(/<p>(.*?)\s*<\/p>/g, '<p>$1</p>');
      return html.replace(/(<p><br><\/p>\s*|<p>\s*<\/p>\s*)+$/, '');
    },
    onSend() {
      this.globalStore.editorLoading = true;
      const text = this.quill.getText()?.replace(/[\s\n]+$/g, '');
      this.$emit(
        'send',
        this.trimEmptyTags(this.content),
        this.files,
        this.taggedUsers,
        text,
        this.loomFiles,
        this.showLocation,
      );

      if (this.autoClear) {
        this.clear();
      }
    },
    clear() {
      this.content = '';
      this.plainText = '';
      this.files = [];
      this.taggedUsers = [];
      this.loomFiles = [];
      this.showAllMedia = false;
      this.globalStore.editorLoading = false;
    },
    clearLoading() {
      this.globalStore.editorLoading = false;
    },
    focus() {
      if (this.quill) {
        const length = this.quill.getLength();
        this.quill.focus();
        this.quill.setSelection(length, length);
      }
    },
  },
};
</script>
