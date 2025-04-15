<template>
  <el-drawer
    v-model="show"
    :with-header="true"
    :show-close="false"
    :open-delay="0"
    :lock-scroll="false"
    destroy-on-close
    :close-on-press-escape="false"
    :append-to-body="!isLeftDrawer"
    :class="{
      'is-body-drawer': !isLeftDrawer,
    }"
    class="edit-webhook-drawer !w-[30rem]"
    :before-close="onOPenModal"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div
            class="mr-3 flex h-6 w-6 cursor-pointer items-center justify-center"
            @click="onOPenModal"
          >
            <i class="fa-sharp fa-solid fa-arrow-left text-lg" />
          </div>
          <div class="text-lg">Edit Webhook</div>
        </div>
      </div>
    </template>
    <div
      :class="{
        '-mt-3 p-4': !isLeftDrawer,
      }"
      class="hide-scrollbar relative flex w-full flex-col overflow-y-auto"
    >
      <div>
        <div
          :class="{
            'my-3': isLeftDrawer,
          }"
          class="bg-[#060606] px-[1rem] text-xs text-[#555555]"
        >
          <p>
            {{ $t('personal.webhook.edit') }}
          </p>
        </div>
      </div>
      <div class="my-4 rounded-[0.3125rem] bg-[#FFFFFF08] p-[1rem]">
        <h2 class="mb-4 text-base text-[#E2E2E2]">Details</h2>
        <form class="space-y-[1.25rem]">
          <div class="relative">
            <BaseInput
              v-model.trim="title"
              :title="$t('personal.webhook.title')"
              type="text"
              @clear="handleClear"
            />
          </div>

          <div class="relative">
            <BaseInput
              v-model.trim="endpointURL"
              type="text"
              :title="$t('personal.webhook.url.endpoint')"
              :show-validate-error="showUrlError"
              @clear="handleClear"
              @change="handleChangeUrl"
            />
            <div class="h-5">
              <div v-if="showUrlError" class="mt-1 text-sm text-[#ED3C28]">
                <span class="pr-2 capitalize">
                  {{ $t('personal.webhook.url.error.label') }}
                </span>
                <i
                  class="fa-light fa-info-circle cursor-pointer"
                  @click="showWarningCard = true"
                />
                <WarningCard
                  v-if="showWarningCard"
                  @close="showWarningCard = false"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <div
        class="flex w-full flex-col rounded-[0.3125rem] bg-[#FFFFFF08] p-[1rem] pt-2"
      >
        <div
          class="flex items-center justify-center space-x-3 pb-2 pr-3.5 text-gray-300"
        >
          <h2 class="text-base">
            {{ $t('personal.webhook.events') }}
          </h2>

          <!-- Event Selection Search and Toggle Options -->
          <div class="mb-4 w-full items-start text-start">
            <BaseInput
              v-model="searchText"
              class="border-yellow-500"
              clear
              search
            />
          </div>
          <div class="flex items-center rounded-md bg-black p-1 text-sm">
            <BaseListCollapse v-model="showListContent" />
          </div>

          <!-- Main Checkbox for Selecting All Events -->
          <div
            class="mx-1 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full transition-all duration-300"
          >
            <BaseCheckboxStyle
              :state="
                totalEvent &&
                store.selectedEventIds.length &&
                store.selectedEventIds.length === totalEvent
                  ? 'correctChecked'
                  : store.selectedEventIds.length
                    ? 'halfChecked'
                    : 'unchecked'
              "
              :disabled="false"
              @click="onAllSelect"
            />
          </div>
        </div>
        <div class="mb-10 flex-1 overflow-y-auto pb-5">
          <div
            v-if="!store.isLoadingGroupsEvents && store.eventsGroupsList.length"
          >
            <div
              v-for="category in store.eventsGroupsList"
              :key="category.category"
              class="flex w-full flex-col gap-2"
            >
              <ProfileSettingDialogMenuWebhookEventCategory
                :icon-class="iconClasses[category.category]"
                :category="category.category"
                :events="category.events"
                :event-count="category.count"
                :tree-list="showListContent"
                :search-text="searchText"
              />
            </div>
          </div>

          <div
            v-else-if="store.isLoadingGroupsEvents"
            class="flex max-h-96 w-full items-center justify-center p-20"
          >
            <div v-loading="store.isLoadingGroupsEvents" />
          </div>
          <div
            v-else
            class="flex h-full w-full items-center justify-center pt-4"
          >
            <BaseNoData />
          </div>
        </div>
      </div>

      <div
        class="fixed bottom-0 left-0 right-0 mt-10 flex h-[2.875rem] w-full space-x-2 bg-[#0C0C0C] px-[0.75rem] py-[0.5rem] text-white"
      >
        <div
          class="order-1 flex w-full flex-none grow-0 flex-row items-center justify-between gap-[1.25rem] self-stretch rounded-b-[0.3125rem]"
        >
          <BaseButton
            icon="fa-solid fa-trash-can"
            class="order-0 flex h-7 flex-none grow-0 flex-row items-center gap-[0.375rem] rounded-[0.3125rem] border-none bg-[rgba(69,10,10,0.5)] text-[#EF4444] hover:bg-[rgba(69,10,10,0.5)]/30"
            label="Discard"
            @click="onOPenModal"
          />
          <BaseButton
            class="border-none bg-transparent hover:bg-[#181818] hover:text-white"
            :class="['px-4 py-2', 'bg-transparent text-[#555555]']"
            type="secondary"
            icon="fa-light fa-save "
            :disabled="store.isWebhookEditLoading"
            :loading="store.isWebhookEditLoading"
            label="Save"
            @click="saveWebhook"
          />
        </div>
      </div>
      <ProfileSettingDialogMenuWebhookEventDetail
        v-model="store.isEventDetail"
        title="Edit Webhook"
        :test-webhook="testWebhook"
        :is-left-drawer="props.isLeftDrawer"
      />
    </div>
  </el-drawer>

  <el-dialog
    v-model="store.isEditWebhookConfirm"
    :show-close="false"
    append-to-body
    destroy-on-close
    width="24rem"
  >
    <div class="flex flex-col">
      <div
        class="flex items-center justify-between rounded-t-sm bg-white/5 p-3"
      >
        <div class="flex items-center gap-2 text-sm">
          <i class="fa-regular fa-floppy-disk" />
          {{ $t('course.changeConfirmation.title') }}
        </div>
        <BaseIconClose @click="onCloseModal" />
      </div>
      <div
        class="flex flex-col gap-5 px-5 py-7 text-sm font-light text-white/70"
      >
        <div>{{ $t('course.changeConfirmation.contentOne') }}</div>
        <div>{{ $t('course.changeConfirmation.contentTwo') }}</div>
      </div>
      <div class="flex items-center justify-end gap-4 p-3">
        <BaseButton
          type="tertiary"
          :label="$t('course.changeConfirmation.quit')"
          icon="fa-regular fa-arrow-left-from-bracket"
          @click="onCloseAllModal"
        />
        <BaseButton @click="saveWebhook">
          <div class="flex size-3 items-center justify-center">
            <i
              v-if="store.isWebhookEditLoading"
              class="fa-light fa-loader animate-spin text-base"
            />
            <i v-else class="fa-solid fa-save text-sm" />
          </div>
          {{ $t('course.changeConfirmation.save') }}
        </BaseButton>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { useToast } from 'vue-toastification';

