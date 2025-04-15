<template>
  <div class="relative p-2">
    <!-- background image -->
    <div v-if="!isProfileMenu" class="relative mb-16 h-[6.75rem] w-[100%]">
      <div
        class="absolute right-1 top-1 z-[60] flex items-center rounded-5 border border-white/40 bg-black/40 px-[0.3125rem] py-1 text-xs text-[#f1f1f1]"
      >
        <span>{{ $t('payment.userId', { userId: userId }) }}</span>
        <i
          class="fa-solid fa-copy ml-1 transition-all hover:scale-[1.2]"
          @click="handleClickCopy"
        />
      </div>
      <ProfileSettingDialogCompsEditCoverImg v-if="myProfileInfo.cover">
        <div class="group h-full w-full">
          <img
            class="absolute z-[10] h-full w-full object-cover transition-all duration-200 group-hover:opacity-50"
            :src="myProfileInfo.cover"
          />
          <i
            class="fa-regular fa-camera absolute left-1/2 top-1/2 z-[11] -translate-x-1/2 -translate-y-1/2 scale-125 text-white/80 transition-all duration-200 group-hover:scale-[1.8] group-hover:text-white"
          />
        </div>
      </ProfileSettingDialogCompsEditCoverImg>
      <div
        v-else
        class="group absolute z-[50] flex h-full w-full items-center justify-center rounded-md bg-[#060606]"
      >
        <ProfileSettingDialogCompsEditCoverImg>
          <div class="relative rounded-md bg-[#1C1C1C] px-3 py-1">
            <i class="fa-solid fa-panorama text-[2rem] text-[#505050]" />
            <i
              class="fa-regular fa-camera absolute left-1/2 top-1/2 z-[55] -translate-x-1/2 -translate-y-1/2 scale-125 text-white/80 transition-all duration-200 group-hover:scale-[1.8] group-hover:text-white"
            />
          </div>
        </ProfileSettingDialogCompsEditCoverImg>
      </div>
    </div>

    <div>
      <!-- avatar -->
      <ProfileSettingDialogCompsEditAvatar v-if="!isProfileMenu">
        <div
          class="group absolute left-1.5 top-[6rem] z-[100] h-[5rem] w-[5rem] rounded-[5rem]"
        >
          <div class="relative h-full w-full overflow-hidden rounded-full">
            <BaseAvatar
              size="lg"
              :show-online="false"
              :picture="myProfileInfo.picture"
            />
            <div
              v-if="myProfileInfo.picture"
              class="absolute left-0 top-0 hidden h-full w-full bg-black/50 group-hover:block"
            />
            <img
              v-if="myProfileInfo.status"
              :src="myProfileInfo.status === 'hiring' ? Hiring : OpenToWork"
              class="absolute bottom-0 left-0"
            />
            <i
              class="fa-regular fa-camera absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 transition-all duration-200 group-hover:scale-150 group-hover:text-white"
            />
          </div>
        </div>
      </ProfileSettingDialogCompsEditAvatar>
      <!-- userName and status -->
      <div
        v-if="!isProfileMenu"
        class="absolute left-24 top-[7.5rem] flex w-[calc(100%-6.5rem)] items-center justify-between"
      >
        <div class="flex-grow overflow-hidden">
          <div class="truncate text-base text-[#d9d9d9]">
            {{ userName }}
          </div>
          <div class="text-xs text-[#707070]">
            {{ userEmail }}
          </div>
        </div>
        <div class="flex-shrink-0">
          <div
            v-if="userStatus === 'pending'"
            class="ml-2 flex h-6 items-center gap-2 rounded-full border border-dashed border-[#EAB308] px-1.5 text-xs text-[#EAB308]"
          >
            <i class="fa-solid fa-spinner text-xs" />
            {{ $t('payment.verification.pending') }}
          </div>

          <div
            v-if="userStatus === 'completed'"
            class="ml-2 flex h-6 items-center gap-2 rounded-full border border-dashed border-[#35A823] px-1.5 text-xs text-[#35A823]"
          >
            <i class="fa-regular fa-shield-check text-xs" />
            {{ $t('payment.verification.done') }}
          </div>

          <div
            v-if="userStatus === 'requirement-needed'"
            class="ml-2 flex h-6 cursor-pointer items-center gap-2 rounded-full border border-dashed border-[#EB4937] px-1.5 text-xs text-[#EB4937] transition-all active:scale-95"
            @click="handleBeginStripeOnboarding"
          >
            <i class="fa-solid fa-triangle-exclamation text-xs" />
            {{ $t('payment.verification.requirement') }}
          </div>
        </div>
      </div>

      <!-- Identify Text -->
      <div class="rounded-5 border border-white/5 bg-[#0c0c0c] px-2 py-4">
        <div class="mb-3 flex">
          <div class="mr-4 flex-shrink-0">
            <div
              v-if="!userStatus"
              class="rounded-full border-[0.375rem] border-[#393939]"
            >
              <div
                class="flex h-4 w-4 items-center justify-center rounded-full bg-[#555555] text-xs text-white"
              >
                1
              </div>
            </div>

            <div
              v-if="userStatus === 'completed'"
              class="rounded-full border-[0.375rem] border-[#afff89] border-opacity-10"
            >
              <div
                class="flex h-4 w-4 items-center justify-center rounded-full bg-[#00d078]"
              >
                <i class="fa-solid fa-check text-xs text-black" />
              </div>
            </div>

            <div
              v-if="userStatus === 'requirement-needed'"
              class="rounded-full border-[0.375rem] border-[#ff8989] border-opacity-10"
            >
              <div
                class="flex h-4 w-4 items-center justify-center rounded-full bg-[#ae2b26]"
              >
                <i class="fa-solid fa-xmark text-xs text-black" />
              </div>
            </div>
          </div>
          <div class="text-xl font-semibold text-[#e2e2e2]">
            {{ $t('payment.identify.yourself') }}
          </div>
        </div>
        <div class="mb-2 flex items-center">
          <div class="mx-1.5 w-8 flex-shrink-0">
            <i class="fa-light fa-globe" />
          </div>
          <div class="text-white/70">
            {{ $t('payment.user.create') }}
          </div>
        </div>
        <div class="mb-2 flex items-center">
          <div class="mx-1.5 w-8 flex-shrink-0">
            <i class="fa-light fa-globe" />
          </div>
          <div class="text-white/70">
            {{ $t('payment.user.share') }}
          </div>
        </div>
        <div class="flex items-center">
          <div class="mx-1.5 w-8 flex-shrink-0">
            <i class="fa-light fa-globe" />
          </div>
          <div class="text-white/70">
            {{ $t('payment.user.publish') }}
          </div>
        </div>

        <!-- become a teacher -->
        <div class="mt-3 flex items-end justify-between text-sm">
          <div class="country-box mr-4 w-[13rem] md:w-60">
            <BaseSelectElselect
              v-model="country"
              :list="countries"
              :title="t('payment.company.address')"
              :auto-focus-search-input="true"
              :prefix-img-src="countryFlag"
              :disabled="disabledSelect"
              :fields="{ label: 'name', value: 'name', searchKey2: 'alpha2' }"
              @change="handleCountryOnChange"
            >
              <template #custom="{ row }">
                <div class="flex h-full w-full items-center">
                  <img
                    :src="row.flagIcon"
                    alt="flag icon"
                    class="mr-2 h-4 w-6"
                  />
                  <div class="text-sm">
                    <span
                      class="text-gray-500"
                      v-html="highlightKeywords(row.alpha2, [row.searchVal])"
                    />
                    <span
                      class="ml-2"
                      v-html="highlightKeywords(row.name, [row.searchVal])"
                    />
                  </div>
                </div>
              </template>
            </BaseSelectElselect>
          </div>
          <div>
            <BaseButton
              v-if="!userStatus"
              :icon="loading ? 'fa-spinner animate-spin' : ''"
              label="$t:payment.verify.identity"
              data-cy="28969c983b903507"
              @click="handleClickBecomeTeacher"
            />

            <BaseButton
              v-if="userStatus === 'requirement-needed'"
              :icon="loading ? 'fa-spinner animate-spin' : ''"
              label="$t:payment.continue"
              @click="handleBeginStripeOnboarding"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import WebSocketService from '~/utils/websocket';

