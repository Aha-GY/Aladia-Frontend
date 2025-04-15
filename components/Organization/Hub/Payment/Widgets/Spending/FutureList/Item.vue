<template>
  <div
    class="flex cursor-pointer items-center justify-between gap-5 rounded-md p-1.5 text-center transition-all hover:bg-white/5"
  >
    <div class="flex w-0 flex-1 items-center gap-2">
      <BaseCourseThumbnail
        class="h-5 w-8 shrink-0"
        :url="item?.courseThumbnail.url"
      />
      <div class="truncate text-sm">{{ item.courseTitle }}</div>
    </div>
    <div class="text-xs text-[#707070]">
      {{ `${item.installmentNumber} out ${item.totalInstallment}` }}
    </div>
    <div class="w-18 shrink-0 text-xs text-[#707070]">
      {{ formatDate(item.installmentDate, 'DD MMM YYYY') }}
    </div>

    <div class="w-18 text-xs text-[#E4B53D]">
      <div class="flex items-center justify-end">
        <BaseIconCurrency :currency="item.currency" />
        <div class="ml-1">
          {{ moneyFormat(item.amountDue) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>
