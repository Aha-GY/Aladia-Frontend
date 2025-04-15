<template>
  <ProfileSettingDialogCompsBox>
    <div class="social-links-wrap">
      <div v-loading="dataLoading">
        <div v-if="dataLoading" class="h-[9rem]" />
        <div
          v-for="(item, index) in socialLinksList"
          :key="index"
          class="group flex cursor-pointer items-center border-b border-[#fff]/10 py-3 transition-all duration-300 hover:border-[#fff]/25"
          data-cy="38e505b2b951a6b5"
        >
          <div
            class="flex flex-1 items-center justify-between overflow-hidden pr-4"
          >
            <div class="flex items-center">
              <div class="ml-1 mr-4" v-html="renderIcon(item.platform)" />
              <div>{{ item.displayText }}</div>
            </div>
            <div
              class="hidden flex-[0.97] text-end text-[#505050] group-hover:line-clamp-1"
            >
              {{ item.url }}
            </div>
          </div>

          <el-popover
            trigger="click"
            width="fit-content"
            popper-class="!min-w-[0rem]"
          >
            <template #reference>
              <div
                class="flex h-6 w-6 items-center justify-center hover:bg-[#292929]"
                data-cy="c4869f56b704ee03"
                @click.stop
              >
                <i class="fa-regular fa-ellipsis-vertical rotate-90" />
              </div>
            </template>

            <div
              class="w-24 cursor-pointer p-2 transition-all hover:bg-white/10"
              data-cy="68ba85494be378f4"
              @click="openEditor(item, index)"
            >
              <i class="fa-solid fa-pen-to-square min-w-4 text-center" />
              <span class="ml-1.5">{{ $t('base.editor.edit') }}</span>
            </div>

            <div
              class="w-24 cursor-pointer p-2 text-[#DB4446] transition-all hover:bg-white/10"
              data-cy="2745755633b7ff63"
              @click="onOpenDeleteModal"
            >
              <i class="fa-solid fa-trash min-w-4 text-center" />
              <span class="ml-1.5">{{ $t('base.editor.delete') }}</span>
            </div>
          </el-popover>
        </div>
        <BaseNoData
          v-if="!socialLinksList.length && !dataLoading"
          class="mt-6"
        />
      </div>
      <div class="absolute bottom-4 right-5">
        <BaseButton data-cy="social-link-open-button" @click="onOpen">
          <i class="fa-solid fa-plus" />
        </BaseButton>
      </div>
    </div>
  </ProfileSettingDialogCompsBox>
  <BaseDialog
    v-model="open"
    :destroy-on-close="true"
    :title="`${editIndex >= 0 ? $t('personal.profile.link.edit') : $t('personal.profile.link.add')}`"
    class="!w-[90%] md:!w-[580px]"
  >
    <template #titleIcon>
      <i
        class="fa-solid fa-pen-to-square pr-1.5 !text-xl !font-normal !text-[#b0b0b0]"
      />
    </template>
    <template v-if="!isEdit">
      <div class="pb-1">
        {{ $t('personal.profile.link.social') }}
      </div>
      <BaseInput
        v-model="searchValue"
        fixed
        search
        clear
        class="my-3"
        data-cy="search-social-link"
        :placeholder="$t('personal.platform.search')"
      />
      <div class="max-h-[25rem] overflow-y-auto">
        <div
          v-for="(item, index) in PlatformList"
          :key="index"
          class="group flex cursor-pointer items-center py-3"
          :data-cy="`platform-${item.platform.toLowerCase().split(' ').join('-')}-social-link-item`"
          @click="openEditor(item)"
        >
          <div class="mr-4" v-html="renderIcon(item.platform)" />
          <div class="group-hover:opacity-80">{{ item.platform }}</div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="relative">
        <p
          v-if="!isUserName(currentPlatform.platform) && displayText"
          class="absolute bottom-0 right-1 text-sm"
          :class="
            String(displayText).length >= 20
              ? 'text-[#EB4937]'
              : 'text-[#b0b0b0]'
          "
        >
          {{ String(displayText).length }}/20
        </p>
        <BaseInput
          v-model.trim="displayText"
          :max-length="!isUserName(currentPlatform.platform) && 20"
          :show-validate-error="
            isUserName(displayText && currentPlatform.platform) && isShowError
          "
          :title="
            isUserName(currentPlatform.platform)
              ? `${currentPlatform.platform} ${$t('personal.username')}`
              : $t('personal.text.display')
          "
          class="mb-3"
          required
          :data-cy="`${isUserName(currentPlatform.platform) ? 'username' : 'display'}-social-link`"
          :placeholder="
            isUserName(currentPlatform.platform)
              ? `@username`
              : $t('personal.text.display')
          "
        />
      </div>
      <p
        v-if="
          displayText && isUserName(currentPlatform.platform) && isShowError
        "
        class="-mt-1 mb-0.5 text-sm font-normal !text-[#EB4937]"
      >
        {{ errorMessage }}
      </p>
      <BaseInput
        v-if="!isUserName(currentPlatform.platform)"
        v-model.trim="linkUrl"
        :title="`${currentPlatform.platform} URL`"
        class="mt-3"
        required
        data-cy="url-social-link"
        :placeholder="`${currentPlatform.url || $t('personal.profile.link.show')}`"
      />
      <div class="flex items-center pt-4">
        <div class="mr-3 text-white/65">
          {{ $t('personal.profile.link.display') }}
        </div>
        <BaseSwitcher :active="showSwitch" @change="handleChangeShow" />
      </div>
    </template>
    <div class="mt-4 flex w-full justify-end">
      <BaseButton
        type="tertiary"
        label="$t:base.upload.cancel"
        :disabled="loading"
        data-cy="24910211bb9b09c2"
        @click="onCancel"
      />

      <BaseButton
        class="ml-2"
        label="$t:base.upload.save"
        :disabled="disabledButton"
        :loading="loading"
        data-cy="save-social-link-button"
        @click="onSave"
      />
    </div>
  </BaseDialog>
  <BaseDialog
    v-model="openDeleteConfirmModal"
    :title="$t('personal.profile.link.delete.label')"
    title-class="!text-xl !text-[#EB4937]"
    class="!w-[90%] md:!w-[580px]"
    @close="onCancelDeleteModal"
  >
    <template #titleIcon>
      <i
        class="fa-regular fa-trash pr-1.5 text-base !font-normal !text-[#EB4937]"
      />
    </template>

    <div class="grid grid-cols-1 gap-4 text-sm text-[#b0b0b0]">
      {{ $t('personal.profile.link.delete.content') }}
    </div>
    <div class="mt-[1.125rem] flex justify-end">
      <BaseButton
        type="tertiary"
        label="$t:personal.profile.logged.cancel"
        @click="onCancelDeleteModal"
      />
      <BaseButton
        class="ml-3 !bg-[#EB4937]/15 !text-[#EB4937] hover:!bg-[#EB4937]/20"
        label="$t:base.editor.delete"
        icon="fa-solid fa-trash-can"
        :disabled="delLoading"
        :loading="delLoading"
        @click="onDelete"
      />
    </div>
  </BaseDialog>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { getOrgSocialLinks } from '~/api/v2/org';
