<template>
  <el-drawer
    v-model="show"
    :with-header="true"
    :show-close="false"
    :lock-scroll="false"
    :close-on-press-escape="false"
    class="h-full !w-[30rem] cursor-default"
    @close="handleCloseDrawer"
  >
    <template #header>
      <div class="flex items-center justify-between pl-0 pt-0">
        <div class="flex items-center">
          <div
            data-cy="webhook-log-back-button"
            class="mr-3 flex h-6 w-6 cursor-pointer items-center justify-center"
            @click="handleCloseDrawer"
          >
            <i class="fa-sharp fa-solid fa-arrow-left text-lg" />
          </div>
          <div class="text-lg">
            {{ $t('personal.webhook.label') }}
          </div>
        </div>
      </div>
    </template>
    <div
      :class="{
        '-mt-3 p-4': !isLeftDrawer,
      }"
      class="bg-[#060606] pb-[1rem]"
    >
      <div
        class="w-full items-center justify-between rounded-[0.3125rem] border-l bg-[#FFFFFF0D] px-2"
        :class="{
          'border-[#86EFAC]':
            store.webhookLog.responseCode === 200 ||
            store.webhookLog.responseCode === 201,
          'border-[#EF4444]':
            store.webhookLog.responseCode === 400 ||
            store.webhookLog.responseCode === 404 ||
            store.webhookLog.responseCode === 401 ||
            store.webhookLog.responseCode === 503,
        }"
      >
        <div
          class="order-0 flex flex-none flex-grow-0 flex-row items-center justify-between self-stretch rounded-[0.3125rem] p-0"
        >
          <div
            class="order-0 flex flex-none flex-grow flex-row items-center gap-[0.5rem] self-stretch py-[0.5rem]"
          >
            <i
              :class="[
                getStatusIconClass(store.webhookLog.responseCode),
                getStatusColorIconClass(store.webhookLog.responseCode),
              ]"
              class="p-1 text-sm"
            />
            <div
              class="order-1 flex flex-none flex-grow flex-row items-center justify-start gap-[0.5rem] p-0"
            >
              <span
                data-cy="webhook-event-code"
                :class="[
                  'order-0 flex h-[1.5rem] flex-none flex-grow-0 flex-row items-center justify-center gap-[0.375rem] rounded-[0.3125rem] p-[0.1875rem_0.375rem]',
                  getStatusColorClass(store.webhookLog.responseCode),
                  statusClass(store.webhookLog.responseCode),
                ]"
              >
                <span>{{ store.webhookLog.responseCode }}</span>
              </span>
              <span
                data-cy="webhook-event-name"
                class="font-inter order-1 flex flex-none flex-grow items-center truncate text-[1rem] font-normal leading-[1.1875rem] text-[#D9D9D9]"
              >
                {{ store.webhookLog.eventName }}
              </span>
            </div>
          </div>
          <span
            class="font-inter text-rig order-0 flex-none flex-grow-0 text-[0.75rem] font-medium leading-[1] text-[#707070]"
          >
            {{ dateFormat12(store.webhookLog.createdAt) }}
          </span>
        </div>
        <div
          class="flex flex-col justify-around gap-[1rem] p-2 pl-2 pr-0.5 text-base font-light text-[#E2E2E2]"
        >
          <div class="grid h-full w-full grid-cols-12 gap-x-[0.5rem]">
            <!-- Details of the event -->

            <!-- Keys -->
            <div
              class="col-span-2 flex flex-col gap-[0.375rem] truncate whitespace-nowrap"
            >
              <p
                class="font-inter order-0 flex-none flex-grow-0 text-[0.75rem] font-normal leading-[1.5rem] text-[#989898]"
              >
                {{ $t('nav.header.update.status') }}
              </p>
              <p
                class="font-inter order-0 flex-none flex-grow-0 text-[0.75rem] font-normal leading-[1.5rem] text-[#989898]"
              >
                {{ $t('nav.header.update.id') }}
              </p>
              <p
                class="font-inter order-0 flex-none flex-grow-0 text-[0.75rem] font-normal leading-[1.5rem] text-[#989898]"
              >
                {{ $t('nav.header.update.time') }}
              </p>
              <p
                class="font-inter order-0 flex-none flex-grow-0 text-[0.75rem] font-normal leading-[1.5rem] text-[#989898]"
              >
                {{ $t('nav.header.update.ip') }}
              </p>

              <p
                class="font-inter order-0 flex-none flex-grow-0 text-[0.75rem] font-normal leading-[1.5rem] text-[#989898]"
              >
                {{ $t('nav.header.update.api') }}
              </p>

              <p
                class="font-inter order-0 flex-none flex-grow-0 text-[0.75rem] font-normal leading-[1.5rem] text-[#989898]"
              >
                {{ $t('nav.header.update.source') }}
              </p>

              <p
                class="font-inter order-0 flex-none flex-grow-0 text-[0.75rem] font-normal leading-[1.5rem] text-[#989898]"
              >
                {{ $t('nav.header.update.origin') }}
              </p>
            </div>
            <!-- Values -->
            <div
              class="col-span-10 flex flex-col gap-[0.375rem] truncate whitespace-nowrap"
            >
              <p
                class="font-inter order-0 flex-none flex-grow text-[0.75rem] font-normal leading-[1.5rem] text-[#FAFAFA]"
              >
                {{ store.webhookLog.responseCode }}
              </p>

              <p
                data-cy="webhook-event-id"
                class="font-inter order-0 flex-none flex-grow text-[0.75rem] font-normal leading-[1.5rem] text-[#FAFAFA]"
              >
                {{ store.webhookLog.id }}
              </p>

              <p
                class="font-inter order-0 flex-none flex-grow text-[0.75rem] font-normal leading-[1.5rem] text-[#FAFAFA]"
              >
                {{ formatDate(store.webhookLog.createdAt, 'DD/MM/YYYY') }},
                {{ dateFormat12(store.webhookLog.createdAt) }}
              </p>

              <p
                class="font-inter order-0 flex-none flex-grow text-[0.75rem] font-normal leading-[1.5rem] text-[#FAFAFA]"
              >
                {{ store.webhookLog.ipAddress }}
              </p>

              <p
                class="font-inter order-0 flex-none flex-grow text-[0.75rem] font-normal leading-[1.5rem] text-[#FAFAFA]"
              >
                {{ store.webhookLog.apiVersion }}
              </p>

              <p
                class="font-inter order-0 flex-none flex-grow text-[0.75rem] font-normal leading-[1.5rem] text-[#FAFAFA]"
              >
                {{ store.webhookLog.source.email }}
              </p>

              <p>
                <a
                  :href="store.webhookLog.origin"
                  class="font-inter order-0 flex-none flex-grow text-[0.75rem] font-normal leading-[1.5rem] text-blue-400 hover:underline"
                  target="_blank"
                >
                  {{ store.webhookLog.origin }}
                </a>
              </p>
            </div>
          </div>
          <!-- JSON Viewer -->
          <div
            class="mb-10 mt-2 h-min w-full overflow-hidden rounded-[0.3125rem] bg-[#1A1A1A] pb-0 text-[#707070] shadow-lg"
          >
            <div
              class="relative flex h-min w-full items-center justify-between rounded-t bg-[#FFFFFF0D] px-4 py-3 text-white"
            >
              <h1 class="text-base font-medium tracking-wide">Event Data</h1>
              <button
                class="absolute right-5 flex cursor-pointer items-center rounded-md p-2 text-sm font-semibold transition hover:bg-[#FFFFFF0D]/10"
                @click="copyToClipboard"
              >
                <i :class="copyIconClass" />
                <span v-show="copied" class="ml-2 text-sm font-light">
                  copied
                </span>
              </button>
            </div>

            <!-- Display JSON in formatted way -->
            <pre class="rounded-b-lg px-2 text-left text-gray-200">
            <code class=" overflow-hidden  text-left font-mono text-wrap">
              <div class="-mt-12 font-medium text-base">{</div>
         
                <ul class="  ml-5 -mt-24 mb-0 leading-3  text-base">
                  <li v-for="(value, key) in jsonData" :key="key" class=" leading-6 gap-0 flex text-left">
                    <span :class="[getKeyStyle(key), 'left-10']">"{{ key }}":  </span>
                    <span :class="[getValueStyle(value),'flex']">
                      <template v-if="typeof value === 'object' && value !== null">
                        <div class="-mt-10 -left-10">
                        <div class=" -mt-8 text-left -left-44   w-2 h-5"> {</div>
                        <ul class="  mb-0  -ml-20 -mt-10 text-left leading-3">
                          <li v-for="(subValue, subKey) in value" :key="subKey" class="  leading-4 flex justify-start flex-wrap">
                            <span :class="getKeyStyle(subKey)">"{{ subKey }}":  </span>
                            <span :class="[getValueStyle(subValue),'text-left justify-start']"><p v-if="typeof subValue === 'string'" class="text-left text-wrap w-11/12  pr-4">"{{ subValue }}"
                      </p>
                      <p v-else class="text-left w-11/12">{{ subValue }}
                      </p></span>
                          </li>
                        </ul>
                        <div class=" text-left -ml-24   text-base -mt-16  w-2 h-5"> }</div>
                        </div>
                      </template>
                      <template v-else>
                        {{ value }}
                      </template>
                    </span>
                  </li>
                </ul>
            <div class="-mt-24  text-base">  }</div>
            </code>
          </pre>
          </div>
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
function handleCloseDrawer() {
  emit('update:modelValue', false); // Close drawer
}
function dateFormat12(date) {
  return formatDate(date, 'HH:mm:ss');
}
// JSON Data
const jsonData = {
  object: {
    id: 'clock_1Q2vWeHQzZdDmyPqvCFqPE3o',
    object: 'test_helpers.test_clock',
    created: 1727271904,
    deletes_after: 1729863904,
    frozen_time: 1726926304,
    livemode: false,
    name: 'Current Time Test Clock',
    status: 'ready',
    status_details: {},
  },
};

