<template>
  <div class="flex gap-4 font-light">
    <div v-if="type !== 'preview'" class="flex w-5 justify-center pt-1.5">
      <i class="fa-light fa-link text-base text-white/20" />
    </div>
    <div class="w-0 flex-1">
      <div
        class="flex rounded px-2 py-1 text-white/50 transition-all duration-300"
        :class="{
          'h-7 items-center': !open,
          'bg-[#0E0E0E]': open || attachments.length > 0,
          'h-60 hover:bg-white/5': attachments.length === 0,
        }"
      >
        <div class="flex w-full flex-col">
          <div class="flex items-center justify-between">
            <div
              v-if="attachments.length === 0 && !open"
              class="relative flex-1 cursor-pointer"
              data-cy="Lecture-attachment-icon"
              @click="open = true"
            >
              {{ $t('org.attachment.insert') }}
              <input
                type="file"
                multiple
                class="absolute inset-0 z-10 opacity-0"
                data-cy="upload-file-init-icon"
                @change="onChange"
              />
            </div>
            <div v-else class="flex-1">
              <div>Files</div>
            </div>
            <div class="pr-1.5">{{ attachments.length }}/5</div>
          </div>
          <div v-if="open" class="flex-1 py-1">
            <div
              v-if="attachments.length === 0"
              class="group/upload relative flex h-full w-full cursor-pointer items-center justify-center"
            >
              <div
                class="pointer-events-none absolute inset-0 z-0 rounded border border-dashed border-white/20 transition-all duration-300 group-hover/upload:scale-95 group-hover/upload:bg-white/5"
              />
              <div class="flex flex-col items-center gap-2">
                <i class="fa-regular fa-folder-arrow-up text-4xl" />
                <div class="text-xs">
                  <span class="font-normal underline">
                    {{ $t('base.upload.click') }}
                  </span>
                  {{ $t('base.upload.drop') }}
                </div>
              </div>
              <input
                type="file"
                multiple
                class="absolute inset-0 z-10 opacity-0"
                data-cy="upload-file-icon"
                @change="onChange"
              />
            </div>
            <div v-else class="flex h-full flex-col justify-between gap-2">
              <div class="flex flex-col gap-1">
                <OrganizationHubEventAttachmentItem
                  v-for="(attachment, index) in attachments"
                  :key="index"
                  :attachments="attachments"
                  :attachment="attachment"
                  :index="index"
                  @add="onAdd"
                  @remove="onRemove"
                />
              </div>
              <div
                v-if="attachments.length < 5"
                class="relative flex items-center justify-center gap-2 rounded border border-dashed border-white/20 py-2 text-xs transition-all duration-300 hover:border-white/50 hover:bg-white/10"
              >
                <i class="fa-regular fa-folder-arrow-up text-4xl" />
                <span class="font-normal underline">
                  {{ $t('base.upload.click') }}
                </span>
                {{ $t('base.upload.drop') }}
                <input
                  type="file"
                  multiple
                  class="absolute inset-0 z-10 opacity-0"
                  data-cy="f374e7ce60231769"
                  @change="onChange"
                />
              </div>
              <div
                v-else
                class="relative flex cursor-not-allowed items-center justify-center gap-2 rounded border border-dashed border-white/20 py-2 text-xs font-semibold text-[#707070] opacity-50"
              >
                <i class="fa-solid fa-file" />
                {{ $t('base.upload.unUpload') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { icons } from '~/constant/files';

export default {
  props: {
    files: {
      type: Array,
      default: () => null,
    },
    type: {
      type: String,
      default: '',
    },
  },
  setup() {
    const hubEvent = useHubEventStore();
    return { hubEvent };
  },
  data() {
    return {
      open: false,
      icons,
    };
  },
  computed: {
    event() {
      return this.hubEvent.event;
    },
    lecture() {
      return this.hubEvent.lecture;
    },
    target() {
      const isCalendar = this.$route.name.endsWith('hub-name-calendar');
      return isCalendar ? this.event : this.lecture;
    },
    attachments() {
      return this.files || this.target.attachments || [];
    },
  },
  mounted() {
    this.open = !!this.attachments.length || this.type === 'preview';
  },
  methods: {
    getFileExtension(file) {
      return file.name.split('.').pop().toLowerCase();
    },
    onChange(event) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const ext = this.getFileExtension(file);
        if (this.icons[ext] && this.attachments.length < 5) {
          this.attachments.push({
            _file: file,
            fileId: '',
            metadata: {
              size: file.size,
              mimetype: file.type,
              name: file.name,
            },
          });
        } else {
          this.$toast.error(
            !this.icons[ext]
              ? this.$t('base.upload.extError')
              : this.$t('base.upload.limitError'),
          );
        }
      }
    },
    onAdd(attachment) {
      this.$emit('add', attachment);
    },
    onRemove(attachment) {
      const index = this.attachments.findIndex(
        (item) => item.fileId === attachment.fileId,
      );
      this.attachments.splice(index, 1);
      this.$emit('remove', attachment);
    },
  },
};
</script>
