<template>
  <BaseDialog
    v-model="open"
    :close-on-click-modal="false"
    :title="`${authStore?.emailInfo?.password ? $t('personal.account.password.change') : $t('personal.account.password.create')}`"
    class="!w-[90%] md:!w-[32.5rem]"
  >
    <ProfileSettingDialogCompsPasswordWithSwitch
      v-if="authStore?.emailInfo?.password"
      v-model="password.current"
      class="mt-3"
      data-cy="password-change-profile-current"
      :title="$t('personal.account.password.current')"
    />
    <div>
      <ProfileSettingDialogCompsPasswordWithSwitch
        v-model="password.value"
        class="my-1.5 mt-3"
        data-cy="password-change-profile-new"
        :title="$t('personal.account.password.new')"
      />
      <AuthPassword
        v-show="password.value"
        ref="authPasswordRef"
        :password="password.value"
        :current-password="password.current"
      />
    </div>
    <div>
      <ProfileSettingDialogCompsPasswordWithSwitch
        v-model="password.confirmValue"
        class="mt-3"
        data-cy="password-change-profile-confirm"
        :title="$t('personal.account.password.confirm')"
      />
      <div v-if="passwordDoNotMatch" class="text-xs text-[#E54E4E]">
        {{ $t('personal.account.password.error') }}
      </div>
    </div>
    <div class="mt-4 flex w-full justify-between">
      <div class="flex items-center">
        <div class="mr-1.5 text-sm font-medium text-[#CFA200]">
          {{ $t('personal.profile.password.forgotPassword') }}
        </div>
        <div
          class="cursor-pointer text-xs text-[#F0CA41] hover:text-[#CFA200] hover:underline"
          @click="handleForgotPassword"
        >
          {{ $t('personal.profile.password.SendLink') }}
          <i
            v-if="authStore.loading"
            class="fa-light fa-spinner animate-spin"
          />
        </div>
      </div>
      <div class="flex justify-end">
        <BaseButton
          type="tertiary"
          label="$t:base.upload.cancel"
          :disabled="password.loading"
          data-cy="password-change-profile-cancel-button"
          @click="open = false"
        />
        <BaseButton
          class="ml-2"
          label="$t:base.upload.save"
          :disabled="password.disabledButton"
          :loading="password.loading"
          data-cy="password-change-profile-save-button"
          @click="onChangePassword"
        />
      </div>
    </div>
  </BaseDialog>
  <div data-cy="password-change-profile-button" @click="open = true">
    <slot />
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { changePassword } from '@/api/v2/auth.js';

const $toast = useToast();
const { t } = useI18n();

const profileStore = useProfileStore();
const authStore = useAuthStore();
const authPasswordRef = ref(null);
const passwordDoNotMatch = computed(
  () =>
    (password.value.trim() || password.confirmValue.trim()) &&
    password.value.trim() !== password.confirmValue.trim(),
);

const open = ref(false);
const password = reactive({
  loading: false,
  disabledButton: true,
  current: '',
  value: '',
  confirmValue: '',
});
watchEffect(() => {
  password.disabledButton =
    passwordDoNotMatch.value ||
    authPasswordRef.value?.haveError ||
    (authStore?.emailInfo.password && !password.current);
});

watchEffect(() => {
  if (!open.value) {
    password.loading = false;
    password.disabledButton = true;
    password.current = '';
    password.value = '';
    password.confirmValue = '';
  }
});

const onChangePassword = async () => {
  if (password.loading || password.disabledButton) {
    return false;
  }
  password.loading = true;
  try {
    await changePassword({
      currentPassword: password.current || undefined,
      newPassword1: password.value,
      newPassword2: password.confirmValue,
    });
    open.value = false;
    authStore.emailInfo.password = true;
    $toast.success(t('personal.account.password.success'));
  } finally {
    password.loading = false;
  }
};

const handleForgotPassword = async () => {
  await authStore.forgot({ email: profileStore.myProfileDetail.email });
  $toast.success(t('auth.signup.otp.sent'));
};
</script>
