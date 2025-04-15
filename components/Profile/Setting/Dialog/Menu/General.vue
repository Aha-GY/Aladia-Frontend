<template>
  <div class="relative">
    <ProfileSettingDialogCompsBox>
      <div class="text-sm text-[#B0B0B0]">
        {{ $t('personal.profile.setting.theme.choose') }}
      </div>
      <div class="grid-rows-auto mt-4 grid grid-cols-2 gap-2">
        <div class="rounded border-[1px] border-solid border-[#565656] p-2">
          <img class="w-full" src="~/assets/profile/theme-light.svg" alt="" />
        </div>
        <div
          class="rounded border-[1px] border-solid border-[#565656] p-2"
          :class="['border-[#E0B92C]']"
        >
          <img class="w-full" src="~/assets/profile/theme-dark.svg" alt="" />
        </div>
        <div class="flex h-4">
          <BaseCheckboxStyle
            :state="'unchecked'"
            data-cy="9b22db4819a73ab6"
            @click="onCheckClick(THEMES.LIGHT)"
          />
          <span class="ml-2 text-sm text-[#FAFAFA]">
            {{ $t('personal.profile.setting.theme.light') }}
          </span>
        </div>
        <div class="flex h-4">
          <BaseCheckboxStyle
            state="checked"
            data-cy="096d35ed06a6d533"
            @click="onCheckClick(THEMES.DARK)"
          />
          <span class="ml-2 text-sm text-[#FAFAFA]">
            {{ $t('personal.profile.setting.theme.dark') }}
          </span>
        </div>
      </div>
    </ProfileSettingDialogCompsBox>
    <ProfileSettingDialogCompsBox>
      <div class="overflow-auto" :style="{ height: `calc(100% - 19.5rem)` }">
        <div class="text-sm text-[#B0B0B0]">
          {{ $t('personal.language.select') }}
        </div>
        <BaseInput
          v-model="searchContext"
          class="mb-4"
          search
          :value="searchContext"
        />
        <div class="overflow-hidden rounded-md">
          <div
            v-for="lang in langList"
            :key="lang.key"
            class="flex cursor-pointer items-center justify-between border-b border-solid border-[#565656] px-3 py-1.5 hover:bg-white hover:bg-opacity-5"
            :class="lang.key === i18nCookie ? 'bg-white bg-opacity-5' : ''"
            data-cy="d8c64d54e12547e2"
            @click="profileStore.setLanguage(lang.key)"
          >
            <div class="flex items-center">
              <CountryFlag :country="lang.flagKey" size="big" />
              <span class="ml-2 text-[#FAFAFA]">{{ lang.name }}</span>
            </div>
            <BaseCheckboxStyle
              :state="lang.key === i18nCookie ? 'checked' : 'unchecked'"
            />
          </div>
        </div>
      </div>
    </ProfileSettingDialogCompsBox>

    <!-- todo 目前这个页面无法操作数据 -->
    <!-- <ProfileSettingDialogCompsConsole /> -->
  </div>
</template>
<script setup>
import CountryFlag from 'vue-country-flag-next';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { THEMES, LANGUAGES } from '~/constant/global';

const { t } = useI18n();

const colorMode = useColorMode();

const profileStore = useProfileStore();
const langOrinalList = Object.values(LANGUAGES);
const $toast = useToast();
const searchContext = ref('');
const langList = ref(langOrinalList);
const i18nCookie = useCookie('i18n_redirected');

watch(searchContext, (value) => {
  if (value) {
    langList.value = langOrinalList.filter(({ _key, name }) =>
      name.toLowerCase().includes(searchContext.value.toLowerCase()),
    );
  } else {
    langList.value = langOrinalList;
  }
});

function onCheckClick(theme) {
  colorMode.preference = theme;
  if (theme === THEMES.LIGHT) {
    $toast.info(t('personal.coming.soon'));
  }
}
</script>
