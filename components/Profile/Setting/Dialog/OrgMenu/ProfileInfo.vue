<template>
  <div class="flex h-full flex-col">
    <div class="relative flex-1">
      <ProfileSettingDialogCompsBox>
        <div class="relative mb-16 h-[6rem] w-[100%]">
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
            class="group absolute z-[10] flex h-full w-full items-center justify-center rounded-md bg-[#060606]"
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
        <ProfileSettingDialogCompsEditAvatar>
          <div
            class="group absolute left-[2.25rem] top-[5rem] z-[100] flex size-[6rem] items-center justify-center rounded-full bg-[#0b0b0b]"
          >
            <BaseAvatarNext
              :picture="myProfileInfo.picture"
              :show-online="false"
              size="lg"
              default-icon="fa-solid fa-building-ngo"
            />
            <i
              class="fa-regular fa-camera absolute text-white/80 transition-all duration-200 group-hover:scale-150 group-hover:text-white"
            />
          </div>
        </ProfileSettingDialogCompsEditAvatar>
        <div class="grid grid-cols-1 gap-4">
          <div class="mt-2 flex flex-row items-end">
            <BaseInput
              v-model="myProfileInfo.name"
              :title="$t('calendar.organization.name')"
              open
            />
          </div>
          <div class="flex flex-row items-end">
            <BaseInput
              v-model.trim="myProfileInfo.domain"
              title="Website"
              open
            />
          </div>
        </div>
      </ProfileSettingDialogCompsBox>
      <ProfileSettingDialogCompsBox single-col class="relative">
        <div class="flex flex-row items-end">
          <BaseInput v-model.trim="myProfileInfo.email" title="Mail" open />
        </div>
        <div class="flex flex-row items-end">
          <BaseInput
            v-model="phoneNumber.value"
            :title="$t('calendar.organization.phone')"
            open
            number
            :max-length="phonelength"
          >
            <template #prefix>
              <el-popover
                v-model:visible="open.phoneNumber"
                trigger="click"
                :width="350"
                placement="bottom-start"
              >
                <template #reference>
                  <div
                    class="ml-[-12px] flex cursor-pointer flex-row items-center justify-between text-sm"
                  >
                    <div class="flex flex-row items-center">
                      <CountryFlag
                        v-if="phoneNumber.flag"
                        :country="phoneNumber.flag"
                        class="!m-0 !scale-[0.4]"
                      />
                      <span class="ml-[-10px]">+{{ phoneNumber.prefix }}</span>
                    </div>
                  </div>
                </template>
                <ProfilePhone
                  v-if="open.phoneNumber"
                  v-model:length="phonelength"
                  :value="phoneNumber.prefix"
                  @select="
                    (d) => {
                      open.phoneNumber = false;
                      phoneNumber.flag = d.originAlpha2;
                      phoneNumber.prefix = +d.phonePrefix;
                      phoneNumber.value = '';
                    }
                  "
                />
              </el-popover>
            </template>
          </BaseInput>
        </div>
        <div>
          <div class="space-y-2">
            <div>{{ $t('personal.profile.bio') }}</div>
            <LazyBaseEditor
              v-model="myProfileInfo.bio"
              name="description-editor"
              type="textarea"
              :options="{
                placeholder: $t('personal.write.placeholder'),
              }"
              area-height="4rem"
              limit-character
              :characters-limit="70"
              :auto-focus="false"
              data-cy="about-description"
            />
          </div>
        </div>
        <div>
          <el-popover
            v-model:visible="open.industry"
            trigger="click"
            width="95%"
            :teleported="false"
            placement="bottom-start"
            :persistent="false"
            :trigger-keys="[]"
          >
            <template #reference>
              <BaseInput
                v-model="industryName"
                :title="$t('org.industry.label')"
                open
              />
            </template>
            <BaseSelectSingle
              class="w-full"
              :name="industryName"
              :load="searchIndustryFetch"
              :active="industryName"
              @select="handleIndustry"
            />
            <BaseSelect :data="industryList" @select="handleIndustry" />
          </el-popover>
        </div>
        <div>
          <el-popover
            v-model:visible="open.employees"
            trigger="click"
            width="95%"
            :teleported="false"
            :trigger-keys="[]"
          >
            <template #reference>
              <BaseInput
                v-model="myProfileInfo.totalEmployees"
                :title="$t('org.employee.count')"
                open
                readonly
              />
            </template>
            <BaseSelect :data="employeesList" @select="handleEmployees" />
          </el-popover>
        </div>
        <div class="flex w-full flex-col">
          <div>{{ t('event.schedule.timezone') }}</div>
          <BaseSelectElselect
            v-model="sites.timezone"
            :list="timezoneList"
            :auto-focus-search-input="true"
            fixed
            :fields="{ label: 'zone', value: 'zone' }"
          >
            <template #suffix="{ row }">
              <div class="text-[#707070]">UTC{{ row.gmt }}</div>
            </template>
          </BaseSelectElselect>
        </div>
      </ProfileSettingDialogCompsBox>
      <ProfileSettingDialogCompsBox>
        <div class="-mt-1">
          <div class="flex flex-row items-start justify-between pb-1">
            <div class="text-base">
              {{ $t('calendar.organization.location') }}
            </div>
          </div>
          <ProfileSettingDialogCompsLocation
            ref="addressLocation"
            :draggable="false"
            :value="{
              country: sites.country,
              state: sites.state,
              city: sites.city,
              streetAddress: sites.streetAddress,
              zipCode: sites.zipCode,
            }"
          />
        </div>
      </ProfileSettingDialogCompsBox>
    </div>
    <ProfileSettingDialogCompsConsole
      :reset-label="$t('personal.clear.all')"
      :save-label="$t('base.upload.save')"
      @reset="onOPenClearAllModal"
      @save="onSave"
    />
  </div>
  <BaseDialog
    v-model="isOpenClearAllConfirmModal"
    :title="$t('personal.clear.all')"
    title-class="!text-xl !text-[#EB4937]"
    class="!w-[90%] md:!w-[580px]"
    @close="onCloseClearAllModal"
  >
    <template #titleIcon>
      <i
        class="fa-sharp fa-light fa-broom-wide pr-1.5 text-xl !font-normal !text-[#EB4937]"
      />
    </template>

    <div class="grid grid-cols-1 gap-4 text-sm text-[#b0b0b0]">
      {{ $t('personal.clear.content') }}
    </div>
    <div class="mt-[1.125rem] flex justify-end">
      <BaseButton
        type="tertiary"
        label="$t:personal.profile.logged.cancel"
        @click="onCloseClearAllModal"
      />
      <BaseButton
        class="ml-3 !bg-[#EB4937]/15 !text-[#EB4937] hover:!bg-[#EB4937]/20"
        label="$t:personal.clear.all"
        :disabled="isClearLoading"
        :loading="isClearLoading"
        @click="handleReset"
      />
    </div>
  </BaseDialog>
