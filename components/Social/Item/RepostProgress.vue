<template>
  <div
    v-if="socialStore.rePostProgress.length > 0"
    class="fixed bottom-0 left-0 z-50 mb-3 w-full rounded-md bg-black p-3 text-white shadow-lg md:left-20 md:w-1/4"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2 text-xs">
        <i
          v-if="!$isSuccess && !$isFailed"
          class="fa-solid fa-spinner animate-spin text-sm"
        />
        <span v-if="$isSuccess">Reposting Done</span>
        <span v-else-if="$isFailed">Reposting Failed</span>
        <span v-else>Reposting</span>

        <span v-if="$totalProgress > 1">
          {{
            $unfinishedProgressIndex > -1
              ? $unfinishedProgressIndex + 1
              : $totalProgress
          }}
          / {{ $totalProgress }}
        </span>
      </div>
      <button
        v-if="$isSuccess || $isFailed"
        class="text-sm text-white hover:text-gray-400 focus:outline-none"
        @click="onClose"
      >
        <i class="fa-solid fa-xmark" />
      </button>
    </div>
    <div class="mt-2 flex items-center gap-2">
      <div
        v-if="$isSuccess"
        class="flex size-4 items-center justify-center rounded-full bg-[#35A823]"
      >
        <i class="fa-solid fa-check text-[0.5rem] text-[#D9D9D9]" />
      </div>

      <div
        class="flex h-[0.3rem] w-full overflow-hidden rounded-full bg-gray-300 bg-opacity-50"
      >
        <div
          class="h-full rounded-l-full rounded-r-full transition-all duration-300 ease-in-out"
          :class="$isFailed ? 'bg-[#FF0000] opacity-90' : 'bg-yellow-500'"
          :style="{ width: $progress + '%' }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// 下面这个事件原本是为了在列表页面执行刷新帖子列表的操作
// 后来这个行为被优化为直接在列表头部插入新创建或修改的帖子，无需刷新帖子列表
// TODO: 因此下面这个事件在上述优化修改稳定后可被移除
const emit = defineEmits(['all-done']);

const socialStore = useSocialStore();

const $currentProgress = computed(() => {
  const unfinishedProgress = socialStore.rePostProgress.find(
    (item) => !item.success && !item.failed,
  );
  const latestProgress =
    socialStore.rePostProgress.length > 0
      ? socialStore.rePostProgress[socialStore.rePostProgress.length - 1]
      : null;

  return unfinishedProgress || latestProgress;
});

const $unfinishedProgressIndex = computed(() =>
  socialStore.rePostProgress.findIndex((item) => !item.success && !item.failed),
);

const $progress = computed(() => $currentProgress.value?.progress || 0);

const $isSuccess = computed(() => $currentProgress.value?.success || false);

const $isFailed = computed(() => $currentProgress.value?.failed || false);

const $totalProgress = computed(() => socialStore.rePostProgress.length);

const onClose = () => {
  socialStore.rePostProgress = [];
};

watch(
  () => socialStore.postingAllDone,
  (val) => {
    if (val === true) {
      emit('all-done');

      const shouldExecuteTimeout = true;

      setTimeout(() => {
        if (shouldExecuteTimeout) {
          socialStore.rePostProgress = [];
          socialStore.postingAllDone = false;
        }
      }, 3000);
    }
  },
);
</script>
