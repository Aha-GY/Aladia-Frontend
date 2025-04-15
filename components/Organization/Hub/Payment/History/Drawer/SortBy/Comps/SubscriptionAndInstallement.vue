<template>
  <div class="rounded-lg p-4 text-[#FAFAFA]">
    <div class="space-y-3">
      <div
        v-if="hubPaymentStore.dataType === DATA_TYPES.CUSTOMER"
        class="flex items-center text-base"
      >
        <i class="fa-regular fa-calendar-check p-2 text-[#707070]" />
        <h1>{{ $t('payment.sort.subs') }}</h1>
      </div>
      <div v-else class="flex items-center text-base">
        <i class="fa-solid fa-screwdriver-wrench p-2 text-[#707070]" />
        <h1>
          {{ $t('payment.sort.installement') }}
        </h1>
      </div>
      <div
        v-for="option in sortedOptions"
        :key="option.text"
        class="flex cursor-pointer items-center justify-between rounded-5 px-2 py-[1px] hover:bg-white/5"
        @click="toggleSortOption(option.text)"
      >
        <!-- Checkbox for Sorting -->
        <div class="flex items-center gap-2">
          <BaseCheckboxStyle
            :state="
              hubPaymentStore.sortState.selectedOption === option.text
                ? 'correctChecked'
                : 'unchecked'
            "
          />
          <span>{{ $t(option.text) }}</span>
        </div>
        <!-- Popover for Sorting Options -->
        <el-popover
          ref="statusPopup"
          width="11.2rem"
          trigger="click"
          :show-arrow="false"
          placement="bottom-end"
          :popper-options="{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 10],
                },
              },
            ],
          }"
        >
          <div
            v-for="sortOption in option.sortOptions"
            :key="sortOption"
            class="flex items-center p-2"
            @click.stop="updateSortOrder(option.text, sortOption)"
          >
            <!-- Add an icon dynamically based on sortOption -->
            <div
              class="w-[10rem] cursor-pointer rounded-5 p-2 hover:bg-white/5"
            >
              <i
                :class="getSortOptionIcon(sortOption)"
                class="text-sm text-[#B0B0B0]"
              />
              <span class="ml-3">
                {{ $t(sortOption) }}
              </span>
            </div>
          </div>
          <template #reference>
            <span
              class="flex w-[11.2rem] cursor-pointer items-center justify-between gap-2 rounded-5 bg-white/5 px-2"
              @click.stop
            >
              <div class="flex items-center gap-2 text-[#B0B0B0]">
                <i :class="option.icon" class="text-sm text-[#FAFAFA]" />
                <span>
                  {{
                    $t(
                      selectedSortOption === option.text
                        ? getCurrentOrder(option.text)
                        : option.sortOptions[0],
                    )
                  }}
                </span>
              </div>
              <i class="fa fa-chevron-down rounded-5 p-2 hover:bg-white/5" />
            </span>
          </template>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  DATA_TYPES,
  SORTED_OPTIONS,
  SORT_OPTION_ICONS,
} from '~/constant/payment';

const hubPaymentStore = useHubPaymentStore();

// Compute sorted options for the current data type
const sortedOptions = computed(() => {
  if (hubPaymentStore.dataType === DATA_TYPES.CUSTOMER) {
    return [...SORTED_OPTIONS[DATA_TYPES.CUSTOMER].subscriptions];
  } else if (hubPaymentStore.dataType === DATA_TYPES.SUB_INCOME) {
    return [...SORTED_OPTIONS[DATA_TYPES.SUB_INCOME].installments];
  } else if (hubPaymentStore.dataType === DATA_TYPES.SUB_SPENDING) {
    return [...SORTED_OPTIONS[DATA_TYPES.SUB_SPENDING].installments];
  }
  return SORTED_OPTIONS[hubPaymentStore.dataType] || [];
});

// Get icon for a specific sort option
function getSortOptionIcon(sortOption) {
  return SORT_OPTION_ICONS[sortOption];
}

// Handle toggling sort options
function toggleSortOption(sortCategory) {
  if (hubPaymentStore.sortState.selectedOption === sortCategory) {
    hubPaymentStore.setSortOption(null);
  } else {
    hubPaymentStore.setSortOption(sortCategory);
    hubPaymentStore.setSortOrder(sortCategory, getDefaultOrder(sortCategory));
  }
  handleClickSort(sortCategory);
}

// Get the default order for a sort category
function getDefaultOrder(sortCategory) {
  const category = sortedOptions.value.find(
    (option) => option.text === sortCategory,
  );
  return category ? category.sortOptions[0] : '';
}

// Get the current order for a sort category
function getCurrentOrder(sortCategory) {
  return (
    hubPaymentStore.getSortOrder(sortCategory) || getDefaultOrder(sortCategory)
  );
}

// Update the sort order
function updateSortOrder(sortCategory, sortOption) {
  if (hubPaymentStore.sortState.selectedOption !== sortCategory) {
    hubPaymentStore.setSortOption(sortCategory);
  }
  hubPaymentStore.setSortOrder(sortCategory, sortOption);
  handleClickSort(sortCategory, sortOption);
}

// Trigger sorting logic
function handleClickSort(sortCategory, sortOrder = null) {
  const order = sortOrder || getCurrentOrder(sortCategory);
  hubPaymentStore.updateSort(sortCategory, order);
}
</script>
