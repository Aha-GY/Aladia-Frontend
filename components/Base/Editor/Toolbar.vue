<template>
  <div
    :id="id"
    class="quill-editor-toolbar flex items-center gap-1 transition-all *:size-8 *:opacity-80 *:transition-all hover:*:opacity-100"
    data-cy="3f1c9897f1aca601"
    @click="$emit('close')"
  >
    <button
      class="ql-bold hover-t-tooltip"
      :data-tooltip="$t('personal.profile.tooltip.bold')"
    />
    <button
      class="ql-italic hover-t-tooltip"
      :data-tooltip="$t('personal.profile.tooltip.italic')"
    />
    <button
      class="ql-strike hover-t-tooltip"
      :data-tooltip="$t('personal.profile.tooltip.strikethrough')"
    />
    <button
      class="ql-underline hover-t-tooltip"
      :data-tooltip="$t('personal.profile.tooltip.underline')"
    />
    <button
      class="ql-list hover-t-tooltip"
      value="ordered"
      :data-tooltip="$t('personal.profile.tooltip.numList')"
    />
    <button
      class="ql-list hover-t-tooltip"
      value="bullet"
      :data-tooltip="$t('personal.profile.tooltip.list')"
    />
    <button
      class="ql-blockquote hover-t-tooltip"
      :data-tooltip="$t('personal.profile.tooltip.blockquote')"
    />
    <button
      class="ql-code-block hover-t-tooltip"
      :data-tooltip="$t('personal.profile.tooltip.code')"
    />
  </div>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
    },
  },
  emits: ['close'],
};
</script>
<style lang="scss" scoped>
.quill-editor-toolbar {
  &.ql-toolbar.ql-snow {
    padding: 0;
  }
  &.ql-toolbar button {
    font-size: 0.875rem;
    width: 1.875rem !important;
    height: 1.875rem !important;
    padding: 0.375rem !important;
    svg {
      float: none !important;
    }
  }
  .ql-active {
    //opacity: 1;
    color: white !important;
    stroke: white !important;

    border-radius: 0.3125rem;
    background-color: rgba(255, 255, 255, 0.1) !important;

    :deep(.ql-stroke) {
      stroke: white !important;
    }
    :deep(.ql-fill) {
      fill: white !important;
    }
  }
  :deep(.ql-fill) {
    fill: #fff !important;
  }

  :deep(.ql-stroke) {
    stroke: #fff !important;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1;
  }
  :deep(.ql-thin) {
    stroke-width: 1;
  }
  &.ql-toolbar button:hover,
  &.ql-toolbar .ql-picker-item:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
    border-radius: 0.3125rem;
  }
  .hover-t-tooltip:hover:after {
    background-color: #060606;
    border-color: rgba(255, 255, 255, 0.2);
    border-width: 0.0313rem;
  }
}
</style>