</template>
<script setup>
import CountryFlag from 'vue-country-flag-next';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { getIndustriesSearch } from '~/api/v2/global';

const { t } = useI18n();

const profileStore = useProfileStore();
const searchStore = useSearchStore();
searchStore.searchCountries();

const myProfileInfo = ref({});
const phoneNumber = ref({});
const phonelength = ref(13);
const sites = ref({});
const addressLocation = ref(null);
const $toast = useToast();
const disableIndustryWatcher = ref(false);
const industryList = ref([]);
const industryName = ref('');
const isOpenClearAllConfirmModal = ref(false);
const isClearLoading = ref(false);
const handleIndustry = (value) => {
  industryName.value = value.name;
  myProfileInfo.value.industryId = value.id;
  disableIndustryWatcher.value = true;
  open.industry = false;
};
const searchIndustryFetch = async (params) => await getIndustriesSearch(params);

const employeesList = ref([
  {
    key: t('org.employee.members', { count: '1-10' }),
    label: t('org.employee.members', { count: '1-10' }),
  },
  {
    key: t('org.employee.members', { count: '10-50' }),
    label: t('org.employee.members', { count: '10-50' }),
  },
  {
    key: t('org.employee.members', { count: '50-200' }),
    label: t('org.employee.members', { count: '50-200' }),
  },
  {
    key: t('org.employee.members', { count: '200-500' }),
    label: t('org.employee.members', { count: '200-500' }),
  },
  {
    key: t('org.employee.members', { count: '500+' }),
    label: t('org.employee.members', { count: '500+' }),
  },
]);
const handleEmployees = (value) => {
  myProfileInfo.value.totalEmployees = value.key;
  open.employees = false;
};