defineProps({
  isProfileMenu: {
    type: Boolean,
    required: false,
  },
});
const emits = defineEmits(['update', 'toggleStripeSection']);

const { t } = useI18n();
const $toast = useToast();
const profileStore = useProfileStore();
const paymentStore = usePaymentStore();
const websocket = WebSocketService.getInstance();

const myProfileInfo = ref({});
const loading = ref(false);
const country = ref('');
const countryFlag = ref('');
const disabledSelect = ref(false);

const userId = computed(() => profileStore.myProfileDetail.id);
const userName = computed(() => profileStore.myProfileDetail.fullName);
const userEmail = computed(() => profileStore.myProfileDetail.email);
const userStatus = computed(
  () => profileStore.myProfileDetail.stripeConnectOnboard,
);
const countries = computed(() =>
  paymentStore.countries
    .map((countryItem) => ({
      ...countryItem,
      name1: countryItem.name,
      alpha2: countryItem.code.alpha2,
    }))
    .sort((prev, curr) => prev.name.localeCompare(curr.name)),
);

onMounted(() => {
  paymentStore.getStripeCountries();
  websocket.on(
    'connect-account-status-updated',
    handleConnectAccountStatusUpdated,
  );
});
onUnmounted(() => {
  websocket.off(
    'connect-account-status-updated',
    handleConnectAccountStatusUpdated,
  );
});

