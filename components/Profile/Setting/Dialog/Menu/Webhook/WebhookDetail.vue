<template>
  <el-drawer
    v-model="show"
    :with-header="true"
    :show-close="false"
    :lock-scroll="false"
    destroy-on-close
    :close-on-press-escape="false"
    :append-to-body="!isLeftDrawer"
    :class="{
      'is-body-drawer': !isLeftDrawer,
    }"
    class="detail-webhook-drawer !w-[30rem]"
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
            {{ $t('personal.webhook.label') }}
          </div>
        </div>
      </div>
    </template>
    <div
      :class="{
        '-mt-5 p-4': !isLeftDrawer,
      }"
      class="isolate order-1 flex flex-none flex-grow flex-col items-start gap-8 self-stretch pb-4"
    >
      <div
        class="order-0 z-10 flex flex-none flex-grow-0 flex-col items-start gap-4 self-stretch p-0"
      >
        <!-- Header Section -->
        <div
          class="order-0 flex flex-none grow flex-row items-start gap-2 py-1.5"
        >
          <div
            class="order-1 flex flex-none grow flex-col items-start gap-1.5 p-0"
          >
            <div
              class="order-0 flex w-full flex-none grow-0 flex-row items-start gap-2 py-1.5"
            >
              <div
                class="order-1 flex flex-none grow-0 flex-col items-start gap-1.5 p-0"
              >
                <div
                  class="order-0 flex flex-none grow-0 flex-row items-center gap-2 p-0"
                >
                  <h6
                    class="order-1 h-[1.5rem] w-[20.35rem] flex-none flex-grow text-base font-normal leading-[1.5rem] text-[#F1F1F1]"
                  >
                    <span>
                      {{ store.selectedWebhook.title }}
                    </span>
                  </h6>

                  <div
                    class="order-3 flex h-[1.5rem] w-[5rem] flex-none flex-grow-0 flex-row items-center justify-center gap-[0.625rem] rounded-[0.3125rem] px-[0.25rem] py-[0.125rem] text-white"
                  >
                    <div
                      :class="[
                        'order-0 h-[0.75rem] w-[0.75rem] flex-none grow-0 rounded-[0.4375rem]',
                        store.selectedWebhook.status === 'enabled'
                          ? 'bg-[#86EFAC]'
                          : 'bg-[#e5e5e5] opacity-30',
                      ]"
                    />

                    {{
                      store.selectedWebhook.status === 'enabled'
                        ? $t('personal.enable')
                        : $t('personal.disabled')
                    }}
                  </div>
                </div>

                <p
                  class="order-1 flex-none flex-grow-0 self-stretch text-[0.75rem] font-medium leading-[150%] text-[#707070]"
                >
                  {{ store.selectedWebhook.url }}
                </p>
              </div>

              <el-popover
                v-model:visible="visible"
                placement="bottom-end"
                class="ml-2"
                trigger="click"
              >
                <template #reference>
                  <div
                    class="order-3 flex h-6 max-h-6 w-6 max-w-6 flex-none flex-grow-0 flex-row items-center justify-center gap-[0.375rem] rounded-[0.3125rem] p-[0.1875rem] hover:bg-[#555555]/50"
                  >
                    <i
                      class="fas fa-ellipsis-h cursor-pointer p-2 text-[#FAFAFA]"
                    />
                  </div>
                </template>
                <ul
                  class="min-w-[8.5625rem] space-y-1 rounded-[0.3125rem] border border-[#060606] p-[0.5rem] text-sm text-[#E5E5E5]"
                >
                  <li
                    @click.stop="
                      () => {
                        editWebhook(store.selectedWebhook);
                      }
                    "
                  >
                    <BaseButton
                      class="flex cursor-pointer items-center gap-3 rounded-[0.3125rem] border-none bg-transparent p-2 py-3 text-white hover:bg-[#FFFFFF26]/15"
                    >
                      <i :class="['fas fa-edit text-[#E5E5E5]']" />
                      <span>
                        {{ $t('base.editor.edit') }}
                      </span>
                    </BaseButton>
                  </li>
                  <li
                    @click.stop="
                      () => {
                        toggleWebhookStatus(store.selectedWebhook);
                      }
                    "
                  >
                    <BaseButton
                      class="flex cursor-pointer items-center gap-3 rounded-[0.3125rem] border-none bg-transparent p-2 py-3 text-white hover:bg-[#FFFFFF26]/15"
                      :disabled="store.updating"
                      :loading="store.updating"
                    >
                      <i
                        v-if="!store.updating"
                        :class="[
                          store.selectedWebhook.status === 'enabled'
                            ? 'fas fa-bell-slash'
                            : 'fas fa-bell',
                          'text-[#E5E5E5]',
                        ]"
                      />
                      <span>
                        {{
                          store.selectedWebhook.status === 'enabled'
                            ? $t('personal.disable')
                            : $t('personal.enable')
                        }}
                      </span>
                    </BaseButton>
                  </li>
                  <li
                    @click.stop="
                      () => {
                        deleteWebhook(store.selectedWebhook.id);
                      }
                    "
                  >
                    <BaseButton
                      class="flex cursor-pointer items-center gap-3 rounded-[0.3125rem] border-none bg-transparent p-2 py-3 text-white hover:bg-[#FFFFFF26]/15"
                      :disabled="store.deleting"
                      :loading="store.deleting"
                    >
                      <i
                        v-if="!store.deleting"
                        class="fas fa-trash-can text-[#E5E5E5]"
                      />
                      <span>
                        {{ $t('base.editor.delete') }}
                      </span>
                    </BaseButton>
                  </li>
                </ul>
              </el-popover>
            </div>
          </div>
        </div>
        <div
          class="order-1 flex h-6 flex-none flex-grow-0 flex-row items-center gap-4 self-stretch p-0"
        >
          <div
            :class="[
              'flex h-7 items-center justify-center space-x-1 rounded-[0.3125rem] px-1.5 py-1 text-[0.75rem] font-medium',
              store.selectedWebhook.successRate >= 50
                ? 'bg-[#022c22] text-[#86EFAC]'
                : '',
              store.selectedWebhook.successRate < 50
                ? 'bg-[#F87171] text-[#450A0A]'
                : '',
            ]"
          >
            <i class="fas fa-circle-check" />
            <span>{{ store.selectedWebhook.successRate }}%</span>
          </div>

          <el-dropdown
            v-if="!isEventDetail"
            :hide-on-click="true"
            placement="bottom"
          >
            <BaseButton
              class="rounded border-none text-sm text-[#707070]"
              :label="
                store.selectedWebhook.events.length +
                `${store.selectedWebhook.events.length > 1 ? ' Events' : ' Event'}`
              "
              style="background-color: #e5e5e51a"
            />
            <template #dropdown>
              <el-dropdown-menu class="p-0">
                <div
                  class="max-h-72 w-full space-y-2 overflow-y-auto rounded-[0.3125rem] p-2"
                >
                  <div
                    v-for="event in store.selectedWebhook.events"
                    :key="event.id"
                    class="flex w-min cursor-pointer items-center gap-2 rounded-[0.3125rem] bg-[#1A1A1A] px-2 py-1 text-white"
                    @click="onTestEvent(event.name)"
                  >
                    <i class="fa-light fa-user" />
                    <span>{{ event.name }}</span>
                  </div>
                </div>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <!-- Event Groups -->
      <div
        class="z-0 order-1 flex w-full flex-none flex-grow flex-col items-start gap-2 self-stretch p-0"
      >
        <div
          class="order-0 flex w-[27.85rem] flex-none flex-grow-0 flex-row items-center self-stretch border-b-[0.0125rem] border-[#767675] p-0"
        >
          <div
            v-for="(menu, index) in menus"
            :key="menu.name"
            class="mt-2 flex cursor-pointer border-b px-4 pb-1 pt-2 text-sm transition-all"
            :class="
              filterStatus === menu.value
                ? '2 border-[#D9D9D9] bg-[#FFFFFF0D] text-[#D9D9D9]'
                : 'border-transparent text-[#B0B0B0] hover:border-[#D9D9D9] hover:bg-[#FFFFFF0D] hover:font-medium hover:text-[#D9D9D9]'
            "
            @click="updateFilter(menu.value)"
          >
            <i
              :class="[
                filterStatus === menu.value ? 'fas' : 'fa-light',
                icons[index],
                'mr-2 mt-1 text-center',
              ]"
            />
            {{ $t(menu.name) }}
          </div>
        </div>
        <div
          v-infinite-scroll="loadMoreLogs"
          :infinite-scroll-disabled="
            store.isLoadingAllLogs || !store.webhookLogs.cursor.next
          "
          :infinite-scroll-distance="20"
          class="scrollbar-hide order-1 flex h-[27.81rem] w-full flex-none flex-grow flex-col items-start self-stretch overflow-y-scroll p-0"
        >
          <div
            v-if="
              (!store.isLoadingAllLogs && store.webhookLogs.list.length) ||
              webhookLogs.length
            "
            class="w-full"
          >
            <div
              v-for="relativeTime in groupWebHookLogByRelativeTime()"
              :key="relativeTime"
              class="w-full"
            >
              <div
                class="order-0 flex h-[2.25rem] flex-none grow-0 flex-row items-center gap-[0.5rem] self-stretch rounded-[0.3125rem] p-[0.375rem_0.75rem]"
              >
                <p
                  class="order-0 flex flex-none grow flex-row items-center gap-[0.625rem] p-0 text-white"
                >
                  {{
                    filterWebHookLogByRelativeTime(relativeTime)?.length
                      ? relativeTime
                      : ''
                  }}
                </p>
              </div>
              <div>
                <template
                  v-for="webHookLog in filterWebHookLogByRelativeTime(
                    relativeTime,
                  )"
                  :key="webHookLog.id"
                >
                  <div
                    class="order-0 flex flex-none flex-grow-0 cursor-pointer items-center justify-center self-stretch rounded-[0.3125rem] p-0 px-2 hover:border-l hover:bg-[#FFFFFF0D]"
                    :class="{
                      'border-l bg-[#FFFFFF0D]':
                        selectedWebHookLogId === webHookLog.id,
                      'border-[#86EFAC] hover:border-[#86EFAC]':
                        webHookLog.responseCode === 200 ||
                        webHookLog.responseCode === 201,
                      'border-[#EF4444] hover:border-[#EF4444]':
                        webHookLog.responseCode === 400 ||
                        webHookLog.responseCode === 404 ||
                        webHookLog.responseCode === 401 ||
                        webHookLog.responseCode === 503,
                    }"
                    @click="onShowDetailLog(webHookLog)"
                  >
                    <div
                      class="order-0 flex h-[2.5rem] w-[23.975rem] flex-none flex-grow flex-row items-center gap-[0.5rem] self-stretch p-[0_0.5rem]"
                    >
                      <i
                        :class="[
                          getStatusIconClass(webHookLog.responseCode),
                          getStatusColorIconClass(webHookLog.responseCode),
                        ]"
                        class="p-2 text-sm"
                      />

                      <div class="flex items-center space-x-2">
                        <span
                          :class="[
                            'order-0 flex h-[1.5rem] flex-none flex-grow-0 flex-row items-center justify-center gap-[0.375rem] rounded-[0.3125rem] p-[0.1875rem_0.375rem]',
                            getStatusColorClass(webHookLog.responseCode),
                            statusClass(webHookLog.responseCode),
                          ]"
                        >
                          <span>{{ webHookLog.responseCode }}</span>
                        </span>
                        <span
                          :data-cy="`${webHookLog.eventName}-webhook-event`"
                          class="font-inter order-1 flex flex-none flex-grow items-center truncate text-[1rem] font-normal leading-[1.1875rem] text-[#D9D9D9]"
                        >
                          {{ webHookLog.eventName }}
                        </span>
                      </div>
                    </div>
                    <span
                      class="font-inter text-rig order-0 flex-none flex-grow-0 text-[0.75rem] font-medium leading-[1] text-[#707070]"
                    >
                      {{ dateFormat(webHookLog.createdAt) }}
                    </span>
                  </div>
                </template>
              </div>
            </div>
            <div v-if="store.isLoadingAllLogs && webhookLogs.length">
              <ProfileSettingDialogMenuWebhookSkeleton
                v-for="i in 6"
                :key="i"
              />
            </div>
          </div>

          <div
            v-else-if="store.isLoadingAllLogs && !webhookLogs.length"
            class="flex h-96 w-full items-center justify-center"
          >
            <div v-loading="store.isLoadingAllLogs" />
          </div>
          <div
            v-else-if="!store.isLoadingAllLogs && !webhookLogs.length"
            class="flex h-72 w-full items-center justify-center"
          >
            <BaseNoData />
          </div>
        </div>
      </div>

      <ProfileSettingDialogMenuWebhookEventDetail
        v-model="isEventDetail"
        :test-webhook="testWebhook"
        title="Webhook"
        :is-left-drawer="props.isLeftDrawer"
      />
      <!-- Edit Webhook -->
      <ProfileSettingDialogMenuWebhookEditWebhook
        v-model="store.isWebhookEdit"
        :webhook="store.selectedWebhook"
        :is-left-drawer="props.isLeftDrawer"
      />
      <ProfileSettingDialogMenuWebhookLog
        v-model="isWebhookLog"
        :is-left-drawer="props.isLeftDrawer"
      />
    </div>
  </el-drawer>
