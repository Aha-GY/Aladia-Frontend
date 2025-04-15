<template>
  <div class="__base-editor-all-media w-full">
    <div
      class="group flex cursor-pointer items-center"
      :class="$device.isMobile ? '' : 'px-3 py-2'"
      @click="() => $emit('back')"
    >
      <span class="flex items-center gap-2 leading-6 text-[#FAFAFA]">
        <span class="translation-all duration-300 group-hover:-translate-x-1">
          <i class="fa-solid fa-arrow-left" />
        </span>
        <span class="text-xs">{{ $t('base.back') }}</span>
      </span>
    </div>
    <div>
      <div class="flex flex-wrap items-center gap-1.5">
        <div
          v-for="(item, index) in medias"
          :key="index"
          class="relative flex w-[32%] gap-1.5 rounded-md bg-[#060606] p-1.5"
          :class="item.type === 'loom' ? 'cursor-pointer hover:bg-white/5' : ''"
          @click="item.type === 'loom' ? $emit('itemClick', item) : null"
        >
          <div
            class="flex h-9 w-9 items-center justify-center rounded bg-[#202020]"
          >
            <img
              v-if="(item.src || item.url) && item.type?.includes('image')"
              :src="item.src || item.url"
              class="h-8 rounded object-cover"
            />
            <video
              v-else-if="(item.src || item.url) && item.type?.includes('video')"
              :src="item.src || item.url"
              class="h-8 rounded object-cover"
            />
            <i
              v-else-if="item.type === 'loom'"
              class="fa-solid fa-file-video"
            />
            <i
              v-else
              class="fa-solid"
              :class="getFileType(item.name || item.title)"
            />
          </div>

          <div class="relative flex w-0 flex-1 flex-col justify-center gap-0.5">
            <div class="text-wihte/80 w-full truncate text-xs">
              {{
                isMediaItemLoom(item)
                  ? getLoomTitle(item)
                  : item.name || item.title
              }}
            </div>
            <div class="text-xs text-[#707070]">
              {{ isMediaItemLoom(item) ? 'Loom' : getFileSize(item.size || 0) }}
            </div>
          </div>
          <div
            v-if="!editorLoading"
            class="cursor-pointer text-sm text-white/50 transition-all duration-300 hover:text-white active:scale-90"
            @click.stop="$emit('remove', item)"
          >
            <i class="fa-light fa-xmark" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  medias: {
    type: Array,
    default: () => [],
  },
  editorLoading: {
    type: Boolean,
    default: false,
  },
});
</script>
