<template>
  <div v-if="!webhookStore.isNewWebhook" class="flex w-full flex-col py-[1rem]">
    <div
      class="order-0 flex w-full flex-none flex-grow-0 flex-col items-center gap-4 self-stretch p-0 px-[0.5rem]"
    >
      <div class="bg-[#060606] px-[1rem] text-xs text-[#555555]">
        <p>
          {{ $t('personal.webhook.usage') }}
        </p>
        <p>
          {{ $t('personal.webhook.content') }}
        </p>
      </div>
      <div>
        <div
          class="box-border w-[27.85rem] justify-center bg-[#060606] px-[1rem] py-4 text-[#FAFAFA]"
        >
          <div class="flex w-full items-center justify-between gap-10">
            <h2 class="text-base">
              {{ $t('personal.webhook.hosted') }}
            </h2>
            <div class="rounded border">
              <BaseButton
                type="secondary"
                icon="fa-light fa-plus"
                class="items-center rounded-md border-none text-[1rem] text-[#FAFAFA]"
                label="$t:personal.webhook.new"
                data-cy="create-new-webhook-button"
                @click="openNewWebhook"
              />
            </div>
          </div>
        </div>
        <div
          v-infinite-scroll="loadMoreWebhooks"
          :infinite-scroll-disabled="
            webhookStore.loading || !webhookStore.webhooks.cursor.next
          "
          :infinite-scroll-distance="20"
          class="scrollbar-hide order-1 flex max-h-[27.81rem] w-full flex-none flex-grow flex-col items-start self-stretch overflow-y-scroll p-0"
        >
          <div
            v-if="
              (!webhookStore.loading && webhookStore.webhooks.list.length) ||
              webhooks.length
            "
            class="order-1 flex flex-none flex-grow-0 flex-col items-start self-stretch rounded-l-md bg-[rgba(226,226,226,0.03)] p-2"
          >
            <div
              v-for="webhook in webhooks"
              :key="webhook.id"
              :class="[
                'order-0 box-border flex h-[3.75rem] w-full flex-none flex-grow cursor-pointer flex-row items-center gap-[0.5rem] self-stretch border-b-[0.0125rem] p-[0.375rem] pr-[0.75rem] hover:bg-[#FFFFFF0D]',
                webhook.status === 'enabled'
                  ? 'border-[#555555]/50'
                  : 'border-[#989898]/10',
              ]"
            >
              <!-- Icon -->
              <div
                class="order-0 flex h-[3rem] w-[3rem] flex-none flex-grow-0 flex-row items-center justify-center gap-[0.625rem] self-stretch p-0"
              >
                <i
                  :class="[
                    'order-0 fa-light fa-globe flex-none flex-grow-0 p-2 text-center text-[0.875rem] font-light leading-[0.875rem]',
                    webhook.status === 'enabled'
                      ? 'text-[#FAFAFA]'
                      : 'text-[#989898]',
                  ]"
                  @click="selectWebhook(webhook.id, webhook)"
                />
              </div>

              <!-- Webhook title and url -->

              <div
                :data-cy="`${webhook.id}-webhook-title-url`"
                class="order-1 flex h-9 w-[10.7875rem] flex-none flex-grow flex-col items-start gap-0 p-0"
                @click="selectWebhook(webhook.id, webhook)"
              >
                <div
                  :class="[
                    'order-0 flex w-[10.725rem] flex-none flex-grow-0 flex-row items-center gap-2 self-stretch truncate p-0',
                    webhook.status === 'enabled'
                      ? 'text-white'
                      : 'text-[#989898]',
                  ]"
                >
                  {{ webhook.title }}
                </div>
                <div
                  :class="[
                    'font-inter order-1 w-[10.725rem] flex-none flex-grow-0 self-stretch truncate text-[0.75rem] font-medium leading-[150%]', // Adjust width as needed
                    webhook.status === 'enabled'
                      ? 'text-[#707070]'
                      : 'text-[#303030]',
                  ]"
                  :title="webhook.url"
                >
                  {{ webhook.url }}
                </div>
              </div>
              <div
                :class="[
                  'order-2 flex h-6 w-[3.4375rem] flex-none flex-grow-0 flex-row items-center justify-center gap-1 rounded-[0.3125rem] p-[0.125rem_0.4375rem]',
                  webhook.successRate >= 50
                    ? 'bg-[#6EE7B7] text-[#022C22]'
                    : '',
                  webhook.successRate < 50 && webhook.status === 'enabled'
                    ? 'bg-[#F87171] text-[#450A0A]'
                    : '',
                  webhook.status === 'disabled'
                    ? 'bg-[#E5E5E5] bg-opacity-30 text-[#0A0A0A]'
                    : '',
                ]"
                @click="selectWebhook(webhook.id, webhook)"
              >
                <i
                  class="order-0 fas fa-circle-check h-3 w-3 flex-none flex-grow-0 text-center text-xs font-black leading-[100%]"
                />
                <span
                  class="font-inter order-1 h-4 w-8 flex-none flex-grow-0 text-center text-xs font-medium leading-[150%]"
                >
                  {{ webhook.successRate }}%
                </span>
              </div>
              <div
                class="order-3 flex h-[1.5rem] w-[5rem] flex-none grow-0 flex-row items-center justify-center gap-[0.625rem] rounded-[0.3125rem] p-[0.125rem_0.9375rem_0.125rem_0.25rem]"
              >
                <div
                  :class="[
                    'order-0 h-[0.75rem] w-[0.75rem] flex-none grow-0 rounded-[0.4375rem]',
                    webhook.status === 'enabled'
                      ? 'bg-[#86EFAC]'
                      : 'bg-[#e5e5e5] opacity-30',
                  ]"
                  @click="selectWebhook(webhook.id, webhook)"
                />

                <div
                  :class="['text-[0.75rem] font-medium text-[#FAFAFA]']"
                  @click="selectWebhook(webhook.id, webhook)"
                >
                  {{
                    webhook.status === 'enabled'
                      ? $t('personal.enabled')
                      : $t('personal.disabled')
                  }}
                </div>
              </div>

              <el-popover
                v-model:visible="visiblePopovers[webhook.id]"
                placement="bottom-end"
                trigger="click"
              >
                <template #reference>
                  <div
                    class="order-4 flex h-[1.5rem] max-h-[1.5rem] w-[1.5rem] max-w-[1.5rem] flex-none grow-0 flex-row items-center justify-center gap-[0.375rem] rounded-[0.3125rem] p-[0.1875rem] hover:bg-[#555555]/50"
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
                        editWebhook(webhook);
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
                        toggleWebhookStatus(webhook);
                      }
                    "
                  >
                    <BaseButton
                      class="flex cursor-pointer items-center gap-3 rounded-[0.3125rem] border-none bg-transparent p-2 py-3 text-white hover:bg-[#FFFFFF26]/15"
                      :disabled="webhookStore.updating"
                      :loading="webhookStore.updating"
                    >
                      <i
                        v-if="!webhookStore.updating"
                        :class="[
                          webhook.status === 'enabled'
                            ? 'fas fa-bell-slash'
                            : 'fas fa-bell',
                          'text-[#E5E5E5]',
                        ]"
                      />
                      <span>
                        {{
                          webhook.status === 'enabled'
                            ? $t('personal.disable')
                            : $t('personal.enable')
                        }}
                      </span>
                    </BaseButton>
                  </li>
                  <li
                    @click.stop="
                      () => {
                        deleteWebhook(webhook.id);
                      }
                    "
                  >
                    <BaseButton
                      class="flex cursor-pointer items-center gap-3 rounded-[0.3125rem] border-none bg-transparent p-2 py-3 text-white hover:bg-[#FFFFFF26]/15"
                      :disabled="webhookStore.deleting"
                      :loading="webhookStore.deleting"
                    >
                      <i
                        v-if="!webhookStore.deleting"
                        class="fas fa-trash-can text-[#E5E5E5]"
                      />
                      <span>
                        {{ $t('base.editor.delete') }}
                      </span>
                    </BaseButton>
                  </li>
                </ul>
              </el-popover>

              <!-- Edit Webhook -->
              <ProfileSettingDialogMenuWebhookEditWebhook
                v-if="webhookStore.editedWebhookId === webhook.id"
                v-model="webhookStore.isWebhookEdit"
                :webhook="webhook"
                :is-left-drawer="props.isLeftDrawer"
              />

              <!-- Webhook Detail -->
              <WebhookDetail
                v-if="webhookStore.selectedWebhookId === webhook.id"
                v-model="webhookStore.isWebhookDetail"
                :webhook-id="webhook.id"
                :is-left-drawer="props.isLeftDrawer"
              />
            </div>

            <div v-if="webhookStore.loading && webhooks.length" class="w-full">
              <ProfileSettingDialogMenuWebhookSkeleton
                v-for="i in 6"
                :key="i"
              />
            </div>
          </div>
          <div
            v-else-if="webhookStore.loading && !webhooks.length"
            class="flex h-96 w-full items-center justify-center"
          >
            <div v-loading="webhookStore.loading" />
          </div>

          <div
            v-else-if="!webhookStore.loading && !webhooks.length"
            class="flex h-96 w-full items-center justify-center"
          >
            <BaseNoData />
          </div>
        </div>
      </div>
    </div>
  </div>
  <NewWebhook
    v-if="webhookStore.isNewWebhook && !props.isLeftDrawer"
    v-model="webhookStore.isNewWebhook"
    :is-left-drawer="props.isLeftDrawer"
  />
  <ProfileSettingDialogMenuWebhookNewWebhookDrawer
    v-if="props.isLeftDrawer"
    v-model="webhookStore.isNewWebhook"
    else
    :is-left-drawer="props.isLeftDrawer"
  />