</template>

<script setup>
import { useToast } from 'vue-toastification';

import { useWebhookStore } from '~/stores/webhook';
import { formatRelativeDate } from '~/utils/day';

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
const store = useWebhookStore();
const visible = ref(false);
const filterStatus = ref('');
const isEventDetail = ref(false);
const $toast = useToast();
const isWebhookLog = ref(false);
const next = ref(store.webhookLogs.cursor.next);
const limit = ref(0);
const webhookLogs = ref([]);

// Computed for v-model
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

function filterUniqueLogs(logs) {
  const uniqueLogs = new Map();
  logs.forEach((log) => {
    if (!uniqueLogs.has(log.id)) {
      uniqueLogs.set(log.id, log);
    }
  });
  return Array.from(uniqueLogs.values());
}

// Load more webhook logs on scroll
const loadMoreLogs = debounce(async () => {
  if (
    !store.webhookLogs.cursor.next ||
    store.isLoadingAllLogs ||
    !limit.value
  ) {
    limit.value = 20;
    return;
  }

  try {
    store.isLoadingAllLogs = true;

    await store.allWebhookLogsBySearch(store.selectedWebhook?.id, {
      next: next.value,
      limit: limit.value,
      status: filterStatus.value,
    });
    next.value = store.webhookLogs.cursor.next;

    // Combine new logs and existing logs, and filter for uniqueness
    const combinedLogs = [...webhookLogs.value, ...store.webhookLogs.list];
    webhookLogs.value = filterUniqueLogs(combinedLogs);
  } catch (error) {
    console.error('Error loading more webhook logs:', error);
  } finally {
    store.isLoadingAllLogs = false;
  }
}, 100);

