<template>
  <el-rate
    class="inlinerate"
    :model-value="rating"
    :colors="resultColors"
    :size="size"
    :allow-half="allowHalf"
    :disabled="disabled"
  />
</template>

<script>
export default {
  props: {
    rating: [Number, String],
    colors: {
      type: Array,
      default: () => ['#FAFAFA', '#FAFAFA', '#FAFAFA', '#FAFAFA', '#FAFAFA'],
    },
    allowHalf: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'default',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    primaryColor: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    resultColors() {
      if (this.primaryColor) {
        return ['#FDCC1E', '#FDCC1E', '#FDCC1E', '#FDCC1E', '#FDCC1E'];
      }
      return this.colors;
    },
  },
};
</script>

<style lang="scss" scoped>
.inlinerate {
  :deep(.el-rate__item) {
    .el-rate__icon {
      margin-right: 0 !important;
    }
  }
}
</style>
