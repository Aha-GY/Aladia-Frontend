<template>
  <el-popover
    ref="popup"
    :virtual-ref="buttonRef"
    :visible="open"
    :offset="offset"
    :placement="placement"
    :width="width"
    :popper-class="`table-popover !text-left !break-normal ` + popperClass"
    virtual-triggering
    :persistent="false"
    :teleported="teleported"
    :show-arrow="arrow"
    :popper-style="popperStyle"
    :popper-options="popperOptions"
  >
    <slot />
  </el-popover>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
    open: {
      type: Boolean,
      default: false,
    },
    store: {
      type: Object,
      default: () => ({}),
    },
    buttonRef: {
      type: Object,
      default: null,
    },
    placement: {
      type: String,
      default: 'right',
    },
    width: {
      type: Number,
      default: 300,
    },
    arrow: {
      type: Boolean,
      default: true,
    },
    offset: {
      type: Number,
      default: 10,
    },
    popperClass: {
      type: String,
      default: '',
    },
    popperStyle: {
      type: Object,
      default: () => ({}),
    },
    popperOptions: {
      type: Object,
      default: () => ({}),
    },
    teleported: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    async open(state) {
      if (state) {
        this.store.popupId = this.id;
      } else {
        this.store.popupId = '';
      }
    },
    'store.popupId'(state) {
      if (state && state !== this.id) {
        this.$emit('close');
      }
    },
  },
};
</script>

<style lang="scss">
.table-popover {
  .pcr-app[data-theme='monolith'] {
    padding: 0;
  }
}

.no-padding.el-popper {
  padding: 0 !important;
}
</style>
