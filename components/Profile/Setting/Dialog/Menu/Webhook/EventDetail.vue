<template>
  <el-drawer
    v-model="show"
    :with-header="true"
    :show-close="false"
    :lock-scroll="false"
    destroy-on-close
    :close-on-press-escape="false"
    class="h-full !w-[30rem]"
    @close="handleCloseDrawer"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div
            class="mr-3 flex h-6 w-6 cursor-pointer items-center justify-center"
            @click="handleCloseDrawer"
          >
            <i class="fa-sharp fa-solid fa-arrow-left text-lg" />
          </div>
          <div class="text-lg">
            {{ props.title }}
          </div>
        </div>
      </div>
    </template>

    <div
      :class="{
        'p-2': !isLeftDrawer,
      }"
      class="h-full w-full p-1 pb-4"
    >
      <div
        class="flex h-full w-full flex-1 flex-col overflow-hidden rounded-[0.3125rem] border-l-[0.0625rem] bg-[#E2E2E208] p-3 shadow-md hover:border-l-[#F1F1F1]"
      >
        <!-- Header Section -->
        <div class="mb-3 flex w-full justify-between">
          <h3 class="text-base font-medium text-white">
            {{ store.selectedWebhookEventName }}
          </h3>
          <BaseButton
            :disabled="store.isLoadingTestWebhook"
            :loading="store.isLoadingTestWebhook"
            class="flex items-center gap-2 rounded bg-[#E0B92C] px-3 py-1.5 text-sm font-semibold text-black transition hover:bg-yellow-500"
            @click="props.testWebhook"
          >
            <i
              v-if="!store.isLoadingTestWebhook && !store.isSuccessTestWebhook"
              class="fa-solid fa-webhook"
            />
            <i
              v-if="store.isSuccessTestWebhook"
              class="fa-light fa-check text-black"
            />
            <span v-if="store.isLoadingTestWebhook">Sending Payload</span>
            <span v-else-if="store.isSuccessTestWebhook">Test data sent!</span>
            <span v-else>Test Event</span>
          </BaseButton>
        </div>

        <!-- JSON Viewer -->
        <div
          class="mb-5 w-full rounded-[0.3125rem] bg-[#1A1A1A] pb-0 text-[#707070] shadow-lg"
        >
          <div
            class="relative flex w-full items-center justify-between rounded-t bg-[#FFFFFF0D] px-4 py-3 text-white"
          >
            <h1 class="font-medium">Event Data</h1>
            <button
              class="absolute right-5 flex items-center rounded-md p-1.5 text-sm font-semibold transition hover:bg-[#FFFFFF0D]/10"
              @click="copyToClipboard"
            >
              <i :class="copyIconClass" />
              <span v-show="copied" class="ml-2 text-sm font-light">
                copied
              </span>
            </button>
          </div>

          <!-- Display JSON in formatted way -->
          <pre class="h-min rounded-b-lg px-2 text-left text-gray-200">
            <code class="  text-left">
              <div class="-mt-6">{</div>
         
                <ul class="  ml-5 -mt-20 mb-0 leading-3 tracking-wider text-base">
                  <li v-for="(value, key) in jsonData" :key="key" class=" leading-6 gap-0 flex text-left">
                    <span :class="[getKeyStyle(key), 'left-10']">"{{ key }}":  </span>
                    <span :class="[getValueStyle(value),'flex']">
                      <template v-if="typeof value === 'object' && value !== null">
                        <div class="-mt-12 -left-10">
                        <div class=" text-left -left-44  w-2 h-5"> {</div>
                        <ul class="  mb-0  -ml-20 -mt-14 text-left leading-3">
                          <li v-for="(subValue, subKey) in value" :key="subKey" class=" leading-6 flex">
                            <span :class="getKeyStyle(subKey)">"{{ subKey }}":  </span>
                            <span :class="getValueStyle(subValue)">{{ subValue }}</span>
                          </li>
                        </ul>
                        <div class=" text-left -ml-24 -mt-16  w-2 h-5"> }</div>
                        </div>
                      </template>
                      <template v-else>
                        {{ value }}
                      </template>
                    </span>
                  </li>
                </ul>
            <div class="-mt-28">  }</div>
            </code>
          </pre>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { useWebhookStore } from '~/stores/webhook';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  testWebhook: {
    type: Function,
    required: true,
  },
  isLeftDrawer: {
    type: Boolean,
    default: false,
  },
});

// Show drawer state
const emit = defineEmits(['update:modelValue']);

// Computed for v-model
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Copy button state
const copied = ref(false);
const copyIconClass = ref('fa-light fa-copy'); // Default icon
const store = useWebhookStore();

// JSON Data
const jsonData = {
  object: {
    id: 'string',
    object: 'string',
    created: 'timestamp',
    deletes_after: 'int',
    frozen_time: 'int',
    livemode: 'boolean',
    name: 'string',
    status: 'string',
    status_details: {},
  },
};

// Function to handle closing the drawer
function handleCloseDrawer() {
  store.isSuccessTestWebhook = false;
  emit('update:modelValue', false); // Close drawer
}

// Copy to clipboard function
function copyToClipboard() {
  const jsonText = JSON.stringify(jsonData, null, 2);
  navigator.clipboard.writeText(jsonText).then(() => {
    // Change icon to "copied"
    copyIconClass.value = 'fa-light fa-check';
    copied.value = true;

    // Revert after 3 seconds
    setTimeout(() => {
      copyIconClass.value = 'fa-light fa-copy';
      copied.value = false;
    }, 2000);
  });
}

// Function to determine the style of the key based on its name
const getKeyStyle = () => 'text-[#9CDCFE] '; // Apply color to all keys
// Function to determine the style of the value based on its data type
const getValueStyle = (value) => {
  if (value === 'string') {
    return 'text-[#CE9178]';
  } // String color
  if (value === 'boolean') {
    return 'text-[#569CD6]';
  } // Boolean color
  if (value === 'int' || value === 'int' || value === 'timestamp') {
    return 'text-[#B5CEA8]';
  } // Int or Timestamp color
  return 'text-gray-200'; // Default color for other values
};
</script>
