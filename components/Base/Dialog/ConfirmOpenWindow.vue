<!-- 用于window.open(url)的确认弹窗, 避免浏览器默认阻拦的情况 -->
<template>
  <el-dialog
    v-model="props.open"
    :show-close="false"
    append-to-body
    width="25rem"
    :close-on-click-modal="false"
    class="rounded border border-white border-opacity-20"
    @close="handleClose"
  >
    <!-- header -->
    <div
      class="flex justify-end border-b border-white border-opacity-20 px-4 py-2"
    >
      <BaseIconClose data-cy="257eb20e7315b8f0" @click="handleClose" />
    </div>
    <!-- body -->
    <div class="flex items-center px-4 pt-5 text-sm text-[#B0B0B0]">
      {{ $t(props.context) }}
    </div>
    <div class="flex justify-end gap-2 p-4">
      <BaseButton
        label="$t:base.upload.cancel"
        type="secondary"
        data-cy="25c2e497d2bc8b86"
        @click="handleClose"
      />

      <a
        class="hover:border-transparen flex rounded-[0.3125rem] bg-[#F0CA41] p-2 pb-1.5 text-sm text-[#101010] transition-all hover:bg-[#B59523]"
        :href="url"
        target="_blank"
        data-cy="b0923263273bee4d"
        @click="handleClickOK"
      >
        {{ $t('base.upload.ok') }}
      </a>
    </div>
  </el-dialog>
</template>
<script setup>
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  open: {
    type: Boolean,
    required: true,
    default: false,
  },
  context: {
    type: String,
    default: 'base.dialog.stripe.question',
  },
});

const emits = defineEmits(['close']);

function handleClose() {
  emits('close');
}

function handleClickOK() {
  setTimeout(() => {
    handleClose();
  }, 500);
}
</script>
