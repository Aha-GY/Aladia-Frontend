<template>
  <div class="__post-item-attachment flex items-center justify-between gap-2">
    <div
      v-for="item in $filesToShow"
      :key="item.fileId"
      class="flex w-full flex-auto cursor-pointer items-center gap-1.5 overflow-hidden rounded-md bg-black p-1.5 hover:bg-white/5"
      @click="downloadFile(item)"
    >
      <div
        class="flex size-9 flex-none items-center justify-center rounded bg-[#202020]"
      >
        <i
          class="fa-solid text-lg text-[#EB4937]"
          :class="getFileType(item.name || item.title)"
        />
      </div>
      <div class="flex-auto justify-center overflow-hidden">
        <div class="text-md w-full truncate leading-none text-white/80">
          {{ item.name || item.title }}
        </div>
        <div class="mt-1 text-xs leading-none text-[#707070]">
          {{ getFileSize(item.size) }}
        </div>
      </div>
    </div>

    <div
      v-if="files.length > $qtyToShow"
      class="flex size-12 flex-none cursor-pointer items-center justify-center rounded-md bg-black text-xl hover:bg-white/5"
      @click="openAttachmentPopup"
    >
      +{{ files.length - $qtyToShow }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  files: Array,
});

const socialStore = useSocialStore();

// 在 Post 卡片中最多可显示的文件数量
const $qtyToShow = ref(3);
// 在 Post 卡片中显示的文件列表
const $filesToShow = computed(() => props.files.slice(0, $qtyToShow.value));

function openAttachmentPopup() {
  socialStore.attachmentPopupVisible = true;
  socialStore.attachmentPopupData = props.files;
}
</script>
