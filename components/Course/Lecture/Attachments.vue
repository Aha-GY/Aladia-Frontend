<template>
  <div
    class="mx-6 overflow-hidden text-xs transition-all duration-300"
    :style="{
      maxHeight: isFilesOpen && attachments.length ? '40rem' : '0rem',
    }"
  >
    <div class="my-4 flex flex-col gap-2 rounded bg-[#101010] p-2">
      <div class="flex justify-between">
        <div>{{ $t('course.upload.file') }}</div>
        <div />
      </div>
      <div
        v-for="(file, index) in attachments"
        :key="index"
        class="flex cursor-pointer justify-between p-1 text-white/50 hover:bg-[#fff]/[0.05]"
        data-cy="902ab96f25adc561"
        @click="onDownloadFile(file)"
      >
        <div class="w-3/4 items-center justify-start gap-2 truncate">
          <i class="fa-solid" :class="icons[getExt(file)]" />
          {{ file.metadata.name }}
        </div>
        <div class="text-right">
          {{ getFileSize(file.metadata.size) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { icons } from '~/constant/files';

export default {
  props: {
    lecture: Object,
    isFilesOpen: Boolean,
  },
  data() {
    return {
      icons,
    };
  },
  computed: {
    attachments() {
      return this.lecture?.attachments || [];
    },
  },
  methods: {
    async onDownloadFile(item) {
      const blob = await (await fetch(item.url)).blob();
      const url = URL.createObjectURL(blob);
      download(url, item.name);
    },
    getExt(item) {
      return item.metadata.name.split('.').pop().toLowerCase();
    },
  },
};
</script>