function onShowDetailLog(selectedwebhook) {
  isWebhookLog.value = true;
  store.webhookLog = selectedwebhook;
}

function onTestEvent(eventName) {
  store.selectedWebhookEventName = eventName;
  store.isSuccessTestWebhook = false;
  visible.value = false;
  isEventDetail.value = true;
}

function dateFormat(date) {
  return formatDate(date, 'HH:mm:ss');
}

const testWebhook = async () => {
  if (!store.isLoadingTestWebhook) {
    // Call the store's `testNewWebhook` function
    await store.testNewWebhook(store.selectedWebhook.url);
    if (store.isErrorTestWebhook) {
      $toast.error(store.testWebhookError);
    }
  }
};

function handleCloseDrawer() {
  store.clearSelectedEvents();
  emit('update:modelValue', false); // Close drawer
  store.isWebhookDetail = false;
  filterStatus.value = '';
  webhookLogs.value = [];
  // Clear selectedWebhookId after 3 seconds
  setTimeout(() => {
    store.selectedWebhookId = '';
  }, 300);
}

// Function to update the filter and fetch logs
function updateFilter(status) {
  limit.value = 20;
  filterStatus.value = status;
}

watch(
  filterStatus,
  async (filter) => {
    if (
      store.selectedWebhook?.id &&
      store.selectedWebhook?.id === store.selectedWebhookId
    ) {
      webhookLogs.value = [];
      await store.allWebhookLogsBySearch(store.selectedWebhook?.id, {
        limit: 20,
        status: filter,
      });
      webhookLogs.value = store.webhookLogs.list;
      next.value = store.webhookLogs.cursor.next;
    }
  },
  { immediate: true },
);

