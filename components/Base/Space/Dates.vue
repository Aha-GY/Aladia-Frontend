<template>
  <el-popover
    v-model:visible="visible"
    trigger="click"
    width="190"
    placement="bottom-start"
    :disabled="cycles.length <= 1"
    :offset="5"
  >
    <template #reference>
      <div class="flex items-center">
        <div
          class="flex max-w-56 cursor-pointer items-center gap-1.5 rounded bg-white/5 px-0.5 text-xs font-medium text-[#909090] hover:bg-white/5 hover:text-white"
        >
          <div>
            {{ formatDate(active?.dates?.startDate, 'DD MMM YYYY') }} -
            {{ formatDate(active?.dates?.endDate, 'DD MMM YYYY') }}
          </div>
          <i v-if="cycles.length > 1" class="fa-light fa-chevron-down" />
        </div>
      </div>
    </template>
    <div class="flex max-h-72 flex-col overflow-y-auto p-1 text-xs">
      <div
        v-for="item in cycles"
        :key="item.id"
        class="cursor-pointer rounded px-2 py-1 text-[#909090] hover:bg-white/10 hover:text-white"
        @click="onClick(item)"
      >
        {{ formatDate(item.dates.startDate, 'DD MMM YYYY') }} -
        {{ formatDate(item.dates.endDate, 'DD MMM YYYY') }}
      </div>
    </div>
  </el-popover>
</template>

<script>
export default {
  props: {
    cycles: {
      type: Array,
      default: () => [],
    },
    cycleIds: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      visible: false,
      index: 0,
    };
  },
  computed: {
    active() {
      return this.cycles[this.index];
    },
  },
  watch: {
    cycleIds: {
      handler() {
        this.index =
          this.cycles.findIndex((cycle) => this.cycleIds.includes(cycle.id)) ||
          0;
        if (this.index === -1) {
          this.index = 0;
        }
      },
      immediate: true,
    },
  },
  methods: {
    onClick(item) {
      this.index = this.cycles.findIndex((cycle) => cycle.id === item.id);
      this.visible = false;
      this.$emit('change-cycle', item);
    },
  },
};
</script>