import { getSocialLinks } from '~/api/v2/profile';
import { renderIcon } from '~/utils/renderIcon';

const authStore = useAuthStore();
const profileStore = useProfileStore();
const $toast = useToast();
const dataLoading = ref(true);
const open = ref(false);
const isEdit = ref(false);
const editIndex = ref(-1);
const delLoading = ref(false);
const loading = ref(false);
const maxShowNum = ref(10);
const socialLinksList = ref([]);
const searchValue = ref('');
const displayText = ref('');
const linkUrl = ref('');
const showSwitch = ref(false);
const currentPlatform = ref({});
const isShowError = ref(false);
const errorMessage = ref('');
const { t } = useI18n();

// Delete Social Link Modal
const openDeleteConfirmModal = ref(false);

const onOpenDeleteModal = () => {
  openDeleteConfirmModal.value = true;
};

const onCancelDeleteModal = () => {
  openDeleteConfirmModal.value = false;
};

function validateUsername(username) {
  if (!username.startsWith('@')) {
    isShowError.value = true;
    errorMessage.value = 'Invalid username. It must start with "@"';
    return false;
  }

  isShowError.value = false;
  errorMessage.value = '';
  return true;
}

// Watch for real-time validation
watch(displayText, (newValue) => {
  validateUsername(newValue);
});

watch(displayText, (newValue) => {
  if (newValue.length > 20 && !isUserName(currentPlatform.value.platform)) {
    displayText.value = newValue.slice(0, 20);
  }
});

const getSocialLinksList = async () => {
  if (profileStore.myProfileDetail.id) {
    try {
      const { data } = authStore.isOrg
        ? await getOrgSocialLinks(profileStore.myProfileDetail.id)
        : await getSocialLinks(profileStore.myProfileDetail.id);
      socialLinksList.value = data;
    } finally {
      dataLoading.value = false;
    }
  } else {
    dataLoading.value = false;
  }
};
getSocialLinksList();

