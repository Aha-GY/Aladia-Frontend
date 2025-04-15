<template>
  <client-only>
    <el-dialog
      :model-value="dialogShow"
      append-to-body
      :show-close="false"
      width="26.25rem"
      destroy-on-close
      :close-on-click-modal="false"
      :z-index="10000"
      @closed="handleCloseDialog"
    >
      <div
        class="flex items-center justify-between rounded-t-md bg-[#0C0C0C] px-4 py-3.5"
      >
        <div v-if="$slots.title">
          <slot name="title" />
        </div>
        <template v-else>
          <div class="bg-[#0C0C0C] text-base text-[#B0B0B0]">
            {{ title }}
          </div>
        </template>
        <BaseIconClose data-cy="d7dd62315955b097" @click="handleCloseDialog" />
      </div>
      <div v-if="$slots.body">
        <slot name="body" />
      </div>
      <div v-else class="flex p-4">
        {{ message }}
      </div>

      <div v-if="$slots.footer">
        <slot name="footer" />
      </div>
      <div v-else class="flex justify-end p-4">
        <BaseButton
          :label="cancelButtonText"
          type="tertiary"
          data-cy="886fcdf8a6ad2b82"
          @click="handleCancel"
        />
        <BaseButton
          class="ml-3"
          :label="confirmButtonText"
          data-cy="c719034656f31ad7"
          @click="handleComfirm"
        />
      </div>
    </el-dialog>
  </client-only>
</template>

<script>
export default {
  props: {
    dialogShow: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'card',
    },
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    cancelButtonText: {
      type: String,
      default: '$t:base.upload.cancel',
    },
    confirmButtonText: {
      type: String,
      default: '$t:base.upload.confirm',
    },
  },
  methods: {
    _inlineClose() {
      this.$emit('close');
    },
    _inlineUpdateVisible(status) {
      this.$emit('update:dialogShow', status);
    },
    handleCloseDialog() {
      this._inlineClose();
      this._inlineUpdateVisible(false);
    },
    handleCancel() {
      this.$emit('cancel');
      this.handleCloseDialog();
    },
    handleComfirm() {
      this.$emit('comfirm');
      this.handleCloseDialog();
    },
  },
};
</script>
