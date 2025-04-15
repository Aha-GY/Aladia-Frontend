<template>
  <el-popover
    v-model:visible="open"
    trigger="hover"
    destroy-on-close
    placement="top-start"
    popper-class="no-padding"
    width="250"
  >
    <div class="p-2 text-xs">
      {{ $t('category.exchange.rate') }}
    </div>
    <template #reference>
      <i
        class="fa-circle-info cursor-pointer text-xs opacity-70 transition-all"
        :class="open ? 'fa-solid' : 'fa-light'"
        data-cy="5f06edf276b01611"
        @click="open = true"
      />
    </template>
  </el-popover>
</template>
<script setup>
const open = ref(false);
</script>
