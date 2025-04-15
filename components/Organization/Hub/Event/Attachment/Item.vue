<template>
  <div
    class="group/file relative flex items-center justify-between rounded px-2 py-1 text-13 transition-all duration-300 hover:bg-white/5"
  >
    <div class="flex items-center gap-2 truncate">
      <i class="fa-solid" :class="icons[ext]" />
      <div class="max-w-72 truncate">{{ metadata.name }}</div>
    </div>
    <div class="flex shrink-0 items-center gap-1">
      <div v-if="file && loading">{{ getFileSize(size) }} /</div>
      {{ getFileSize(metadata.size) }}
      <i
        class="fa-light fa-circle-xmark cursor-pointer opacity-0 group-hover/file:opacity-100"
        data-cy="5dc3e2a3445bba36"
        @click="onRemove"
      />
    </div>
    <div
      v-if="loading"
      class="absolute bottom-0 left-0 h-[1px] bg-[#802cac] transition-all duration-300"
      :style="{
        width: (size / metadata.size) * 100 + '%',
      }"
    />
  </div>
</template>

<script>
import { icons } from '~/constant/files';

export default {
  props: {
    attachments: {
      type: Array,
      required: true,
    },
    attachment: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const hubEvent = useHubEventStore();
    return { hubEvent };
  },
  data() {
    return {
      size: 0,
      file: null,
      loading: false,
      icons,
    };
  },
  computed: {
    metadata() {
      return this.attachment.metadata;
    },
    ext() {
      return this.metadata.name.split('.').pop().toLowerCase();
    },
  },
  mounted() {
    if (this.attachment._file) {
      this.file = this.attachment._file;
      this.onUpload(this.attachment._file);
      delete this.attachment._file;
    }
  },
  methods: {
    async onUpload(file) {
      try {
        if (!this.icons[this.ext]) {
          return this.$toast.error(this.$t('base.upload.fileError'));
        }

        this.size = 0;
        this.loading = true;

        const { fileId } = await upload({
          file,
          onProgress: (progress) => {
            this.size = (progress / 100) * file.size;
          },
        });

        this.attachment.fileId = fileId;
        this.$emit('add', this.attachment);

        this.size = file.size;
        this.loading = false;
      } catch (error) {
        this.size = 0;
        this.loading = false;
        this.attachments.splice(this.index, 1);
        throw error;
      }
    },
    async onRemove() {
      this.$emit('remove', this.attachment);
    },
  },
};
</script>