watch(
  () => profileStore.myProfileDetail,
  (newVal) => {
    myProfileInfo.value.cover = newVal.cover;
    myProfileInfo.value.picture = newVal.picture;
    myProfileInfo.value.status = newVal.status;
    industryName.value = newVal.industry?.name || '';
    myProfileInfo.value.totalEmployees = newVal.numberOf?.employees || '';
  },
  { immediate: true, deep: true },
);
const init = () => {
  myProfileInfo.value = {
    ...profileStore.myProfileDetail,
  };
  industryName.value = myProfileInfo.value.industry?.name || '';
  myProfileInfo.value.totalEmployees =
    myProfileInfo.value.numberOf?.employees || '';
  phoneNumber.value = { ...profileStore.parseMyPhoneNumberStr() };
  sites.value = myProfileInfo.value.sites?.length
    ? { ...myProfileInfo.value.sites[0] }
    : {};
};
init();

const open = reactive({
  phoneNumber: false,
  birthDate: false,
  industry: false,
  employees: false,
});

const handleReset = async () => {
  if (isClearLoading.value) {
    return false;
  }
  isClearLoading.value = true;
  try {
    const params = {
      picture: null,
      cover: null,
      phoneNumber: null,
      bio: null,
      industryId: null,
      totalEmployees: null,
      sites: [],
      email: null,
    };
    await profileStore.updateProfile(params);
    init();
    $toast.success(t('personal.clear.success'));
  } finally {
    isClearLoading.value = false;
    isOpenClearAllConfirmModal.value = false;
  }
};

const onSave = async (callback) => {
  const addressLocationAddress = addressLocation.value.getLocationInfo();
  const params = {
    name: myProfileInfo.value.name,
    email: myProfileInfo.value.email,
    bio: myProfileInfo.value.bio || null,
    domain: myProfileInfo.value.domain || null,
    totalEmployees: myProfileInfo.value.totalEmployees || null,
    industryId: myProfileInfo.value.industryId || null,
    sites: [
      {
        timezone: sites.value.timezone,
        ...addressLocationAddress,
        isHeadquarter: true,
      },
    ],
    phoneNumber: getPhoneNumberStr(phoneNumber.value),
  };
  try {
    if (
      !validateURL(myProfileInfo.value.domain) &&
      myProfileInfo.value.domain
    ) {
      $toast.error(t('org.validWebsiteField'));
      return false;
    }
    if (!checkMail(myProfileInfo.value.email) && myProfileInfo.value.email) {
      $toast.error(t('org.validEmailField'));
      return false;
    }
    await profileStore.updateProfile(params);
    $toast.success(t('personal.profile.update'));
  } finally {
    callback();
  }
};
watch(
  () => industryName.value,
  (newVal, oldVal) => {
    if (disableIndustryWatcher.value) {
      disableIndustryWatcher.value = false;
      return;
    }
    if (newVal && newVal !== oldVal) {
      open.industry = true;
    }
  },
);

const onOPenClearAllModal = (callback) => {
  isOpenClearAllConfirmModal.value = true;
  callback();
};
const onCloseClearAllModal = () => {
  isOpenClearAllConfirmModal.value = false;
};
</script>
