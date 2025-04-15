<!--
Purpose: a popup to show attachments of a post
用途：以弹框的形式显示帖子附件，出现在所有显示帖子的地方（由 `+N` 按钮触发）
-->

<template>
  <client-only>
    <el-dialog
      v-model="socialStore.attachmentPopupVisible"
      :show-close="false"
      align-center
      destroy-on-close
      append-to-body
      :close-on-click-modal="true"
      class="__attachment-popup min-w-[24rem] max-w-[40rem] !rounded-[0.3125rem] !shadow-none"
    >
      <div class="p-2">
        <header
          class="relative mb-2 flex h-10 items-center justify-between p-2 text-[#B0B0B0]"
        >
          <div class="flex items-center justify-start text-lg">
            <i class="fa-solid fa-paperclip mr-2 text-[20px]" />
            <div class="pl-1.5">{{ $t('base.upload.filesAttached') }}</div>
            <div class="ml-4 text-white">{{ $files.length }}</div>
          </div>
          <BaseIconClose @click="onClose" />
        </header>
        <div
          class="__file-list max-h-[50vh] overflow-y-auto rounded bg-[#181818] p-2"
        >
          <div
            v-for="file in $files"
            :key="file.fileId"
            class="mr-1 flex cursor-pointer items-center justify-between gap-1.5 rounded-md p-1.5 hover:bg-white/5"
            @click="downloadFile(file)"
          >
            <div
              class="flex size-9 flex-none items-center justify-center rounded bg-[#202020]"
            >
              <i
                class="fa-solid text-lg text-[#EB4937]"
                :class="getFileType(file.name || file.title)"
              />
            </div>
            <div class="text-md flex-auto truncate leading-none text-white/80">
              {{ file.name || file.title }}
            </div>

            <div
              class="flex-none whitespace-nowrap text-xs leading-none text-[#707070]"
            >
              {{ getFileSize(file.size) }}
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </client-only>
</template>

<script setup>
const socialStore = useSocialStore();

const $files = computed(() => socialStore.attachmentPopupData);

function onClose() {
  socialStore.attachmentPopupVisible = false;
  socialStore.attachmentPopupData = [];
}
</script>