import WarningCard from './WarningCard.vue';

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

  webhook: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue']);
const showWarningCard = ref(false);
const store = useWebhookStore();

const searchText = ref('');
const showListContent = ref(false);
const title = ref(props.webhook.title);
const eventCategories = ref([]);
const $toast = useToast();
const endpointURL = ref(props.webhook.url);
const showUrlError = computed(() => store.isErrorTestWebhook);

// Computed for v-model
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const handleChangeUrl = () => {
  store.isErrorTestWebhook = false;
};
const testWebhook = async () => {
  if (!store.isLoadingTestWebhook) {
    // Call the store's `testNewWebhook` function
    await store.testNewWebhook(endpointURL.value);

    if (store.isSuccessTestWebhook) {
      setTimeout(() => {
        store.isSuccessTestWebhook = false;
        store.isEventDetail = false;
      }, 500); // 1000 milliseconds = 1 second
    }
    if (store.isErrorTestWebhook) {
      $toast.error(store.testWebhookError);
    }
  }
};

// Calculate Event
watch(
  [title, endpointURL, () => store.selectedEventIds.length],
  () => {
    if (
      title.value !== props.webhook.title ||
      endpointURL.value !== props.webhook.url
    ) {
      store.isEditInputsWebhookChange = true;
    } else {
      store.isEditInputsWebhookChange = false;
      store.isEditWebhookConfirm = false;
    }
  },
  { immediate: true },
);