watch(
  () => [profileStore.myProfileDetail, countries],
  (newParam) => {
    const [newVal, countries] = newParam;
    myProfileInfo.value.cover = newVal.cover;
    myProfileInfo.value.picture = newVal.picture;
    myProfileInfo.value.status = newVal.status;
    if (newVal.address?.country) {
      const targetCountry = countries.value.find(
        (item) => item.name === newVal.address.country,
      );
      if (targetCountry) {
        disabledSelect.value = true;
        country.value = targetCountry.alpha2;
        countryFlag.value = targetCountry.flagIcon;
      }
    }
  },
  { immediate: true, deep: true },
);

async function handleClickCopy() {
  try {
    await navigator.clipboard.writeText(userId.value);
    $toast.success(t('payment.id.copied'));
  } catch (error) {
    console.error('Failed to copy id to clipboard', error);
  }
}

async function handleBeginStripeOnboarding() {
  emits('toggleStripeSection', true);
}

function handleCountryOnChange(item) {
  country.value = item?.alpha2;
  countryFlag.value = item?.flagIcon;
}

function handleConnectAccountStatusUpdated(data) {
  if (data.userId === profileStore.myProfileDetail.id) {
    emits('update');
  }
}

async function handleClickBecomeTeacher() {
  try {
    if (loading.value) {
      return;
    }
    if (!country.value) {
      $toast.error(t('payment.user.error.address'));
      return;
    }
    loading.value = true;
    const alpha2Code = country.value.toUpperCase();
    await profileStore.becomeTeacher({
      country: {
        name: countries.value.find((item) => item.alpha2 === alpha2Code).name,
        alpha2Code,
      },
    });
    handleBeginStripeOnboarding();
    // logToDebug('click handleClickBecomeTeacher');
    emits('update');
  } catch (err) {
    console.log('err', err);
  } finally {
    loading.value = false;
  }
}
</script>
<style lang="scss">
.country-box {
  .el-select {
    .el-select__wrapper {
      background-color: transparent;
    }
  }
}
</style>