function filterWebHookLogByRelativeTime(relativeTime) {
  if (!webhookLogs.value.length) {
    return [];
  }

  return webhookLogs.value.filter(
    (webhookLog) => formatRelativeDate(webhookLog?.createdAt) === relativeTime,
  );
}

// group webhook logs by date
function groupWebHookLogByRelativeTime() {
  // Use a Set to collect unique relative dates
  const uniqueRelativeDates = new Set(
    webhookLogs.value.map((webhookLog) =>
      formatRelativeDate(webhookLog?.createdAt),
    ),
  );

  // Convert the Set back to an array
  return Array.from(uniqueRelativeDates);
}

const editWebhook = (webhook) => {
  store.editedWebhookId = webhook.id;
  store.selectedEventIds = webhook.events.map((event) => event.id);
  visible.value = false;
  store.isWebhookEdit = true;
  store.isCreateWebhookConfirm = false;
  store.isEditWebhookConfirm = false;
  store.isCreateInputsWebhookChange = false;
  store.isEditInputsWebhookChange = false;
};

const toggleWebhookStatus = async (webhook) => {
  try {
    if (store.updating) {
      return;
    }
    store.updating = true;
    const newStatus =
      store.selectedWebhook.status === 'enabled' ? 'disabled' : 'enabled';

    // Update the webhook status by passing an object with the new status
    const success = await store.updateWebhookStatus(webhook.id, newStatus);

    if (success) {
      store.selectedWebhook.status = newStatus; // Update the local state if the store update was successful
      emit('update:modelValue', true);
    } else {
      console.warn('Failed to update webhook status');
    }
  } catch (error) {
    console.error('Error toggling webhook status:', error);
  } finally {
    store.updating = false;
    visible.value = false;
  }
};

