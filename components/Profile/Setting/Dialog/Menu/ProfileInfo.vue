<template>
  <div class="relative">
    <ProfileSettingDialogCompsBox>
      <div class="relative mb-20 h-[6rem] w-[100%]">
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
        <div class="group absolute left-[2.25rem] top-[5rem] z-[100]">
          <div
            class="relative h-full w-full overflow-hidden rounded-full bg-[#0b0b0b]"
          >
            <BaseAvatarNext
              size="lg"
              :show-online="false"
              :picture="myProfileInfo.picture"
              :show-work="!!myProfileInfo.status"
              :work="myProfileInfo.status"
            />
            <i
              class="fa-regular fa-camera absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 transition-all duration-200 group-hover:scale-150 group-hover:text-white"
            />
          </div>
        </div>
      </ProfileSettingDialogCompsEditAvatar>
      <div class="grid grid-cols-1 gap-4">
        <BaseInput
          v-model="myProfileInfo.firstName"
          :max-length="50"
          :title="$t('personal.profile.name')"
          data-cy="profile-edit-first-name"
          open
        />
        <BaseInput
          v-model="myProfileInfo.lastName"
          :max-length="70"
          :title="$t('personal.profile.lName')"
          data-cy="profile-edit-last-name"
          open
        />
      </div>
    </ProfileSettingDialogCompsBox>
    <ProfileSettingDialogCompsBox single-col class="relative">
      <div class="flex flex-row items-end">
        <BaseInput
          v-model="myProfileInfo.email"
          :title="$t('personal.profile.mail')"
          data-cy="profile-edit-mail"
          inactive
          open
        />
        <BaseSwitcher
          class="ml-2"
          :icon="
            contactsVisibility.email
              ? 'fa-regular fa-eye !text-[#101010]'
              : 'fa-regular fa-eye-slash'
          "
          :active="contactsVisibility.email"
          data-cy="profile-edit-mail"
          open
          @change="(d) => (contactsVisibility.email = d)"
        />
      </div>
      <div class="flex flex-row items-end">
        <BaseInput
          v-model="phoneNumber.value"
          :title="$t('personal.profile.phoneN')"
          open
          number
          :max-length="phonelength"
          data-cy="profile-edit-phone-number"
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
        <BaseSwitcher
          class="ml-2"
          data-cy="profile-edit-phone-number"
          :icon="
            contactsVisibility.phoneNumber
              ? 'fa-regular fa-eye !text-[#101010]'
              : 'fa-regular fa-eye-slash'
          "
          :active="contactsVisibility.phoneNumber"
          @change="(d) => (contactsVisibility.phoneNumber = d)"
        />
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
      <div class="flex w-full flex-col">
        <div>{{ t('event.schedule.timezone') }}</div>
        <BaseSelectElselect
          v-model="myProfileInfo.timezone"
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
            {{ $t('personal.profile.location.current') }}
          </div>
          <BaseSwitcher
            class="ml-2 mt-1"
            data-cy="profile-edit-location"
            :icon="
              contactsVisibility.address
                ? 'fa-regular fa-eye !text-[#101010]'
                : 'fa-regular fa-eye-slash'
            "
            :active="contactsVisibility.address"
            @change="(d) => (contactsVisibility.address = d)"
          />
        </div>
        <ProfileSettingDialogCompsLocation
          ref="addressLocation"
          :draggable="false"
          :value="address"
          :data-cy="`profile-edit-current-location`"
        />
      </div>
    </ProfileSettingDialogCompsBox>
    <ProfileSettingDialogCompsBox>
      <div class="-mt-1">
        <div class="text-base">
          {{ $t('personal.profile.location.birth') }}
        </div>
        <ProfileSettingDialogCompsLocation
          ref="birthLocation"
          :value="birthAddress"
          hidden-zip-code
          hidden-street-address
          :draggable="false"
          :data-cy="`profile-edit-birth-location`"
        >
          <div class="mt-5 flex flex-row items-end">
            <el-popover
              v-model:visible="open.birthDate"
              trigger="click"
              width="360"
            >
              <template #reference>
                <div class="flex w-full items-center">
                  <i
                    class="fa-regular fa-balloon mr-3 text-base text-white/20"
                  />
                  <BaseInput
                    v-model="myProfileInfo.birthDate"
                    fixed
                    :title="$t('personal.dob')"
                    data-cy="profile-edit-birth-date"
                  />
                </div>
              </template>
              <BaseDatePicker
                data-cy="profile-edit-birth-date"
                :disabled-dates="disabledDates"
                @change="
                  (d) => {
                    myProfileInfo.birthDate = formatDate(d, 'YYYY-MM-DD');
                    open.birthDate = false;
                  }
                "
              />
            </el-popover>
            <BaseSwitcher
              class="ml-2"
              data-cy="profile-edit-birth-date"
              :icon="
                contactsVisibility.birthDate
                  ? 'fa-regular fa-eye !text-[#101010]'
                  : 'fa-regular fa-eye-slash'
              "
              :active="contactsVisibility.birthDate"
              @change="(d) => (contactsVisibility.birthDate = d)"
            />
          </div>
        </ProfileSettingDialogCompsLocation>
      </div>
    </ProfileSettingDialogCompsBox>
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
import dayJS from 'dayjs';
import CountryFlag from 'vue-country-flag-next';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

