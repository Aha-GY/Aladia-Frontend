<template>
  <div class="relative bg-[#060606]">
    <div
      class="flex items-center justify-between bg-[#121212] p-4 text-[1.25rem] text-white/80"
    >
      <div class="flex items-center gap-5">
        <i class="fa-regular fa-gear" />
        {{ $t('index.sidebar.item.settings') }}
      </div>
      <div class="flex items-center gap-1">
        <div
          class="group flex cursor-pointer items-center justify-center rounded-md transition-all"
          data-cy="9d06e0cdf63134c6"
          @click="authStore.logout"
        >
          <i class="fa-light fa-right-from-bracket text-[#EE1717]" />
          <span class="ml-2 text-base group-hover:text-white/60">
            {{ $t('index.header.logout') }}
          </span>
        </div>
      </div>
    </div>
    <div ref="container" class="relative flex flex-col">
      <el-scrollbar
        ref="scroll"
        wrap-class="overscroll-contain"
        height="calc(100vh - 8.5rem)"
      >
        <ProfileSettingDrawer @handle-emit="handleEmit" />
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['handle-emit']);
const authStore = useAuthStore();
const handleEmit = (value) => {
  emit('handle-emit', value);
};
</script>
