<template>
  <div ref="el" class="h-full">
    <el-table
      ref="tableRef"
      class="hub-table"
      :row-class-name="rowClassName"
      :border="border"
      :data="data"
      :height="height"
      :row-key="rowKey"
      :default-expand-all="defaultExpandAll"
      :expand-row-keys="expandRowKeys"
      :highlight-current-row="highlightCurrentRow"
      @header-dragend="onHeaderDragend"
      @cell-mouse-enter="handleCellMouseEnter"
      @cell-mouse-leave="handleCellMouseLeave"
      @row-click="handleRowClick"
    >
      <slot name="default" />
      <template #empty>
        <slot name="empty" />
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    minWidth: {
      type: Number,
      default: 120,
    },
    data: {
      type: Array,
      default: () => [],
    },
    height: {
      type: [String, Number],
      default: '100%',
    },
    border: {
      type: Boolean,
      default: false,
    },
    rowClassName: {
      type: [Function, String],
      default: () => '',
    },
    rowKey: {
      type: String,
      default: 'id',
    },
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    expandRowKeys: {
      type: Array,
      default: null,
    },
    highlightCurrentRow: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'header-dragend',
    'cell-mouse-enter',
    'cell-mouse-leave',
    'row-click',
  ],
  setup(props) {
    const el = ref(null);
    const tableRef = ref(null);
    let timer = null;
    onMounted(() => {
      timer = setTimeout(() => {
        nextTick().then(() => {
          const headers = el.value.querySelectorAll(
            '.el-table__header-wrapper th',
          );
          const columns = tableRef.value?.store?.states?.columns?.value || [];
          headers.forEach((header, index) => {
            const column = columns[index];
            useEventListener(header, 'mousedown', (evt) => {
              onMouseDown(evt, column);
            });
          });
        });
      }, 1000);
    });
    onUnmounted(() => {
      clearTimeout(timer);
    });
    const onMouseDown = (event, column) => {
      const el = event.target;
      const target = el?.closest('th');
      const rect = target.getBoundingClientRect();
      if (rect.width > 12 && rect.right - event.pageX < 8) {
        if (!column.resizable) {
          return;
        }
        const startX = event.clientX;
        const startWidth = parseInt(column.width || column.realWidth, 10);
        const onMouseMove = (e) => {
          const currentWidth = startWidth + (e.clientX - startX);
          column.width =
            currentWidth < props.minWidth ? props.minWidth : currentWidth;
          requestAnimationFrame(() => {
            tableRef.value.doLayout();
            document.body.style.cursor = 'col-resize';
          });
        };

        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          document.body.style.cursor = '';
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      }
    };

    return { el, tableRef };
  },
  methods: {
    onHeaderDragend(newWidth, oldWidth, column, event) {
      if (this.minWidth) {
        column.width = newWidth < this.minWidth ? this.minWidth : newWidth;
      }
      this.$emit('header-dragend', newWidth, oldWidth, column, event);
    },
    handleCellMouseEnter(row, column, cell, event) {
      this.$emit('cell-mouse-enter', row, column, cell, event);
    },
    handleCellMouseLeave(row, column, cell, event) {
      this.$emit('cell-mouse-leave', row, column, cell, event);
    },
    handleRowClick(row, column, event) {
      this.$emit('row-click', row, column, event);
    },
  },
};
</script>
