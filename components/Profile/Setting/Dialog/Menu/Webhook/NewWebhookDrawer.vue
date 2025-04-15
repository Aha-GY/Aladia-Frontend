<template>
  <el-drawer
    v-model="show"
    :with-header="true"
    :show-close="false"
    :open-delay="0"
    destroy-on-close
    :lock-scroll="false"
    :modal="false"
    :close-on-press-escape="false"
    :append-to-body="!isLeftDrawer"
    :class="{
      'is-body-drawer': !isLeftDrawer,
    }"
    class="new-webhook-drawer h-full !w-[30rem]"
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
          <div class="text-lg">
            {{ $t('personal.webhook.new') }}
          </div>
        </div>
      </div>
    </template>
    <div
      :class="{
        '-mt-4 p-4': !isLeftDrawer,
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
            {{ $t('personal.webhook.info') }}
          </p>
          <p>
            {{ $t('personal.webhook.infoUrl') }}
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
              :required="isRequired && !title"
              type="text"
              data-cy="webhook-title"
              @clear="handleClear"
            />
          </div>

          <div class="relative">
            <BaseInput
              v-model.trim="endpointURL"
              :required="(isRequired || isEndPointUrlRequired) && !endpointURL"
              type="text"
              :title="$t('personal.webhook.url.endpoint')"
              :show-validate-error="
                store.isErrorTestWebhook || store.isErrorCreateWebhook
              "
              data-cy="webhook-url"
              @clear="handleClear"
              @change="handleChangeUrl"
            />
            <div class="h-5">
              <div
                v-show="store.isErrorTestWebhook"
                class="mt-1 text-sm text-[#ED3C28]"
              >
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
              class="flex items-center justify-center text-center"
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
        <div class="mb-10 flex-1 pb-5">
          <div
            v-if="!store.isLoadingGroupsEvents && store.eventsGroupsList.length"
            class="flex w-full flex-col"
          >
            <div
              v-for="category in store.eventsGroupsList"
              :key="category.category"
              class="flex w-full flex-col gap-2"
              :data-cy="`${category.category}-webhook-events`"
            >
              <ProfileSettingDialogMenuWebhookEventCategory
                :icon-class="iconClasses[category.category]"
                :category="category.category"
                :events="category.events"
                :event-count="category.count"
                :tree-list="showListContent"
                :search-text="searchText"
                :data-cy="`${category.category}`"
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
        class="fixed bottom-0 left-0 right-0 mt-10 flex h-[2.875rem] w-full justify-end space-x-2 bg-[#0C0C0C] px-[0.75rem] py-[0.5rem] text-white"
      >
        <BaseButton
          class="border-none bg-transparent hover:bg-[#181818] hover:text-white"
          :disabled="store.isLoadingCreateWebhook"
          :loading="store.isLoadingCreateWebhook"
          :class="['px-4 py-2', 'bg-transparent text-[#555555]']"
          type="secondary"
          icon="fa-light fa-save "
          label="$t:personal.webhook.create"
          data-cy="new-webhook-create-button"
          @click="createWebhook"
        />
      </div>
      <ProfileSettingDialogMenuWebhookEventDetail
        v-model="store.isEventDetail"
        title="New Webhook"
        :test-webhook="testWebhook"
        :is-left-drawer="props.isLeftDrawer"
      />
    </div>
  </el-drawer>

  <el-dialog
    v-model="store.isCreateWebhookConfirm"
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
        <BaseButton @click="createWebhook">
          <div class="flex size-3 items-center justify-center">
            <i
              v-if="store.isLoadingCreateWebhook"
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
});

// Show drawer state
const emit = defineEmits(['update:modelValue']);
const $toast = useToast();
const showWarningCard = ref(false);
const store = useWebhookStore();
const searchText = ref('');
const showListContent = ref(false);
const title = ref('');
const eventCategories = ref([]);
const endpointURL = ref('');
const isRequired = ref(false);
const isEndPointUrlRequired = ref(false);

