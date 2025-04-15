<template>
  <el-popover
    v-model:visible="show"
    trigger="click"
    :show-arrow="false"
    placement="right"
    width="220"
  >
    <template #reference>
      <div
        class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-[#D9D9D999] transition-all hover:bg-white/5 hover:text-[#D9D9D9] active:scale-95"
      >
        <i class="fa-solid fa-ellipsis" />
      </div>
    </template>
    <PersonalDetailInfoOption @go-tab="goTab" />
  </el-popover>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    };
  },
  methods: {
    goTab(index) {
      this.$emit('goTab', index);
      this.show = false;
    },
  },
};
</script>
