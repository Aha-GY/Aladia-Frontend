<template>
  <div class="pb-0.5">
    <ProfileSettingDialogCompsBox>
      <div class="flex justify-between">
        <div class="mb-[1.125rem] text-[1.125rem]">
          {{ t('personal.profile.logged.label') }}
        </div>
        <div class="mb-[1.125rem]">
          <BaseButton
            class="ml-3 !border-red-500 text-[#EF4444] hover:text-[#EF4444]"
            :label="t('personal.profile.logged.allLogout')"
            type="outline"
            @click="openConfirmAllLogoutModal = true"
          />
        </div>
      </div>

      <div class="hide-scrollbar max-h-[27.5rem] w-full overflow-y-auto">
        <div
          v-infinite-scroll="loadMoreData"
          :infinite-scroll-disabled="isLoggedLoading || !next"
          :infinite-scroll-distance="20"
        >
          <div v-if="!isLoggedLoading && loggedList.length">
            <div
              v-for="(item, index) in filterUniqueData(loggedList)"
              :key="index"
              class="flex flex-row"
            >
              <div
                class="flex w-full items-start justify-between border-b border-[#fff]/5 py-2.5"
              >
                <div
                  class="flex h-8 w-8 items-center justify-center text-white"
                >
                  <i
                    v-if="getDeviceType(item.device, item.os) === 'PC'"
                    class="fa-regular fa-laptop"
                  />
                  <i
                    v-else-if="getDeviceType(item.device, item.os) === 'Mobile'"
                    class="fa-regular fa-mobile"
                  />
                  <i
                    v-else-if="getDeviceType(item.device, item.os) === 'Pad'"
                    class="fa-regular fa-tablet-button"
                  />
                  <i v-else class="fa-light fa-circle-exclamation" />
                </div>
                <div class="ml-2 flex-1 text-sm text-[#B0B0B0]">
                  <div>{{ item?.os }}, {{ item?.browser }}</div>
                  <!-- <BaseGoogleMapsPopoverMap :item="item"> -->
                  <div
                    class="cursor-pointer text-xs font-medium text-[#707070] hover:underline"
                    @click="handleShowDetail(item)"
                  >
                    {{ item?.country }},{{ item?.city }} |
                    {{ formatRelativeTime(item?.date) }}
                  </div>
                  <div
                    v-if="item.isCurrent"
                    class="mr-2 mt-0.5 flex h-6 w-fit items-center justify-center whitespace-nowrap rounded-5 border border-[#86EFAC] px-1 text-xs font-medium text-[#86EFAC]"
                  >
                    {{ t('personal.profile.logged.thisDevice') }}
                  </div>
                </div>
                <div class="mt-0.5 flex items-center">
                  <BaseButton
                    class="!bg-[#B91C1C] !text-[#0A0A0A] hover:opacity-90"
                    label="$t:personal.profile.logged.logout"
                    @click="handleItem(item)"
                  />
                </div>
              </div>
            </div>
          </div>
          <BaseNoData v-if="!isLoggedLoading && loggedList.length === 0" />
          <div
            v-if="isLoggedLoading && !loggedList.length"
            class="flex w-full items-center justify-center py-10"
          >
            <div v-loading="isLoggedLoading" />
          </div>
          <div v-if="isLoggedLoading && loggedList.length">
            <ProfileSettingDialogCompsLoggedDevicesSkeleton
              v-for="i in 6"
              :key="i"
            />
          </div>
        </div>
      </div>
      <BaseDialog
        v-model="openConfirmModal"
        :title="$t('personal.profile.logged.confirmLogoutTItle')"
        title-class="!text-xl !text-[#EB4937]"
        class="!w-[90%] md:!w-[580px]"
        @close="onCancel"
      >
        <template #titleIcon>
          <i
            class="fa-regular fa-right-from-bracket pr-1.5 text-base !font-normal !text-[#EB4937]"
          />
        </template>

        <div class="grid grid-cols-1 gap-4 text-sm text-[#b0b0b0]">
          {{ $t('personal.profile.logged.confirmLogoutContent') }}
        </div>
        <div class="mt-[1.125rem] flex justify-end">
          <BaseButton
            type="tertiary"
            label="$t:personal.profile.logged.cancel"
            data-cy="046dba1ca3ae9c63"
            @click="onCancel"
          />
          <BaseButton
            class="ml-3"
            type="error"
            label="$t:personal.profile.logged.confirm"
            :loading="isLogoutLoading"
            :disabled="isLogoutLoading"
            data-cy="delete-account-confirm-button"
            @click="confirm"
          />
        </div>
      </BaseDialog>
      <BaseDialog
        v-model="openConfirmAllLogoutModal"
        :title="$t('personal.profile.logged.confirmAllLogoutTitle')"
        title-class="!text-xl !text-[#EB4937]"
        class="!w-[80%] md:!w-[580px]"
        @close="onCancelAllLogout"
      >
        <template #titleIcon>
          <i
            class="fa-regular fa-right-from-bracket pr-1.5 text-base !font-normal !text-[#EB4937]"
          />
        </template>

        <div class="grid grid-cols-1 gap-4 text-sm text-[#b0b0b0]">
          {{ $t('personal.profile.logged.confirmAllLogoutContent') }}
        </div>
        <div class="mt-[1.125rem] flex justify-end">
          <BaseButton
            type="tertiary"
            label="$t:personal.profile.logged.cancel"
            data-cy="046dba1ca3ae9c63"
            @click="onCancelAllLogout"
          />
          <BaseButton
            class="ml-3"
            type="error"
            label="$t:personal.profile.logged.logout"
            :loading="isAllLogoutLoading"
            :disabled="isAllLogoutLoading"
            data-cy="delete-account-confirm-button"
            @click="logoutAllDevices"
          />
        </div>
      </BaseDialog>

      <ProfileSettingDialogCompsLoggedDevicesDetail
        v-model="showDetail"
        :detail="selectedDevice"
        :is-left-drawer="isLeftDrawer"
        :on-logout="confirm"
        :is-loading="isLogoutLoading"
        @reference="handlerReference"
      />
    </ProfileSettingDialogCompsBox>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { logout, allLoggedDevices } from '@/api/v2/auth.js';
