<template>
  <div
    class="my-0.5 rounded-5 border-x border-transparent pl-[0.4375rem] pr-1.5"
    :class="[
      showEvents ? 'my-0.5 bg-white/5 pb-1.5' : 'hover:bg-white/5',
      eventHover || showEvents ? 'border-l-[1px] border-l-[#F1F1F1]' : '',
    ]"
    @mouseenter="eventHover = true"
    @mouseleave="eventHover = false"
  >
    <!-- Header section with toggle and main selection -->
    <div
      class="flex h-[2.5rem] cursor-pointer items-center gap-2 px-1"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
    >
      <div
        class="relative flex h-6 w-6 items-center justify-center rounded-5 hover:bg-white/5"
        @click="toggleEvents"
      >
        <i
          :data-cy="`${props.dataCy}-toggle-event`"
          :class="[
            hover
              ? `fa-light fa-chevron-right text-xs transition-all duration-300 ${showEvents && 'rotate-90'}`
              : showEvents || areAllEventsSelected
                ? `fas ${iconClass}`
                : `fa-light ${iconClass}`,
          ]"
        />
      </div>

      <div class="flex flex-1 items-center gap-2" @click="toggleEvents">
        <div class="truncate text-base text-[#D9D9D9]">
          <p v-html="highlightedCategory" />
        </div>
        <div
          class="w-17 flex items-center gap-[0.375rem] rounded-[0.3125rem] bg-[#E2E2E208] px-1.5 py-[0.1875rem] text-xs text-[#707070]"
        >
          {{
            eventCount > 1
              ? $t('personal.event.more', { count: eventCount })
              : $t('personal.event.one', { count: eventCount })
          }}
        </div>
      </div>

      <div
        class="mx-1 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full transition-all duration-300"
      >
        <BaseCheckboxStyle
          :data-cy="`${props.dataCy}-toggle-event-checkbox`"
          :state="
            store.selectedEventIds.length && areAllEventsSelected
              ? 'correctChecked'
              : store.selectedEventIds.length && areSomeEventsSelected
                ? 'halfChecked'
                : 'unchecked'
          "
          :disabled="false"
          @click="onSelectedId(props.events)"
        />
      </div>
    </div>
    <ProfileSettingDialogMenuWebhookEvent
      :show-events="showEvents"
      :events="props.events"
      :search-text="props.searchText"
    />
  </div>
</template>

<script setup>
import { useWebhookStore } from '~/stores/webhook';

const props = defineProps({
  iconClass: {
    type: String,
    default: 'fa-user',
  },
  category: {
    type: String,
  },
  eventCount: {
    type: Number,
    default: 0,
  },
  treeList: {
    type: Boolean,
    default: false,
  },
  searchText: {
    type: String,
    default: '',
  },
  events: {
    type: Array,
    default: () => [],
  },
  dataCy: {
    type: String,
    default: '',
  },
});

const store = useWebhookStore();
// Show events list based on prop
const showEvents = ref(props.treeList);
const eventHover = ref(false);
const hover = ref(false);
const eventsData = ref(props.events);

watch(
  () => props.treeList,
  () => {
    showEvents.value = props.treeList;
  },
  { immediate: true },
);

watch(
  () => props.searchText,
  (newSearchText) => {
    if (newSearchText.trim() === '') {
      showEvents.value = false; // Hide events when searchText is empty
    } else {
      const eventFound = props.events.some((event) =>
        event.name.toLowerCase().includes(newSearchText.toLowerCase()),
      );
      showEvents.value = eventFound;
    }
  },
  { immediate: true }, // Ensure this runs on initial load as well
);
// Check if all events are selected
const areAllEventsSelected = computed(() =>
  eventsData.value.every((event) => store.selectedEventIds.includes(event.id)),
);

const areSomeEventsSelected = computed(() =>
  eventsData.value.some((event) => store.selectedEventIds.includes(event.id)),
);

function onSelectedId(events) {
  if (!events || !Array.isArray(events)) {
    return;
  }

  // Function to extract IDs from the array
  const selectedIds = events.map((item) => item.id);

  if (areAllEventsSelected.value) {
    store.deselectAllEventsInCategory(selectedIds);
  } else {
    store.selectAllEventsInCategory(selectedIds);
  }
}

// Toggle visibility of events list
function toggleEvents() {
  showEvents.value = !showEvents.value;
}

// Computed property to highlight search text
const highlightedCategory = computed(() => {
  if (!props.searchText.trim()) {
    return props.category;
  }

  // Escape special characters in the search text for the regex
  const escapedSearchText = props.searchText.replace(
    /[-/\\^$*+?.()|[\]{}]/g,
    '\\$&',
  );
  const regex = new RegExp(`(${escapedSearchText})`, 'gi');

  // Replace matched text with a span to apply the highlight
  return props.category.replace(
    regex,
    (match) =>
      `<span class="bg-yellow-500 bg-opacity-20  text-[#FED54A]">${match}</span>`,
  );
});
</script>
