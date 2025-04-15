<template>
  <div class="flex items-center">
    <BaseCourseThumbnail class="h-6 w-[2.375rem]" :url="course?.thumbnail" />
    <div class="truncate px-2 text-xs">
      {{ course?.title }}
    </div>

    <!-- design said no popup anymore, but I think it may get back -->
    <!-- <el-popover
      v-model:visible="open"
      trigger="hover"
      destroy-on-close
      placement="right-end"
      popper-class="no-padding"
      :width="350"
      :popper-options="{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [10, 10],
            },
          },
        ],
      }"
    >
      <OrganizationHubPaymentHistoryListProductPopover
        :item="item"
        @close="open = false"
      />

      <template #reference>
        <i
          class="fa-circle-info cursor-pointer text-xs opacity-70 transition-all"
          :class="open ? 'fa-solid' : 'fa-light'"
          data-cy="5f06edf276b01611"
          @click="open = true"
        />
      </template>
    </el-popover> -->
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

// const open = ref(false);
const course = computed(() => props.item.course);
</script>
