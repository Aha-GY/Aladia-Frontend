<template>
  <el-table
    ref="tableRef"
    :row-class-name="rowClassName"
    :border="border"
    :data="data"
    :height="height"
    :row-key="rowKey"
    @header-dragend="onHeaderDragend"
  >
    <!-- <i
            class="fa-light fa-grip-dots-vertical absolute top-1/2 right-2 -translate-y-1/2 cursor-move"
          ></i> -->
    <template v-for="item in columns" :key="item.label">
      <slot name="default" :item="item" />
    </template>
  </el-table>
</template>

<script>
import Sortable from 'sortablejs';

export default {
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
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
      default: '',
    },
    border: {
      type: Boolean,
      default: false,
    },
    rowClassName: {
      type: [Function, String],
      default: () => '',
    },
    headerDrag: {
      type: Boolean,
      default: false,
    },
    rowKey: {
      type: String,
      default: 'id',
    },
  },
  data() {
    return {
      startX: 0,
      startWidth: 0,
    };
  },
  mounted() {
    // setTimeout(() => {
    //   this.$nextTick(() => {
    //     const headers = this.$el.querySelectorAll(
    //       '.el-table__header-wrapper th',
    //     );
    //     const columns = this.$refs.tableRef.store.states.columns.value;
    //     headers.forEach((header, index) => {
    //       const column = columns[index];
    //       header.addEventListener('mousedown', (event) =>
    //         this.onMouseDown(event, column),
    //       );
    //     });
    //     if (this.headerDrag) {
    //       this.initTableHeaderDrag();
    //     }
    //   });
    // }, 1000);
  },
  methods: {
    initTableHeaderDrag() {
      const el = document.querySelector('.el-table__header-wrapper tr');
      Sortable.create(el, {
        handle: '.fa-grip-dots-vertical',
        animation: 150,
        onEnd: (evt) => {
          const oldItem = this.columns[evt.oldIndex];
          this.columns.splice(evt.oldIndex, 1);
          this.columns.splice(evt.newIndex, 0, oldItem);

          this.$nextTick(() => {
            this.initTableHeaderDrag();
          });
        },
      });
    },
    onHeaderDragend(newWidth, oldWidth, column, event) {
      if (this.minWidth) {
        column.width = newWidth < this.minWidth ? this.minWidth : newWidth;
      }
      this.$emit('header-dragend', newWidth, oldWidth, column, event);
    },
    onMouseDown(event, column) {
      const el = event.target;
      const target = el?.closest('th');
      const rect = target.getBoundingClientRect();
      if (rect.width > 12 && rect.right - event.pageX < 8) {
        if (!column.resizable) {
          return;
        }
        this.startX = event.clientX;
        this.startWidth = parseInt(column.width, 10);
        const onMouseMove = (e) => {
          const currentWidth = this.startWidth + (e.clientX - this.startX);
          column.width =
            currentWidth < this.minWidth ? this.minWidth : currentWidth;
          requestAnimationFrame(() => {
            this.$refs.tableRef.doLayout();
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
    },
  },
};
</script>