// Function to copy JSON data to clipboard
function copyToClipboard() {
  const jsonText = JSON.stringify(jsonData, null, 2); // Format JSON with indentation
  navigator.clipboard
    .writeText(jsonText)
    .then(() => {
      // Update UI to show success
      copyIconClass.value = 'fa-light fa-check';
      copied.value = true;

      // Revert UI changes after 3 seconds
      setTimeout(() => {
        copyIconClass.value = 'fa-light fa-copy';
        copied.value = false;
      }, 3000); // 3 seconds
    })
    .catch((error) => {
      console.error('Failed to copy text:', error); // Log error for debugging
    });
}

const statusClass = (status) =>
  status === 200 || status === 201 ? 'bg-[#86EFAC]' : 'bg-[#450A0A]';
const getStatusColorClass = (status) =>
  status === 200 || status === 201 ? 'text-[#0A0A0A]' : 'text-[#EF4444]';
const getStatusColorIconClass = (status) =>
  status === 200 || status === 201 ? 'text-[#86EFAC]' : 'text-[#F87171]';
const getStatusIconClass = (status) =>
  status === 200 || status === 201
    ? 'fas fa-check-circle text-[#86EFAC]'
    : 'fas fa-times-circle text-[#0A0A0A]';

// Function to determine the style of the key based on its name
const getKeyStyle = () => 'text-[#9CDCFE] '; // Apply color to all keys
// Function to determine the style of the value based on its data type
const getValueStyle = (value) => {
  if (typeof value === 'string') {
    return 'text-[#CE9178]';
  } // String color
  if (typeof value === 'boolean') {
    return 'text-[#569CD6]';
  } // Boolean color
  if (typeof value === 'number') {
    return 'text-[#B5CEA8]';
  } // Numbers (int or timestamp)
  return 'text-gray-200'; // Default color for other values
};
</script>

<style></style>
