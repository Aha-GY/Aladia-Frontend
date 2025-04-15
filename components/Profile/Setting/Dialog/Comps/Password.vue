<template>
  <ProfileSettingDialogCompsBox :title="$t('personal.profile.password.label')">
    <div class="flex flex-row">
      <div
        class="mr-1.5 flex h-auto w-full items-center border-b border-[#fff]/5"
      >
        <i class="fa-regular fa-lock" />
        <span
          v-if="!authStore?.emailInfo?.password"
          class="ml-3 cursor-default !text-white/50"
        >
          {{ $t('personal.profile.password.empty') }}
        </span>
        <span v-else class="ml-3 cursor-default text-3xl font-black">
          ········
        </span>
      </div>
      <ProfileSettingDialogCompsEditPasswordConfirm>
        <BaseButton
          type="tertiary"
          :icon="`fa-solid ${authStore?.emailInfo?.password ? 'fa-pen-to-square' : 'fa-plus'} `"
        >
          {{
            authStore?.emailInfo?.password
              ? $t('personal.profile.password.change')
              : $t('personal.profile.password.create')
          }}
        </BaseButton>
      </ProfileSettingDialogCompsEditPasswordConfirm>
    </div>
    <div class="mt-2 flex items-center">
      <div class="mr-1.5 text-sm font-medium text-[#CFA200]">
        {{ $t('personal.profile.password.forgotPassword') }}
      </div>
      <div
        class="cursor-pointer text-xs text-[#F0CA41] hover:text-[#CFA200] hover:underline"
        @click="handleForgotPassword"
      >
        {{ $t('personal.profile.password.SendLink') }}
        <i v-if="loading" class="fa-light fa-spinner animate-spin" />
      </div>
    </div>
  </ProfileSettingDialogCompsBox>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

const $toast = useToast();
const { t } = useI18n();
const profileStore = useProfileStore();
const authStore = useAuthStore();
const loading = ref(false);

authStore.checkEmail({ email: profileStore.myProfileDetail.email });

const handleForgotPassword = async () => {
  try {
    if (loading.value) {
      return;
    }
    loading.value = true;
    await authStore.forgot({ email: profileStore.myProfileDetail.email });
    $toast.success(t('auth.signup.otp.sent'));
  } finally {
    loading.value = false;
  }
};
</script>