</template>

<script setup>
import NewWebhook from './NewWebhook.vue';
import WebhookDetail from './WebhookDetail.vue';

import { useWebhookStore } from '~/stores/webhook';

const props = defineProps({
  isLeftDrawer: {
    type: Boolean,
    default: false,
  },
});
const webhookStore = useWebhookStore();
const visiblePopovers = reactive({});
const limit = ref(0);
const next = ref(webhookStore.webhooks.cursor.next);
const webhooks = ref([]);
// filter unique webhooks list
function filterUniqueWebhooks(webhooksData) {
  const uniqueWebhooks = new Map();
  webhooksData.forEach((webhook) => {
    if (!uniqueWebhooks.has(webhook.id)) {
      uniqueWebhooks.set(webhook.id, webhook);
    }
  });
  return Array.from(uniqueWebhooks.values());
}

// Load more webhooks on scroll
const loadMoreWebhooks = debounce(async () => {
  if (
    !webhookStore.webhooks.cursor.next ||
    webhookStore.loading ||
    !limit.value
  ) {
    limit.value = 20;
    return;
  }

  try {
    webhookStore.loading = true;
    await webhookStore.fetchWebhooks({
      next: next.value,
      limit: limit.value,
    });
    next.value = webhookStore.webhooks.cursor.next;
    // Combine new webhooks and existing logs, and filter for uniqueness
    const combinedWebhooks = [...webhooks.value, ...webhookStore.webhooks.list];
    webhooks.value = filterUniqueWebhooks(combinedWebhooks);
  } catch (error) {
    console.error('Error loading more webhooks:', error);
  } finally {
    webhookStore.loading = false;
  }
}, 100);

