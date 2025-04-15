<template>
  <div class="flex justify-between px-3 transition-all duration-300">
    <div class="flex items-center gap-1.5 text-xs text-[#D9D9D9]/80">
      <el-popover
        v-model:visible="sortShow"
        trigger="click"
        :width="1330"
        placement="bottom-start"
        :show-arrow="false"
      >
        <template #reference>
          <div
            class="flex h-7 min-w-[7.5rem] cursor-pointer items-center gap-2 rounded-md px-4 transition-all hover:bg-white/5 active:scale-95"
            :class="sortShow ? 'bg-[#060606]' : ''"
          >
            <i class="fa-light fa-arrow-down-arrow-up" />
            {{ $t('filter.sort.by') }}
            <i
              class="fa-light fa-chevron-down transition-all"
              :class="sortShow ? 'rotate-180' : ''"
            />
          </div>
        </template>
        <OrganizationHubHeaderSortFilter @close="sortShow = false" />
      </el-popover>
      <el-popover
        v-model:visible="dateShow"
        trigger="click"
        :width="540"
        placement="bottom-start"
        :show-arrow="false"
      >
        <template #reference>
          <div
            class="flex h-7 cursor-pointer items-center gap-2 rounded-md px-4 transition-all hover:bg-white/5 active:scale-95"
            :class="dateShow ? 'bg-[#060606]' : ''"
          >
            <i class="fa-light fa-calendar" />
            <div class="min-w-12">
              {{ $t('filter.date') }}
            </div>
            <i
              class="fa-light fa-chevron-down transition-all"
              :class="dateShow ? 'rotate-180' : ''"
            />
          </div>
        </template>
        <OrganizationHubHeaderDateFilter @close="dateShow = false" />
      </el-popover>
      <el-popover
        v-model:visible="spaceShow"
        trigger="click"
        :width="488"
        placement="bottom-start"
        :show-arrow="false"
      >
        <template #reference>
          <div
            class="flex h-7 cursor-pointer items-center gap-2 rounded-md px-4 transition-all hover:bg-white/5 active:scale-95"
            :class="spaceShow ? 'bg-[#060606]' : ''"
          >
            <i class="fa-light fa-folder" />
            <div class="min-w-12">
              {{ $t('index.sidebar.item.spaces') }}
            </div>
            <i
              class="fa-light fa-chevron-down transition-all"
              :class="spaceShow ? 'rotate-180' : ''"
            />
          </div>
        </template>
        <OrganizationHubHeaderSpaceFilter @close="spaceShow = false" />
      </el-popover>
      <el-popover
        v-model:visible="userShow"
        trigger="click"
        :width="650"
        placement="bottom-start"
        :show-arrow="false"
        :persistent="false"
      >
        <template #reference>
          <div
            class="flex h-7 cursor-pointer items-center gap-2 rounded-md px-4 transition-all hover:bg-white/5 active:scale-95"
            :class="userShow ? 'bg-[#060606]' : ''"
          >
            <i class="fa-light fa-user" />
            <div class="min-w-12">
              {{ $t('index.sidebar.item.spaces') }}
            </div>
            <i
              class="fa-light fa-chevron-down transition-all"
              :class="userShow ? 'rotate-180' : ''"
            />
          </div>
        </template>
        <OrganizationHubHeaderUserFilter @close="userShow = false" />
      </el-popover>
    </div>
    <BaseButton
      type="secondary"
      class="min-w-36"
      icon="fa-arrow-rotate-right"
      label="$t:base.filter.clear"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      sortShow: false,
      dateShow: false,
      spaceShow: false,
      userShow: false,
    };
  },
};
</script>