// Computed for v-model
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const handleChangeUrl = () => {
  store.isErrorTestWebhook = false;
};
const testWebhook = async () => {
  if (!endpointURL.value) {
    store.isEventDetail = false;
    isEndPointUrlRequired.value = true;
    $toast.error('Endpoint url required');
  }
  if (!store.isLoadingTestWebhook) {
    await store.testNewWebhook(endpointURL.value);
  }

  if (store.isSuccessTestWebhook) {
    setTimeout(() => {
      store.isSuccessTestWebhook = false;
      store.isEventDetail = false;
    }, 500); // 1000 milliseconds = 1 second
  }

  if (store.isErrorTestWebhook) {
    store.isEventDetail = false;
    $toast.error(store.testWebhookError);
  }
};

// Calculate Event
const totalEvent = computed(() =>
  store.eventsGroupsList.reduce((sum, item) => sum + item.count, 0),
);

watch(
  [title, endpointURL, () => store.selectedEventIds.length],
  () => {
    if (
      title.value !== '' ||
      endpointURL.value !== '' ||
      (store.selectedEventIds.length > 0 && store.isNewWebhook)
    ) {
      store.isCreateInputsWebhookChange = true;
    } else {
      store.isCreateInputsWebhookChange = false;
      store.isCreateWebhookConfirm = false;
    }
  },
  { immediate: true },
);

function handleClear() {
  isEndPointUrlRequired.value = false;
  isRequired.value = false;
  endpointURL.value = '';
  title.value = '';
  store.selectedEventIds = [];
}

function handleCloseDrawer() {
  store.clearSelectedEvents();
  store.isSuccessTestWebhook = false;
  store.isSuccessCreateWebhook = false;
  store.isErrorCreateWebhook = false;
  store.isErrorTestWebhook = false;
  store.isEventDetail = false;
  store.isNewWebhook = false;
  emit('update:modelValue', false); // Close drawer
  handleClear();
}

const onCloseAllModal = () => {
  handleCloseDrawer();
  store.isCreateWebhookConfirm = false;
};
const onOPenModal = () => {
  if (store.isCreateInputsWebhookChange) {
    store.isCreateWebhookConfirm = true;
    emit('update:modelValue', true);
    store.isNewWebhook = true;
  } else {
    handleCloseDrawer();
  }
};
const onCloseModal = () => {
  store.isCreateWebhookConfirm = false;
};

onBeforeUnmount(() => {
  store.clearSelectedEvents();
});

async function createWebhook() {
  if (store.isLoadingCreateWebhook) {
    return;
  }
  if (!title.value) {
    $toast.error('Title is required');
    onCloseModal();
    isRequired.value = true;
    return;
  }

  if (!endpointURL.value) {
    $toast.error('Endpoint Url is required');
    onCloseModal();
    isRequired.value = true;
    return;
  }

  if (!store.selectedEventIds.length) {
    $toast.error('At least one event is required');
    return;
  }
  try {
    if (!store.isLoadingCreateWebhook) {
      store.isSuccessCreateWebhook = true;
      // Create the webhook and wait for its completion
      await store.createWebhook(title.value, endpointURL.value);
    }
  } catch (error) {
    console.error('Error creating webhook:', error);
    // Handle errors here, e.g., show a notification to the user
  } finally {
    if (!store.isErrorCreateWebhook) {
      onCloseAllModal();
      handleCloseDrawer();
    }
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
    debouncedFetchEventGroups(newSearchText); // Call debounced function
  },
  { immediate: true },
);

// Watch for changes in store.isSuccessCreateWebhook
watch(
  () => store.isSuccessCreateWebhook,
  (newValue) => {
    if (newValue) {
      store.isNewWebhook = false;
      store.clearSelectedEvents();
      store.isSuccessTestWebhook = false;
      store.isSuccessCreateWebhook = false;
    }
  },
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
</script>

<style lang="scss">
.scrollbar-hide {
  -ms-overflow-style: none; /* For Internet Explorer and Edge */
  scrollbar-width: none; /* For Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Edge */
}
.new-webhook-drawer {
  .el-drawer__body {
    border-width: 0;
  }
}
</style>
