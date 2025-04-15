<template>
  <div class="flex flex-col gap-2">
    <BaseButton
      v-if="$device.isMobile"
      type="tertiary"
      icon="fa-solid fa-share"
      label="$t:course.review.title.upper"
      data-cy="39d33a424bb32160"
      @click="$emit('goTab', 3)"
    />
    <BaseButton
      type="tertiary"
      icon="fa-solid fa-share"
      label="$t:personal.profile.share"
    />
    <BaseButton
      type="tertiary"
      icon="fa-solid fa-arrow-down-to-line"
      label="$t:personal.profile.download.pdf"
      data-cy="411219c848b77dc7"
      @click="downing = true"
    />
  </div>
  <el-dialog
    v-model="downing"
    :show-close="false"
    align-center
    append-to-body
    destroy-on-close
    width="600"
  >
    <div class="flex flex-col gap-4 rounded-md p-4">
      <div class="flex h-9 items-center">
        <div class="flex-1 text-base font-semibold text-[#D9D9D9E5]">
          {{ $t('personal.cv.preview') }}
        </div>
        <div
          class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-all hover:bg-white/5 active:scale-95"
        >
          <i class="fa-solid fa-arrow-down-to-line text-sm text-[#D9D9D9B2]" />
        </div>
        <div
          class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-all hover:bg-white/5 active:scale-95"
        >
          <i class="fa-solid fa-print text-sm text-[#D9D9D9B2]" />
        </div>
        <div
          class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-all hover:bg-white/5 active:scale-95"
          data-cy="7d359a6b0e14f04c"
          @click="downing = false"
        >
          <i class="fa-solid fa-xmark text-sm text-[#D9D9D9B2]" />
        </div>
      </div>
      <div class="mx-auto h-[32.875rem] w-[23.125rem] bg-white" />
    </div>
  </el-dialog>
</template>
<script setup>
defineEmits(['goTab']);
const downing = ref(false);
</script>
