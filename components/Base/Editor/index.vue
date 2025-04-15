<template>
  <BaseEmoji
    :is-emoji="showEmoji"
    :auto-hide="false"
    class="!left-auto !right-2"
    :hide-gif="type === 'textarea' || hideGifPicker"
    :tool-tip-content="toolTipContent"
    :with-action-tooltip="withActionToolTip"
    @on-emoji="onEmoji"
    @on-hide="showEmoji = false"
    @on-gif="onGif"
  />
  <div
    v-if="type === 'line'"
    class="__base-editor--line flex items-end gap-2"
    :class="[
      uniformBg ? 'p-2 pt-1' : '',
      isPopupBg ? 'rounded-5 bg-[#0E0E0E]' : 'bg-[#020202]',
    ]"
  >
    <client-only>
      <el-popover
        v-if="isAction"
        v-model:visible="showAction"
        placement="top-start"
        :show-arrow="false"
        width="calc(100% - 0.5rem)"
        trigger="click"
        :teleported="false"
        popper-class="flex justify-center"
        :popper-style="{
          padding: '0px !important',
          borderColor: 'transparent',
          width: '15rem',
        }"
      >
        <BaseEditorAction
          :location-allowed="locationAllowed"
          :show-loom="showLoom"
          :show-file="showFile"
          @upload="onUpload"
          @loom="onLoomUpload"
          @close="onCloseAction"
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
    <div
      v-if="!options.showMedia || !showAllMedia"
      class="flex flex-1 gap-1 rounded-[0.3125rem] p-1.5 pt-1 text-white/80 transition-all"
      :class="[
        files.length || loomFiles.length || moreThanOneLine || hasGif
          ? 'flex-col'
          : 'items-end',
        !uniformBg ? 'bg-[#151515]' : '',
      ]"
    >
      <BaseEditorQuill
        v-model="content"
        :name="name"
        :type="type"
        :enable="!loading"
        :options="options"
        :get-tag-list="getTagList"
        :data-cy="dataCy"
        :auto-focus="autoFocus"
        :limit-character="limitCharacter"
        :characters-limit="charactersLimit"
        :enter-to-save="enterToSave"
        @ready="onReady"
        @change="onChange"
        @tag="taggedUsers = $event"
        @send="onSend"
        @text="onText"
        @focus="$emit('focus', $event)"
      />
      <div
        v-if="!files.length && !loomFiles.length && !moreThanOneLine && !hasGif"
        class="flex items-center gap-[0.3rem]"
      >
        <div
          v-if="limitCharacter"
          class="-mb-1.5 flex gap-[0.3rem] rounded text-sm text-gray-500"
          :class="{
            'font-bold text-red-500': length >= charactersLimit,
          }"
        >
          <div>
            <i
              v-if="length >= charactersLimit"
              class="fa-solid fa-circle-exclamation"
            />
          </div>
          <div>{{ length }}/{{ charactersLimit }}</div>
        </div>

        <div
          class="btn-emoji -mb-1.5 -mr-1.5 flex size-[1.875rem] cursor-pointer items-center justify-center rounded-[0.3125rem] text-white/60 hover:bg-[#151515] hover:text-white/80 active:scale-95"
          data-cy="6a17c14dba8fc91a"
          @click="showEmoji = !showEmoji"
        >
          <i
            class="fa-regular fa-face-smile cursor-pointer text-white/60 hover:text-white/80"
          />
        </div>
      </div>
      <div v-else class="flex items-end justify-between">
        <div
          v-if="!options.showMedia"
          class="hide-scrollbar flex max-h-[18.75rem] flex-wrap items-start overflow-y-auto"
        >
          <BaseEditorAttachment :files="files" @remove="onRemoveFile" />
          <BaseEditorLoomFiles
            :files="loomFiles"
            @remove="onRemoveLoom"
            @item-click="onLoomClick"
          />
          <BaseEditorGif v-if="showGif" />
        </div>
        <BaseEditorMedia
          v-if="options.showMedia"
          class="flex-1"
          :files="files"
          :looms="loomFiles"
          :max-items="2"
          width="w-[40%]"
          @remove="onRemoveFile"
          @item-click="onLoomClick"
          @show="showAllMedia = true"
        />
        <div class="flex items-center gap-[0.2rem]">
          <div
            v-if="limitCharacter"
            class="-mb-1.5 flex gap-[0.3rem] rounded px-2 text-sm text-gray-500"
            :class="{
              'font-bold text-red-500': length >= charactersLimit,
            }"
          >
            <div>
              <i
                v-if="length >= charactersLimit"
                class="fa-solid fa-circle-exclamation"
              />
            </div>
            <div>{{ length }}/{{ charactersLimit }}</div>
          </div>

          <div
            class="-mb-1.5 -mr-1.5 flex size-[1.875rem] cursor-pointer items-center justify-center rounded-[0.3125rem] text-white/60 hover:bg-[#151515] hover:text-white/80 active:scale-95"
          >
            <i
              class="fa-regular btn-emoji fa-face-smile cursor-pointer text-white/60 hover:text-white/80"
              data-cy="7a6689e8d1dde458"
              @click="showEmoji = !showEmoji"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="options.showMedia && showAllMedia">
      <BaseEditorAllMedias
        class="h-[8rem] overflow-y-auto px-2"
        :medias="[...files, ...loomFiles]"
        :editor-loading="loading"
        @remove="onRemoveFile"
        @item-click="onLoomClick"
        @back="showAllMedia = false"
      />
    </div>
    <div
      v-show="isSend || (showMic && !isSend)"
      class="flex size-[1.875rem] cursor-pointer items-center justify-center rounded-[0.3125rem] text-white/60 hover:text-white/80 active:scale-95"
      :class="!uniformBg ? 'bg-[#151515]' : ''"
    >
      <i v-if="loading" class="fa-solid fa-spinner mr-1 animate-spin" />
      <template v-else>
        <div
          v-if="isSend && showSend"
          class="flex size-[1.875rem] cursor-pointer items-center justify-center rounded-[0.3125rem] text-white/60 hover:bg-[#151515] hover:text-white/80 active:scale-95"
          @click="onSend"
        >
          <i
            class="fa-solid fa-send"
            :class="loading ? 'pointer-events-none' : ''"
            :data-cy="`${dataCy}-send-button`"
          />
        </div>
        <div
          v-else-if="showMic && !isSend"
          class="flex size-[1.875rem] cursor-pointer items-center justify-center rounded-[0.3125rem] text-white/60 hover:bg-[#151515] hover:text-white/80 active:scale-95"
        >
          <i class="fa-solid fa-microphone" />
        </div>
      </template>
    </div>
  </div>
  <div
    v-else-if="type === 'area'"
    class="__base-editor--area rounded-[0.3125rem] bg-[#0E0E0E] p-2"
  >
    <template v-if="!options.showMedia || !showAllMedia">
      <BaseEditorQuill
        v-if="!withMaxHeight"
        v-model="content"
        :name="name"
        :type="type"
        :area-height="computedAreaHeight"
        :enable="!loading"
        :options="options"
        :get-tag-list="getTagList"
        :data-cy="dataCy"
        :auto-focus="autoFocus"
        :limit-character="limitCharacter"
        :characters-limit="charactersLimit"
        :enter-to-save="enterToSave"
        @send="onSend"
        @ready="onReady"
        @tag="taggedUsers = $event"
        @change="onChange"
        @text="onText"
        @focus="$emit('focus', $event)"
      />
      <BaseEditorQuill
        v-else
        v-model="content"
        :name="name"
        :type="type"
        :area-height="''"
        :max-area-height="maxAreaHeight"
        :enable="!loading"
        :options="options"
        :get-tag-list="getTagList"
        :data-cy="dataCy"
        :auto-focus="autoFocus"
        :limit-character="limitCharacter"
        :characters-limit="charactersLimit"
        :enter-to-save="enterToSave"
        @send="onSend"
        @ready="onReady"
        @tag="taggedUsers = $event"
        @change="onChange"
        @text="onText"
        @focus="$emit('focus', $event)"
      />
      <PostsCreationLocationEditor
        v-if="shouldShowLocation"
        class="mt-4"
        :location-item="options.location"
        :is-closable="!loading"
        @close="handleLocationClose"
      />
    </template>
    <div
      v-if="!options.showMedia && !options.showStoryMedia"
      class="flex items-center"
    >
      <BaseEditorAttachment :files="files" @remove="onRemoveFile" />
      <BaseEditorLoomFiles
        :files="loomFiles"
        @remove="onRemoveLoom"
        @item-click="onLoomClick"
      />
    </div>
    <BaseEditorMedia
      v-if="shouldShowMedia"
      :files="files"
      :looms="loomFiles"
      @remove="onRemoveFile"
      @item-click="onLoomClick"
      @show="showAllMedia = true"
    />
    <BaseEditorStoryMedia
      v-if="options.showStoryMedia && files.length"
      :class="['flex-1', !showAllMedia && 'my-2']"
      :files="files"
      :looms="loomFiles"
      :max-items="4"
      :show-all="showAllMedia"
      width="w-[40%]"
      @remove="onRemoveFile"
      @item-click="onLoomClick"
      @show="showAllMedia = true"
      @back="showAllMedia = false"
    />
    <BaseEditorGif v-if="showGif" />

    <BaseEditorAllMedias
      v-if="options.showMedia && showAllMedia"
      class="overflow-y-auto"
      :style="{ height: areaHeight }"
      :medias="[...files, ...loomFiles]"
      :editor-loading="loading"
      @remove="onRemoveFile"
      @item-click="onLoomClick"
      @back="showAllMedia = false"
    />
    <div class="mt-2 flex items-end justify-between">
      <client-only>
        <el-popover
          v-if="isAction"
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
          <BaseEditorAction
            v-if="!withActionToolTip"
            :location-allowed="locationAllowed"
            :show-loom="showLoom"
            :show-file="showFile"
            @upload="onUpload"
            @loom="onLoomUpload"
          />
          <BaseEditorActionToolTip
            v-else
            :location-allowed="locationAllowed"
            :show-loom="showLoom"
            :show-file="showFile"
            :show-gif="showGif"
            :has-gif="hasGif"
            :tool-tip-content="toolTipContent"
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
      <div :class="!isAction ? 'flex flex-1 items-center justify-end' : ''">
        <div
          v-if="limitCharacter"
          class="flex gap-[0.3rem] rounded text-sm text-gray-500"
          :class="{
            'font-bold text-red-500': length >= charactersLimit,
          }"
        >
          <div>
            <i
              v-if="length >= charactersLimit"
              class="fa-solid fa-circle-exclamation"
            />
          </div>
          <div>{{ length }}/{{ charactersLimit }}</div>
        </div>

        <div class="flex flex-1 items-center justify-end gap-[0.63rem]">
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
            v-if="showSend"
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
  <div
    v-else
    class="__base-editor--textarea flex flex-1 flex-col rounded-[0.3125rem] bg-[#0E0E0E] p-2 text-white/80"
  >
    <BaseEditorQuill
      v-model="content"
      :name="name"
      :type="type"
      :editor-class="editorClass"
      :area-height="areaHeight"
      :enable="!loading"
      :options="options"
      :get-tag-list="getTagList"
      :data-cy="dataCy"
      :auto-focus="autoFocus"
      :limit-character="limitCharacter"
      :characters-limit="charactersLimit"
      :enter-to-save="false"
      @ready="onReady"
      @change="onChange"
      @tag="taggedUsers = $event"
      @send="onSend"
      @text="onText"
      @focus="$emit('focus', $event)"
    />

    <div class="flex items-end justify-between">
      <div
        class="flex flex-1 items-center"
        :class="limitCharacter ? 'justify-between' : 'justify-end'"
      >
        <div
          v-if="limitCharacter"
          class="flex gap-1 text-xs text-gray-500"
          :class="{
            'text-red-500': length >= charactersLimit,
          }"
        >
          <!-- <div>
            <i
              v-if="length > charactersLimit"
              class="fa-regular fa-circle-exclamation text-xs"
            />
          </div> -->
          <div>{{ length }}/{{ charactersLimit }}</div>
        </div>

        <div
          class="btn-emoji flex size-[1.875rem] cursor-pointer items-center justify-center rounded-[0.3125rem] text-white/60 hover:bg-[#151515] hover:text-white/80 active:scale-95"
          data-cy="00155512b8a40b06"
          @click="showEmoji = !showEmoji"
        >
          <i
            class="fa-regular fa-face-smile ml-[0.12] mt-[0.21rem] cursor-pointer text-white/60 hover:text-white/80"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
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
      default: 'line', // line, area,textarea
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
    isPopupBg: {
      type: Boolean,
      default: false,
    },
    showMic: {
      type: Boolean,
      default: true,
    },
    limitCharacter: {
      type: Boolean,
      default: false,
    },
    charactersLimit: {
      type: Number,
      default: 63206,
    },
    showSend: {
      type: Boolean,
      default: true,
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
    withMaxHeight: {
      type: Boolean,
      default: false,
    },
    maxAreaHeight: {
      type: String,
      default: '',
    },
    autoSendGif: {
      type: Boolean,
      default: false,
    },
    hideGifPicker: {
      type: Boolean,
      default: false,
    },
    withActionToolTip: {
      type: Boolean,
      default: false,
    },
    enterToSave: {
      type: Boolean,
      default: true,
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
    'removeFile',
    'removeLoom',
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
    length() {
      return Array.from(this.plainText).length;
    },
    isSend() {
      return (
        this.stripHtmlTags(this.content).trim() ||
        this.sendWhitespace ||
        this.files.length > 0 ||
        this.loomFiles.length > 0 ||
        this.socialStore.gif
      );
    },
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
      // 根据需求 (CU-86c1mbx14)，即使在显示附件的情况下也显示地图
      return this.showLocation;
    },
    moreThanOneLine() {
      return (
        this.options?.moreThanOneLine && this.length > this.options?.characters
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
      this.$nextTick(() => {
        this.focus();
      });
    },
    onLoomUpload(video) {
      this.loomFiles.push(video);
      this.showAction = false;
      this.$emit('loom');
      this.$nextTick(() => {
        this.focus();
      });
    },
    handleLocationClose() {
      this.showLocation = false;
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
    onCloseAction() {
      this.showAction = false;
    },
    onEmoji(emoji) {
      if (this.loading) {
        return;
      }
      if (emoji) {
        const quill = window[this.name];
        const cursor = quill.selection.savedRange.index;
        console.log(cursor);
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
      if (
        !this.loading &&
        (this.stripHtmlTags(this.content).trim() ||
          this.files.length > 0 ||
          this.loomFiles.length > 0 ||
          this.sendWhitespace ||
          this.options.location ||
          this.socialStore.gif ||
          this.isShare)
      ) {
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
<style lang="scss">
.quill-editor {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  ::selection {
    background-color: #53471d;
  }

  /* Firefox */
  ::-moz-selection {
    background-color: #53471d;
  }
}

.quill-editor::-webkit-scrollbar {
  width: 0; /* Safari and Chrome */
  display: none;
}
</style>
