<template>
  <div class="relative p-2">
    <!-- background image -->
    <div class="relative mb-16 h-[6.75rem] w-[100%]">
      <div
        class="absolute right-1 top-1 z-[60] flex items-center rounded-5 border border-white/40 bg-black/40 px-[0.3125rem] py-0.5 text-xs text-[#f1f1f1]"
      >
        <span>{{ $t('payment.userId', { userId: orgId }) }}</span>
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
      <ProfileSettingDialogCompsEditAvatar>
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
            <i
              class="fa-regular fa-camera absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 transition-all duration-200 group-hover:scale-150 group-hover:text-white"
            />
          </div>
        </div>
      </ProfileSettingDialogCompsEditAvatar>
      <!-- userName and status -->
      <div
        class="absolute left-24 top-[7.5rem] flex w-[calc(100%-6.5rem)] items-center justify-between"
      >
        <div class="overflow-hidden">
          <div class="truncate text-base text-[#d9d9d9]">
            {{ name || orgName }}
          </div>
          <div class="text-xs text-[#707070]">
            {{ domain || orgDomain }}
          </div>
        </div>
        <div class="flex-shrink-0">
          <div
            v-if="orgStatus === 'pending'"
            class="ml-2 flex h-6 items-center gap-2 rounded-full border border-dashed border-[#EAB308] px-1.5 text-xs text-[#EAB308]"
          >
            <i class="fa-solid fa-spinner text-xs" />
            {{ $t('payment.verification.pending') }}
          </div>

          <div
            v-if="orgStatus === 'completed'"
            class="ml-2 flex h-6 items-center gap-2 rounded-full border border-dashed border-[#35A823] px-1.5 text-xs text-[#35A823]"
          >
            <i class="fa-regular fa-shield-check text-xs" />
            {{ $t('payment.verification.done') }}
          </div>

          <div
            v-if="orgStatus === 'requirement-needed'"
            class="ml-2 flex h-6 cursor-pointer items-center gap-2 rounded-full border border-dashed border-[#EB4937] px-1.5 text-xs text-[#EB4937] transition-all active:scale-95"
            @click="handleClickFinishOnboarding"
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
              v-if="!orgStatus"
              class="rounded-full border-[0.375rem] border-[#393939]"
            >
              <div
                class="flex h-4 w-4 items-center justify-center rounded-full bg-[#555555] text-xs text-white"
              >
                1
              </div>
            </div>

            <div
              v-if="orgStatus === 'completed'"
              class="rounded-full border-[0.375rem] border-[#afff89] border-opacity-10"
            >
              <div
                class="flex h-4 w-4 items-center justify-center rounded-full bg-[#00d078]"
              >
                <i class="fa-solid fa-check text-xs text-black" />
              </div>
            </div>

            <div
              v-if="orgStatus === 'requirement-needed'"
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
            {{ $t('payment.identify.company') }}
          </div>
        </div>
        <!-- org onboarding -->
        <div class="mt-3 text-sm">
          <div class="w-full">
            <BaseInput
              ref="selectBrand"
              v-model="name"
              :disabled="disabledEdit"
              :title="t('payment.company.name')"
              :placeholder="t('payment.subscribe.packages.select')"
              @on-focus="showBrands = true"
            />

            <el-popover
              v-model:visible="showBrands"
              trigger="click"
              width="fit-content"
              virtual-triggering
              :virtual-ref="selectBrand"
              :trigger-keys="[]"
            >
              <div class="max-h-[20rem] overflow-y-auto">
                <BaseSelectBrands
                  class="w-[30rem]"
                  :name="name"
                  :brand="brand"
                  :no-org="true"
                  :auto-close="false"
                  @select="handleChangeBrands"
                />
              </div>
            </el-popover>
          </div>
          <div class="mt-4 w-full">
            <BaseInput
              v-model.trim="domain"
              :disabled="disabledEdit"
              :title="t('payment.websiteUrl')"
              :placeholder="t('payment.websiteUrl')"
            />
          </div>
          <div class="country-box mt-2 w-full">
            <BaseSelectElselect
              v-model="country"
              :list="countries"
              :placeholder="t('payment.company.address')"
              :title="t('payment.company.address')"
              :auto-focus-search-input="true"
              :prefix-img-src="countryFlag"
              :disabled="disabledEdit"
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
          <div class="mt-4 flex justify-end">
            <BaseButton
              v-if="!orgStatus"
              :icon="loading ? 'fa-spinner animate-spin' : ''"
              label="$t:payment.company.verify"
              data-cy="28969c983b903507"
              @click="handleCreateOrganization"
            />

            <BaseButton
              v-if="orgStatus === 'requirement-needed'"
              :icon="loading ? 'fa-spinner animate-spin' : ''"
              label="$t:payment.continue"
              @click="handleClickFinishOnboarding"
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