const totalEvent = computed(() =>
  store.eventsGroupsList.reduce((sum, item) => sum + item.count, 0),
);

// Watch `props.webhook.events` for changes
watch(
  props.webhook,
  async (newWebhook) => {
    endpointURL.value = newWebhook.url;
    store.selectedEventIds = newWebhook.events.map((event) => event.id);
  },
  { immediate: true },
);

function handleCloseDrawer() {
  store.isSuccessTestWebhook = false;
  store.isSuccessCreateWebhook = false;
  store.isErrorTestWebhook = false;
  store.clearSelectedEvents();
  store.isEventDetail = false;
  store.isWebhookEdit = false;
  emit('update:modelValue', false); // Close drawer
  setTimeout(() => {
    store.editedWebhookId = '';
  }, 300);
}

const onCloseAllModal = () => {
  handleCloseDrawer();
  store.isEditWebhookConfirm = false;
};
const onOPenModal = () => {
  if (store.isEditInputsWebhookChange) {
    store.isEditWebhookConfirm = true;
    emit('update:modelValue', true);
    store.isWebhookEdit = true;
  } else {
    handleCloseDrawer();
  }
};
const onCloseModal = () => {
  store.isEditWebhookConfirm = false;
};

async function saveWebhook() {
  try {
    if (store.isWebhookEditLoading) {
      return;
    }
    store.isWebhookEditLoading = true;

    const data = {
      title: title.value,
      url: endpointURL.value,
      events: store.selectedEventIds,
    };

    // Update the webhook status by passing an object with the new status
    await store.updateWebhook(store.editedWebhookId, data);
  } catch (error) {
    console.error('Error editing webhook:', error);
    // Handle errors here, e.g., show a notification to the user
  } finally {
    onCloseAllModal();
    store.isWebhookDetail = false;
    store.isWebhookEditLoading = false;
    handleCloseDrawer(); // Close drawer
  }
}

function onAllSelect() {
  if (
    totalEvent.value &&
    store.selectedEventIds.length &&
    store.selectedEventIds.length === totalEvent.value
  ) {
    store.clearSelectedEvents();
  } else {
    store.selectAllWebhookEvents();
  }
}

// Event fetching function (debounced)
const fetchEventGroups = async (search) => {
  await store.eventsGroupsListStore(search);
  eventCategories.value = store.eventsGroupsList;
};

// Debounced version of the fetchEventGroups function
const debouncedFetchEventGroups = debounce(async (newSearchText) => {
  await fetchEventGroups(newSearchText);
}, 500); // 500ms delay for debouncing

// Watch for changes in searchText and trigger debounced fetch
watch(
  searchText,
  (newSearchText) => {
    if (show.value) {
      debouncedFetchEventGroups(newSearchText); // Call debounced function
    }
  },
  { immediate: true },
);

const iconClasses = {
  profile: ' fa-user',
  chats: ' fa-comments',
  calendar: 'fa-calendar',
  social: 'fa-users',
  space: 'fa-box',
  organization: 'fa-sitemap',
  course: 'fa-books',
  membership: 'fa-user',
  payment: 'fa-credit-card',
};

const endpoint_URL = ref('');

function handleClear() {
  endpoint_URL.value = '';
}

onBeforeUnmount(() => {
  store.clearSelectedEvents();
  store.isNewWebhook = false;
});
</script>

<style lang="scss">
.scrollbar-hide {
  -ms-overflow-style: none; /* For Internet Explorer and Edge */
  scrollbar-width: none; /* For Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Edge */
}

.edit-webhook-drawer {
  .el-drawer__body {
    border-width: 0;
  }
}
</style>