import { getDeviceType } from '@/utils';

defineProps({
  isLeftDrawer: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();

const $toast = useToast();

const loggedList = ref([]);
const cursor = ref({});
const limit = ref(0);
const next = ref(cursor.value?.next);
const handlerReference = () => {
  console.log('--------------↓↓↓↓↓---------------------');
  console.log(111);
  console.log('--------------↑↑↑↑↑---------------------');
};

// const loading = ref(true);
const authStore = useAuthStore();
const openConfirmModal = ref(false);
const openConfirmAllLogoutModal = ref(false);
const selectedDevice = ref(null);
const showDetail = ref(false);
// loading states
const isLogoutLoading = ref(false);
const isAllLogoutLoading = ref(false);
const isLoggedLoading = ref(false);

const isLogoutSuccess = ref(false);

const handleItem = (item) => {
  selectedDevice.value = item;
  openConfirmModal.value = true;
};
const handleShowDetail = (item) => {
  selectedDevice.value = item;
  showDetail.value = true;
};
const onCancel = () => {
  selectedDevice.value = null;
  openConfirmModal.value = false;
  isLogoutLoading.value = false;
};

const onCancelAllLogout = () => {
  openConfirmAllLogoutModal.value = false;
  isAllLogoutLoading.value = false;
};

function filterUniqueData(data) {
  const uniqueData = new Map();
  data.forEach((ud) => {
    if (!uniqueData.has(ud.token)) {
      uniqueData.set(ud.token, ud);
    }
  });
  return Array.from(uniqueData.values());
}

const logoutAllDevices = async () => {
  if (isAllLogoutLoading.value) {
    return false;
  }

  isAllLogoutLoading.value = true;
  try {
    await logout({ devices: 'all' });
    openConfirmAllLogoutModal.value = false;
    authStore.clearLoginData();
    $toast.success(t('personal.profile.logged.logoutSuccess'));
  } finally {
    isAllLogoutLoading.value = false;
    await allDevicesLogged();
  }
};

const allDevicesLogged = async () => {
  isLoggedLoading.value = true;
  try {
    const response = await allLoggedDevices({
      limit: 20,
    });
    loggedList.value = response?.data;
    cursor.value = response?.cursor;
    next.value = response?.cursor.next;
  } finally {
    isLoggedLoading.value = false;
  }
};

// Load more data on scroll
const loadMoreData = debounce(async () => {
  if (!cursor.value?.next || isLoggedLoading.value || !limit.value) {
    limit.value = 20;
    return;
  }

  try {
    isLoggedLoading.value = true;
    const response = await allLoggedDevices({
      next: next.value,
      limit: limit.value,
    });
    const resData = response?.data || [];
    cursor.value = response?.cursor;
    next.value = response?.cursor?.next;
    loggedList.value = [...loggedList.value, ...resData];
  } catch (error) {
    console.error('Error loading more data:', error);
  } finally {
    isLoggedLoading.value = false;
  }
}, 100);

const confirm = async () => {
  if (isLogoutLoading.value) {
    return false;
  }
  isLogoutLoading.value = true;
  try {
    await logout({ devices: 'other', token: selectedDevice.value?.token });
    isLogoutSuccess.value = true;
    openConfirmModal.value = false;
    $toast.success(t('personal.profile.logged.logoutSuccess'));
  } finally {
    isLogoutLoading.value = false;

    showDetail.value = false;
    await allDevicesLogged();
  }
};

onMounted(async () => {
  await allDevicesLogged();
});
</script>