const emits = defineEmits(['update', 'syncName', 'toggleStripeSection']);

const { t } = useI18n();
const $toast = useToast();
const profileStore = useProfileStore();
const paymentStore = usePaymentStore();
const websocket = WebSocketService.getInstance();

// public ones, update with global store
const myProfileInfo = ref({});
const loading = ref(false);
const country = ref('');
const name = ref('');
const domain = ref('');
const brand = ref();
const showBrands = ref(false);
const selectBrand = ref(null);
const disabledDomain = ref(false);
const countryFlag = ref('');
const disabledEdit = ref(false);

const orgId = computed(() => profileStore.myProfileDetail.id);
const orgName = computed(() => profileStore.myProfileDetail.fullName);
const orgDomain = computed(() => profileStore.myProfileDetail.domain || '--');
const orgStatus = computed(() => {
  // 没有domain, 默认为初始状态, 行为同user的student状态
  if (!profileStore.myProfileDetail.domain) {
    return null;
  }
  return profileStore.myProfileDetail.stripeConnectOnboard;
});

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

    if (!name.value) {
      name.value = newVal.fullName;
    }
    if (!domain.value) {
      domain.value = newVal.domain;
    }
    // for org
    if (newVal.sites?.length) {
      const countryVal = newVal.sites[0].country;
      const targetCountry = countries.value.find(
        (item) => item.name === countryVal,
      );
      if (targetCountry) {
        disabledEdit.value = true;
        country.value = targetCountry.alpha2;
        countryFlag.value = targetCountry.flagIcon;
      }
    }
  },
  { immediate: true, deep: true },
);

watch(
  () => name.value,
  (newVal) => {
    showBrands.value = true;
    emits('syncName', newVal);
  },
);

async function handleChangeBrands(item) {
  disabledDomain.value = true;
  const nameText = item.name || item.domain;
  name.value = nameText;

  if (item.domain) {
    domain.value = item.domain;
  }

  if (item.picture) {
    myProfileInfo.value.picture = item.picture;
  }

  brand.value = {
    name: nameText,
    domain: item.domain || '',
  };
  await sleep(100);
  showBrands.value = false;
}

async function handleClickCopy() {
  try {
    await navigator.clipboard.writeText(orgId.value);
    $toast.success(t('payment.id.copied'));
  } catch (error) {
    console.error('Failed to copy id to clipboard', error);
  }
}

async function handleClickFinishOnboarding() {
  emits('toggleStripeSection', true);
}

function handleCountryOnChange(item) {
  country.value = item?.alpha2;
  countryFlag.value = item?.flagIcon;
}

function handleConnectAccountStatusUpdated(data) {
  console.log('-----notification data------', data);
  if (data.userId === profileStore.myProfileDetail.id) {
    console.log('-----notification data------', data);
    emits('update');
  }
}

async function handleCreateOrganization() {
  try {
    if (loading.value) {
      return;
    }
    if (!name.value) {
      $toast.error(t('payment.form.error.name'));
      return;
    }
    if (!domain.value) {
      $toast.error(t('payment.form.error.website'));
      return;
    }
    if (!validateURL(domain.value)) {
      $toast.error(t('org.validWebsiteField'));
      return;
    }
    if (!country.value) {
      $toast.error(t('payment.form.error.address'));
      return;
    }
    loading.value = true;
    const alpha2Code = country.value.toUpperCase();
    const params = {
      name: name.value,
      domain: domain.value,
      country: {
        name: countries.value.find((item) => item.alpha2 === alpha2Code).name,
        alpha2Code,
      },
    };
    if (myProfileInfo.value.picture) {
      params.pictureUrl = myProfileInfo.value.picture;
    }
    // todo: debug log, will remove later
    logToDebug({
      type: '----- verificationOrganization begin -----',
    });
    const data = await profileStore.verificationOrganization(params);
    logToDebug({
      type: '----- verificationOrganization end -----',
      data: data.accountLink,
    });

    emits('update');
    if (data.accountLink?.onboardUrl) {
      console.log('toggleStripeSection', data.accountLink.clientSecret);
      emits('toggleStripeSection', true);
      // update the avatar in sidebar
      profileStore.myOrganizationList.forEach((org) => {
        if (org.id === profileStore.myOrgProfileDetail.id) {
          org.picture = params.pictureUrl;
        }
      });
    }
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
