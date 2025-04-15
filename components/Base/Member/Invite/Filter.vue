<template>
  <el-popover
    :width="180"
    trigger="click"
    placement="bottom-end"
    :teleported="false"
  >
    <template #reference>
      <div
        class="flex size-6 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
      >
        <i class="fa-light fa-filter text-xs text-[#FAFAFA]" />
      </div>
    </template>
    <div class="flex flex-col gap-1 p-1">
      <div
        v-for="role in roles"
        :key="role.value"
        class="flex cursor-pointer items-center justify-between rounded px-2 py-1 text-sm hover:bg-white/10"
        data-cy="2803868857f3a7b5"
        @click="onCheck(role)"
      >
        <div class="flex items-center gap-1.5">
          <div class="flex size-5 items-center justify-center">
            <i :class="role.icon" />
          </div>
          {{ role.label }}
        </div>
        <BaseCheckboxStyle
          :state="filter.includes(role.value) ? 'correctChecked' : 'unchecked'"
        />
      </div>
    </div>
  </el-popover>
</template>

<script>
export default {
  props: {
    filter: {
      type: Array,
      default: () => [],
    },
    roles: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    onCheck(role) {
      const index = this.filter.indexOf(role.value);
      if (index === -1) {
        this.filter.push(role.value);
      } else {
        this.filter.splice(index, 1);
      }
    },
  },
};
</script>
