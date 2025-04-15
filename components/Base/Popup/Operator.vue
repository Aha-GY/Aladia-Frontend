<template>
  <div class="flex items-center gap-3">
    <div
      class="relative flex h-4 w-8 cursor-pointer items-center rounded-full border border-white/10 bg-black"
      data-cy="595a6777fcda9689"
      @click="onOperatorClick"
    >
      <div
        class="absolute flex h-5 w-5 items-center justify-center rounded-full text-xs transition-all"
        :class="
          operator === 'and'
            ? 'left-4 bg-[#2f253e] text-[#874de3]'
            : '-left-1 bg-[#273421] text-[#62ab3b]'
        "
      >
        <div class="shrink-0 scale-[0.6]">
          {{ operator === 'and' ? 'AND' : 'OR' }}
        </div>
      </div>
    </div>
    <el-tooltip
      popper-class="operator-tooltip"
      :show-arrow="false"
      placement="right"
      effect="light"
    >
      <i
        class="fa-solid fa-circle-info translate-y-[1px] cursor-pointer text-xs opacity-40 transition-all duration-300 hover:opacity-100"
      />
      <template #content>
        <div class="text-xs text-[#707070]">
          <div class="mb-1 flex">
            <div class="mr-2 mt-1.5 h-1 w-1 rounded-full bg-[#707070]" />
            <div>
              <div>
                <span style="color: #9747ff">AND</span>
                filters show results which
              </div>
              <div>comprehend all selected fields.</div>
            </div>
          </div>
          <div class="flex">
            <div class="mr-2 mt-1.5 h-1 w-1 rounded-full bg-[#707070]" />
            <div>
              <div>
                <span style="color: #44ad1f">OR</span>
                filters show results which
              </div>
              <div>comprehend at least one selected field.</div>
            </div>
          </div>
        </div>
      </template>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    operator: String,
  },
  methods: {
    onOperatorClick() {
      this.$emit('operator', this.operator === 'and' ? 'or' : 'and');
    },
  },
};
</script>

<style lang="scss">
.operator-tooltip {
  background-color: #000 !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}
</style>
