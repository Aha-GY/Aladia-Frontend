<template>
  <div class="mb-2 flex items-center gap-3 bg-[#0C0C0C] p-2 text-xs">
    <BaseIconBack
      v-if="navLen !== 1"
      data-cy="3b6f4a752c0fac8c"
      class="text-[#707070]"
      @click="handleClickBack"
    />
    <BaseIconClose
      v-else
      data-cy="994f25c58550b25d"
      class="text-[#707070]"
      @click="emits('close')"
    />
    <div v-if="navLen === 1">
      <OrganizationHubPaymentHistoryDialogCompsNavigationItem
        :data-type="activeItem.dataType"
      />
    </div>
    <div v-else-if="navLen === 2" class="flex items-center gap-2">
      <OrganizationHubPaymentHistoryDialogCompsNavigationItem
        :data-type="dialogNavHistory[0].dataType"
        :active="false"
        @click="handleClickNavItem(dialogNavHistory[0])"
      />
      <i class="fa-solid fa-chevron-right" />
      <OrganizationHubPaymentHistoryDialogCompsNavigationItem
        :data-type="activeItem.dataType"
      />
    </div>
    <div v-else-if="navLen === 3" class="flex items-center gap-2">
      <OrganizationHubPaymentHistoryDialogCompsNavigationItem
        :data-type="dialogNavHistory[0].dataType"
        :active="false"
        @click="handleClickNavItem(dialogNavHistory[0])"
      />
      <i class="fa-solid fa-chevron-right" />
      <OrganizationHubPaymentHistoryDialogCompsNavigationItem
        :data-type="dialogNavHistory[1].dataType"
        :active="false"
        @click="handleClickNavItem(dialogNavHistory[1])"
      />
      <i class="fa-solid fa-chevron-right" />
      <OrganizationHubPaymentHistoryDialogCompsNavigationItem
        :data-type="activeItem.dataType"
      />
    </div>
    <div v-else-if="navLen > 3" class="flex items-center gap-2">
      <OrganizationHubPaymentHistoryDialogCompsNavigationItem
        :data-type="dialogNavHistory[0].dataType"
        :active="false"
        @click="handleClickNavItem(dialogNavHistory[0])"
      />
      <i class="fa-solid fa-chevron-right" />
      <el-popover width="13rem" popper-class="no-padding" trigger="hover">
        <template #reference>
          <div class="cursor-pointer">...</div>
        </template>
        <OrganizationHubPaymentHistoryDialogCompsNavigationItem
          v-for="item in dropDownItems"
          :key="item.dataType"
          :data-type="item.dataType"
          class="p-2 text-xs hover:bg-white/10"
          :active="false"
          @click="handleClickNavItem(item)"
        />
      </el-popover>
      <i class="fa-solid fa-chevron-right" />
      <OrganizationHubPaymentHistoryDialogCompsNavigationItem
        :data-type="activeItem.dataType"
      />
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(['close']);

const hubPaymentStore = useHubPaymentStore();
const dialogNavHistory = computed(() => hubPaymentStore.dialogNavHistory);
const activeItem = computed(() => dialogNavHistory.value.at(-1));
const navLen = computed(() => dialogNavHistory.value.length);
const dropDownItems = computed(() => dialogNavHistory.value.slice(1, -1));

function handleClickBack() {
  hubPaymentStore.removeLastDialogNavHistory();
}

function handleClickNavItem(item) {
  if (item.dataType) {
    hubPaymentStore.addDialogNavHistory(item);
  }
}
</script>