const isUserName = (platform) =>
  ['Instagram', 'X', 'TikTok', 'Fiverr', 'Dribbble'].includes(platform);

const PlatformList = computed(() => {
  const list = [
    {
      platform: 'Custom',
      url: '',
      show: false,
    },
    {
      platform: 'X',
      url: 'https://x.com',
      show: false,
    },
    {
      platform: 'Instagram',
      url: 'https://instagram.com',
      show: false,
    },
    {
      platform: 'TikTok',
      url: 'https://tiktok.com',
      show: false,
    },
    {
      platform: 'Facebook',
      url: 'https://facebook.com',
      show: false,
    },
    {
      platform: 'Linkedin',
      url: 'https://linkedin.com',
      show: false,
    },
    {
      platform: 'Youtube',
      url: 'https://youtube.com',
      show: false,
    },
    {
      platform: 'Behance',
      url: 'https://www.behance.net',
      show: false,
    },
    {
      platform: 'Dribbble',
      url: 'https://dribbble.com',
      show: false,
    },
    {
      platform: 'Upwork',
      url: 'https://www.upwork.com',
      show: false,
    },
    {
      platform: 'Fiverr',
      url: 'https://www.fiverr.com',
      show: false,
    },
  ];
  return list.filter((item) =>
    item.platform.toLowerCase().includes(searchValue.value.toLowerCase()),
  );
});

const disabledButton = computed(() => {
  if (isUserName(currentPlatform.value.platform)) {
    return isShowError.value || !displayText.value;
  } else {
    return !displayText.value || !linkUrl.value;
  }
});
const init = () => {
  isEdit.value = false;
  editIndex.value = -1;
  loading.value = false;
  searchValue.value = '';
  displayText.value = '';
  linkUrl.value = '';
  showSwitch.value = false;
  currentPlatform.value = {};
};

const onOpen = () => {
  init();
  open.value = true;
};
const onCancel = () => {
  if (!isEdit.value || editIndex.value >= 0) {
    open.value = false;
  } else {
    init();
  }
};

const openEditor = (item, index) => {
  currentPlatform.value = item;
  isEdit.value = true;
  if (index >= 0) {
    editIndex.value = index;
    displayText.value = item.displayText;
    linkUrl.value = item.url;
    showSwitch.value = item.show;
    open.value = true;
  }
};

const handleChangeShow = () => {
  const sum = socialLinksList.value
    .filter((_, index) => index !== editIndex.value)
    .reduce((sum, p) => {
      const c = p.show ? 1 : 0;
      return c + sum;
    }, 0);
  if (sum >= maxShowNum.value && !showSwitch.value) {
    $toast.error(
      t('personal.profile.link.error.limit', {
        limit: maxShowNum.value,
      }),
    );
  } else {
    showSwitch.value = !showSwitch.value;
  }
};

const validateAtSymbol = (value) => {
  const regex = /^@?[^@]*$/;
  return regex.test(value);
};

const onSave = async () => {
  if (loading.value || disabledButton.value) {
    return false;
  }
  if (isUserName(currentPlatform.value.platform)) {
    if (!validateAtSymbol(displayText.value)) {
      $toast.error(t('personal.profile.link.error.username'));
      return false;
    }
  } else {
    if (!validateURL(linkUrl.value)) {
      $toast.error(t('personal.profile.link.error.url'));
      return false;
    }
  }
  loading.value = true;
  try {
    const platform = currentPlatform.value.platform;
    const username = displayText.value
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace('@', '');
    const params = {
      platform,
      displayText: displayText.value,
      show: showSwitch.value,
      url: isUserName(platform)
        ? `${PlatformList.value.find((e) => e.platform === platform).url}/${platform === 'TikTok' ? '@' : ''}${username}`
        : linkUrl.value,
    };
    if (editIndex.value >= 0) {
      const list = [...socialLinksList.value];
      list[editIndex.value] = params;
      await profileStore.updateProfile({ socialLinks: list });
    } else {
      await profileStore.updateProfile({
        socialLinks: [...socialLinksList.value, params],
      });
    }
    await getSocialLinksList();
  } finally {
    loading.value = false;
    open.value = false;
  }
};

const onDelete = async () => {
  if (delLoading.value) {
    return false;
  }
  delLoading.value = true;
  try {
    const list = [...socialLinksList.value];
    list.splice(editIndex.value, 1);
    await profileStore.updateProfile({ socialLinks: list });
    await getSocialLinksList();
  } finally {
    delLoading.value = false;
    open.value = false;
    onCancelDeleteModal();
  }
};
</script>
