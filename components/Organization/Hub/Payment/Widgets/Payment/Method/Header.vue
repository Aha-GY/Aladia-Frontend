<template>
  <div class="flex items-center justify-between">
    <i class="fa-light fa-credit-card" />
    <div class="text-lg font-semibold">Card Payment Method</div>
    <div class="flex items-center">
      <div
        class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-[#707070] transition-all hover:bg-white/5 hover:text-[#D9D9D9] hover:shadow-[0_4px_4px_rgba(0,0,0,0.4)]"
        data-cy="0b6609659beaaa29"
        @click="$emit('add')"
      >
        <i class="fa-light fa-plus" />
      </div>
      <el-popover
        v-model:visible="show"
        trigger="click"
        :width="160"
        :show-arrow="false"
        placement="bottom-end"
        :offset="8"
      >
        <template #reference>
          <div
            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-[#707070] transition-all hover:bg-white/5 hover:text-[#D9D9D9] hover:shadow-[0_4px_4px_rgba(0,0,0,0.4)]"
            :class="
              show
                ? 'shadow-[0_4px_4px_rgba(0,0,0,0.4) bg-white/5 text-[#D9D9D9]'
                : ''
            "
          >
            <i class="fa-light fa-ellipsis" />
          </div>
        </template>
        <OrganizationHubPaymentWidgetsPaymentMethodOption
          @hide-popup="show = false"
        />
      </el-popover>
    </div>
  </div>
</template>

<script setup>
const show = ref(false);
</script>
