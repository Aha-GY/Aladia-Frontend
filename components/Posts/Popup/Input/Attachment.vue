<template>
  <div
    class="overflow-hidden transition-all duration-300"
    :class="files.length ? 'mt-4 h-20 opacity-100' : 'mt-0 h-0 opacity-0'"
  >
    <div class="flex flex-wrap items-center gap-2">
      <div
        v-for="item in files"
        :key="item.preview"
        class="relative flex w-64 items-center gap-2 rounded border border-white/5 bg-black p-2 pr-8"
      >
        <img
          class="h-12 w-12 rounded object-cover"
          :src="item.preview"
          :class="item.id ? '' : 'opacity-50'"
        />
        <div class="flex w-0 flex-1 flex-col justify-center gap-1">
          <div class="truncate text-sm">
            {{ item.file.name }}
          </div>
          <div class="flex items-center gap-2 text-xs italic text-white/50">
            {{
              getFileSize(
                (item.file.size * ((item.progress || 0) / 100)).toFixed(2),
              )
            }}
            /
            {{ getFileSize(item.file.size) }}
            <div
              class="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#231d29] transition-all duration-300"
              :class="item.id ? 'opacity-100' : 'opacity-0'"
            >
              <i class="fa-solid fa-check text-sm text-[#802cac]" />
            </div>
          </div>
          <div
            class="h-1 w-full overflow-hidden rounded-sm bg-black/50"
            :class="item.id ? 'opacity-0' : 'opacity-100'"
          >
            <div
              class="h-full bg-[#802cac] transition-all duration-500"
              :style="{ width: item.progress * 100 + '%' }"
            />
          </div>
        </div>
        <div
          v-if="item.id"
          class="absolute right-1.5 top-1.5 cursor-pointer text-sm text-white/50 transition-all duration-300 hover:text-white active:scale-90"
          data-cy="09e48b1392c64b21"
          @click="socialStore.onAnswerFileRemove(item)"
        >
          <i class="fa-solid fa-circle-xmark" />
        </div>
      </div>
      <div
        v-if="files.length !== 3"
        class="group relative flex h-5 w-5 cursor-pointer items-center justify-center rounded border border-white/5 bg-black transition-all duration-300 hover:border-white/20 hover:bg-white/5"
      >
        <span
          class="text-lg text-white transition-all duration-500 group-hover/item:rotate-180"
        >
          <i class="fa-light fa-add" />
        </span>
        <input
          type="file"
          accept="image/*,video/*"
          class="absolute inset-0 opacity-0"
          data-cy="9c8366a7d16f1143"
          @change="socialStore.onAnswerFileChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  computed: {
    files() {
      return this.socialStore.answerFiles;
    },
  },
};
</script>
