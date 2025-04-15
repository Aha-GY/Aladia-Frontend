<template>
  <div class="flex h-full flex-col">
    <div id="about" ref="aboutRef" class="flex-1">
      <div class="profile-about absolute bottom-0 top-[5rem] w-[37rem] flex-1">
        <LazyBaseEditor
          v-model="about"
          name="description-editor"
          type="textarea"
          :options="{
            placeholder: $t('personal.write.placeholder'),
          }"
          :area-height="areaHeight"
          limit-character
          :characters-limit="2000"
          :auto-focus="false"
          data-cy="about-description"
        />
      </div>
    </div>
    <ProfileSettingDialogCompsConsole
      :shadow="false"
      :reset-label="$t('personal.clear.all')"
      :save-label="$t('base.upload.save')"
      @reset="onOPenClearAllModal"
      @save="handleClickSave"
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
        @click="handlerReset"
      />
    </div>
  </BaseDialog>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

defineProps({
  isLeftDrawer: {
    type: Boolean,
    default: false,
  },
});
const { t } = useI18n();
const $toast = useToast();
const profileStore = useProfileStore();
const authStore = useAuthStore();
const about = ref('');
const aboutRef = ref(null);
const areaHeight = ref('30rem');
const isOpenClearAllConfirmModal = ref(false);
const isClearLoading = ref(false);
watch(
  () => profileStore.myProfileDetail,
  () => {
    about.value =
      (authStore.isOrg
        ? profileStore.myProfileDetail.description
        : profileStore.myProfileDetail.about) || '';
  },
  { immediate: true, deep: true },
);

async function handlerReset() {
  if (!about.value) {
    profileStore.resetProfile();
    isOpenClearAllConfirmModal.value = false;
    return false;
  }

  if (isClearLoading.value) {
    return false;
  }
  const params = {
    [authStore.isOrg ? 'description' : 'about']: null,
  };
  try {
    isClearLoading.value = true;
    await profileStore.updateProfile(params);
    $toast.success(t('personal.clear.success'));
  } finally {
    isClearLoading.value = false;
    isOpenClearAllConfirmModal.value = false;
    profileStore.resetProfile();
  }
}

async function handleClickSave(callback) {
  const params = {
    [authStore.isOrg ? 'description' : 'about']: about.value,
  };
  try {
    await profileStore.updateProfile(params);
    $toast.success(t('personal.profile.update'));
  } finally {
    callback();
  }
}
onMounted(() => {
  nextTick(() => {
    const aboutRefHeight = aboutRef.value?.clientHeight;
    areaHeight.value = aboutRefHeight
      ? `${(aboutRefHeight - 40) / 16}rem`
      : '30rem';
  });
});

const onOPenClearAllModal = (callback) => {
  isOpenClearAllConfirmModal.value = true;
  callback();
};
const onCloseClearAllModal = () => {
  isOpenClearAllConfirmModal.value = false;
};
</script>
<style lang="scss">
#about {
  .ql-editor {
    padding: 0;
    word-break: break-all;
  }
  .ql-container.ql-snow {
    border: none;
  }
}
.el-drawer__body {
  #about {
    .profile-about {
      width: 28rem;
      top: 3.125rem;
      right: 1rem;
    }
  }
}
</style>