const deleteWebhook = async (id) => {
  try {
    if (store.deleting) {
      return false;
    }
    store.deleting = true;
    await store.deleteWebhook(id);
  } catch (error) {
    console.error('Error deleting webhook:', error);
  } finally {
    store.deleting = false;
    store.selectedWebhookId = null;
  }
};

const menus = [
  { name: 'personal.webhook.menu.all', value: '' },
  { name: 'personal.webhook.menu.success', value: 'succeeded' },
  { name: 'personal.webhook.menu.failed', value: 'failed' },
];
const icons = [
  'fas fa-circle-half-stroke ',
  'fas fa-circle-check ',
  'fas fa-circle-xmark ',
];

const statusClass = (status) =>
  status === 200 || status === 201 ? 'bg-[#86EFAC]' : 'bg-[#450A0A]';
const getStatusColorClass = (status) =>
  status === 200 || status === 201 ? 'text-[#0A0A0A]' : 'text-[#EF4444]';
const getStatusColorIconClass = (status) =>
  status === 200 || status === 201 ? 'text-[#86EFAC]' : 'text-[#F87171]';
const getStatusIconClass = (status) =>
  status === 200 || status === 201
    ? 'fa-light fa-check-circle text-[#86EFAC]'
    : 'fa-light fa-times-circle text-[#0A0A0A]';
</script>
<style lang="scss">
.scrollbar-hide {
  -ms-overflow-style: none; /* For Internet Explorer and Edge */
  scrollbar-width: none; /* For Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Edge */
}
.detail-webhook-drawer {
  .el-drawer__body {
    border-width: 0;
  }
}
</style>