const fetchWebhooks = async () => {
  webhooks.value = [];
  await webhookStore.fetchWebhooks({ limit: 20 });
  webhooks.value = webhookStore.webhooks.list;
  next.value = webhookStore.webhooks.cursor.next;
};

// Watch for changes in store.isSuccessCreateWebhook
watch(
  () => webhookStore.isSuccessCreateWebhook,
  async (newValue) => {
    if (newValue) {
      await fetchWebhooks();
    }
  },
);

// Watch for changes in Edit webhook
watch(
  () => webhookStore.isWebhookEditSuccess,
  async (newValue) => {
    if (newValue) {
      await fetchWebhooks();
    }
  },
);

// Watch for changes in Delete webhook
watch(
  () => webhookStore.isWebhookDeletedSuccess,
  async (newValue) => {
    if (newValue) {
      await fetchWebhooks();
    }
  },
);

onMounted(fetchWebhooks);

onBeforeUnmount(() => {
  webhookStore.isNewWebhook = false;
  webhookStore.selectedWebhookId = null;
});

function openNewWebhook() {
  webhookStore.isNewWebhook = true;
  webhookStore.isEventDetail = false;
  webhookStore.isErrorCreateWebhook = false;
  webhookStore.isErrorTestWebhook = false;
  webhookStore.clearSelectedEvents();
  webhookStore.selectedEventIds = [];
  webhookStore.isCreateWebhookConfirm = false;
  webhookStore.isEditWebhookConfirm = false;
  store.isCreateInputsWebhookChange = false;
  store.isEditInputsWebhookChange = false;
}

const editWebhook = (webhook) => {
  webhookStore.editedWebhookId = webhook.id;
  visiblePopovers[webhook.id] = !visiblePopovers[webhook.id];
  webhookStore.selectedEventIds = webhook.events.map((event) => event.id);
  webhookStore.isWebhookEdit = true; // Check this
  webhookStore.selectedEventIds = [];
  webhookStore.isCreateWebhookConfirm = false;
  webhookStore.isEditWebhookConfirm = false;
  store.isCreateInputsWebhookChange = false;
  store.isEditInputsWebhookChange = false;
};

const toggleWebhookStatus = async (webhook) => {
  try {
    if (webhookStore.updating) {
      return;
    }
    webhookStore.updating = true;
    const newStatus = webhook.status === 'enabled' ? 'disabled' : 'enabled';

    // Update the webhook status by passing an object with the new status
    const success = await webhookStore.updateWebhookStatus(
      webhook.id,
      newStatus,
    );

    if (success) {
      webhook.status = newStatus; // Update the local state if the store update was successful
    } else {
      console.warn('Failed to update webhook status');
    }
  } catch (error) {
    console.error('Error toggling webhook status:', error);
  } finally {
    webhookStore.updating = false;
    visiblePopovers[webhook.id] = !visiblePopovers[webhook.id];
  }
};

const deleteWebhook = async (id) => {
  try {
    if (webhookStore.deleting) {
      return false;
    }
    webhookStore.deleting = true;
    await webhookStore.deleteWebhook(id);
  } catch (error) {
    console.error('Error deleting webhook:', error);
  } finally {
    webhookStore.deleting = false;
    visiblePopovers[id] = !visiblePopovers[id];
  }
};
const selectWebhook = (id, webhook) => {
  webhookStore.isWebhookDetail = true;
  webhookStore.selectedWebhookId = id;
  webhookStore.onSelectedWebHook(webhook);
  webhookStore.selectedWebhookEventName = '';
  webhookStore.webhookLogStatus = '';
  store.selectedEventIds = [];
};
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none; /* For Internet Explorer and Edge */
  scrollbar-width: none; /* For Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Edge */
}
</style>