const { t } = useI18n();

const $toast = useToast();

const dayjs = dayJS.tz;

const profileStore = useProfileStore();
const searchStore = useSearchStore();
searchStore.searchCountries();

const myProfileInfo = ref({});
const phoneNumber = ref({});
const phonelength = ref(13);
const contactsVisibility = ref({});
const address = ref({});
const addressLocation = ref(null);
const birthAddress = ref({});
const birthLocation = ref(null);
const isOpenClearAllConfirmModal = ref(false);
const isClearLoading = ref(false);
const disabledDates = ref([{ start: dayjs().subtract(1, 'day') }]);

watch(
  () => profileStore.myProfileDetail,
  (newVal) => {
    myProfileInfo.value.cover = newVal.cover;
    myProfileInfo.value.picture = newVal.picture;
    myProfileInfo.value.status = newVal.status;
  },
  { immediate: true, deep: true },
);

const init = () => {
  const birth_date = profileStore.myProfileDetail?.birthDate;
  myProfileInfo.value = {
    ...profileStore.myProfileDetail,
    birthDate: birth_date ? formatDate(birth_date, 'YYYY-MM-DD') : null,
  };
  contactsVisibility.value = { ...myProfileInfo.value.contactsVisibility };
  phoneNumber.value = { ...profileStore.parseMyPhoneNumberStr() };
  address.value = { ...myProfileInfo.value.address };
  birthAddress.value = { ...myProfileInfo.value.birthAddress };
};
init();

const open = reactive({
  phoneNumber: false,
  birthDate: false,
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
      timezone: null,
      birthDate: null,
      address: null,
      birthAddress: null,
      contactsVisibility: {
        address: true,
        birthDate: true,
        email: true,
        phoneNumber: true,
      },
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
  const birthLocationAddress = birthLocation.value.getLocationInfo();
  const addressLocationAddress = addressLocation.value.getLocationInfo();
  const params = {
    firstName: myProfileInfo.value.firstName,
    lastName: myProfileInfo.value.lastName,
    bio: myProfileInfo.value.bio || null,
    timezone: myProfileInfo.value.timezone,
    birthDate: myProfileInfo.value.birthDate || null,
    address: {
      ...addressLocationAddress,
    },
    birthAddress: {
      city: birthLocationAddress.city,
      state: birthLocationAddress.state,
      country: birthLocationAddress.country,
    },
    phoneNumber: getPhoneNumberStr(phoneNumber.value),
    contactsVisibility: { ...contactsVisibility.value },
  };
  try {
    await profileStore.updateProfile(params);
    $toast.success(t('personal.profile.update'));
  } finally {
    callback();
  }
};

const onOPenClearAllModal = (callback) => {
  isOpenClearAllConfirmModal.value = true;
  callback();
};
const onCloseClearAllModal = () => {
  isOpenClearAllConfirmModal.value = false;
};
</script>
