<template>
  <!-- https://element-plus.org/zh-CN/component/table-v2.html -->
  <!-- design for rendering large number of datas -->
  <client-only>
    <el-table-v2
      class="hub-table hub-v2-table"
      :width="totalWidth"
      :height="scrollHeight"
      :header-height="headerHeight"
      :columns="columns"
      :data="data"
      :row-class="highLightBg ? 'high-light-bg' : ''"
    />
  </client-only>
</template>

<script setup>
const props = defineProps({
  /**
   * columnsObject: {
   *  key: string,
   *  dataKey: string,
   *  width: number,
   *  title?: string,
   * }
   */
  columns: {
    type: Object,
    default() {
      return {};
    },
    validator(columnsValue, _props) {
      if (!Array.isArray(columnsValue)) {
        return false;
      }
      if (columnsValue.length) {
        const columnObject = columnsValue[0];
        return columnObject.width !== undefined;
      }
      return true;
    },
  },
  headerHeight: {
    type: Number,
    default() {
      return 50;
    },
  },
  width: {
    type: Number,
  },
  data: {
    type: Object,
    default() {
      return {};
    },
  },
  highLightBg: {
    type: Boolean,
    default: false,
  },
});

const totalWidth = computed(() => {
  if (props.width) {
    return props.width;
  }
  return getTotolWidth(props.columns);
});

const scrollHeight = computed(() => {
  const caclRes = 50 * props.data.length < 400 ? 50 * props.data.length : 400;
  return caclRes;
});

function getTotolWidth(columns) {
  const totalVal = columns.reduce(
    (acc, column) => acc + parseInt(column.width),
    0,
  );
  return totalVal;
}
</script>
<style lang="scss">
.hub-v2-table {
  .el-table-v2__row-cell {
    padding: 0 12px;
    border-bottom: 1px solid rgb(255 255 255 / 0.1);
  }

  .el-table-v2__row:hover {
    border-bottom: 1px solid #7c7c7c;
  }

  .high-light-bg {
    background: rgba(255, 255, 255, 0.03);
  }
}
</style>
