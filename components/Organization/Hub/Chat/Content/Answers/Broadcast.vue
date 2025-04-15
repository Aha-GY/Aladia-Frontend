<template>
  <el-popover
    placement="right"
    :show-arrow="true"
    trigger="hover"
    :offset="5"
    popper-class=" !border-white/10 !px-1"
  >
    <template #reference>
      <div
        class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-white/40 transition-all hover:bg-white/5 active:scale-95"
      >
        <i class="fa-regular fa-bullhorn" />
      </div>
    </template>
    <OrganizationHubChatContentAnswersSource
      :message="message"
      :is-broadcast="true"
      :is-popup="isPopup"
    />
  </el-popover>
</template>
<script>
export default {
  props: {
    message: Object,
    isPopup: Boolean,
  },
};
</script>
