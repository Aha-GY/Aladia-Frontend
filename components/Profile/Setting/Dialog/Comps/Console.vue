<template>
  <div
    class="sticky bottom-0 left-0 flex w-full justify-end bg-[#060606] px-4 py-4"
    :class="{
      'shadow-[0_-6px_6px_rgba(0,0,0,0.8)]': props.shadow,
    }"
  >
    <BaseButton
      :disabled="status.loading || status.resetloading"
      :loading="status.resetloading"
      :label="props.resetLabel"
      type="tertiary"
      data-cy="personal-reset-all-button"
      @click="onReset"
    />
    <BaseButton
      :disabled="status.loading || props.disabledSave"
      :loading="status.loading"
      class="ml-3"
      :label="props.saveLabel"
      data-cy="personal-save-changes-button"
      @click="onSave"
    />
  </div>
</template>
<script setup>
const props = defineProps({
  shadow: {
    type: Boolean,
    default: true,
  },
  disabledSave: Boolean,
  resetLabel: {
    type: String,
    default: '$t:personal.reset.all',
  },
  saveLabel: {
    type: String,
    default: '$t:personal.save.changes',
  },
});
const emits = defineEmits(['reset', 'save']);

const status = reactive({
  loading: false,
  resetloading: false,
});

const onReset = () => {
  if (status.resetloading) {
    return false;
  }
  status.resetloading = true;
  emits('reset', () => {
    status.resetloading = false;
  });
};
const onSave = () => {
  if (status.loading || props.disabledSave) {
    return false;
  }
  status.loading = true;
  emits('save', () => {
    status.loading = false;
  });
};
</script>
