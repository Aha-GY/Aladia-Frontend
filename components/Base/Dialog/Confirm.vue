<template>
  <el-dialog
    v-model="props.open"
    :show-close="false"
    append-to-body
    align-center
    width="25rem"
    :close-on-click-modal="false"
    class="rounded border border-white border-opacity-20"
  >
    <!-- header -->
    <!-- <div
      class="flex justify-end border-b border-white border-opacity-20 px-4 py-2"
    >
      <BaseIconClose @click="handleCancel" data-cy="7d1de98f312fdc16"/>
    </div> -->
    <!-- body -->
    <div class="flex items-center px-4 pt-5 text-sm text-[#B0B0B0]">
      {{ $t(props.context) }}
    </div>
    <div class="flex justify-end gap-2 p-4">
      <BaseButton
        label="$t:base.dialog.cancel"
        type="secondary"
        data-cy="7d6e643f42f0dcc4"
        @click="handleClose"
      />
      <BaseButton
        label="$t:base.dialog.confirm"
        data-cy="confirm-dialog-button"
        @click="handleConfirm"
      />
    </div>
  </el-dialog>
</template>
<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
    default: false,
  },
  context: {
    type: String,
    default: 'base.dialog.question',
  },
});

const emits = defineEmits(['yes', 'no']);

function handleClose() {
  emits('no');
}

function handleConfirm() {
  emits('yes');
}
</script>
