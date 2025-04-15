<template>
  <div v-if="props.showEvents" class="w-full">
    <div
      v-for="event in props.events"
      :key="event.id"
      class="flex items-center justify-between rounded-md py-2 pl-2 transition-colors hover:cursor-pointer hover:bg-[#FFFFFF0D]"
    >
      <div class="w-full" @click="openNewWebhookEvent(event)">
        <div class="text-base text-[#D9D9D9] hover:underline">
          <p v-html="highlightedEvent(event.name)" />
        </div>
        <p class="text-xs text-[#707070]">
          {{ event.description }}
        </p>
      </div>
      <div
        class="m-2 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full transition-all duration-300"
      >
        <BaseCheckboxStyle
          :state="isEventSelected(event.id) ? 'correctChecked' : 'unchecked'"
          :disabled="false"
          @click="toggleEventSelection(event.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWebhookStore } from '~/stores/webhook';

const props = defineProps({
  showEvents: {
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
});

const store = useWebhookStore();
function isEventSelected(eventId) {
  return store.selectedEventIds.includes(eventId);
}

function toggleEventSelection(eventId) {
  store.toggleEventSelection(eventId);
}

const openNewWebhookEvent = (event) => {
  store.selectedWebhookEventName = event.name;
  store.isEventDetail = true;
  store.selectedWebhookEvent = event;
  store.isSuccessTestWebhook = false;
};

// Computed property to highlight search text
const highlightedEvent = (eventName) => {
  if (!props.searchText.trim()) {
    return eventName; // Return the original event name if searchText is empty
  }

  // Escape special characters in the search text for the regex
  const escapedSearchText = props.searchText.replace(
    /[-/\\^$*+?.()|[\]{}]/g,
    '\\$&',
  );
  const regex = new RegExp(`(${escapedSearchText})`, 'gi');

  // Replace matched text with a span to apply the highlight
  return eventName.replace(
    regex,
    (match) =>
      `<span class="bg-yellow-500 bg-opacity-20 text-[#FED54A]">${match}</span>`,
  );
};
</script>
