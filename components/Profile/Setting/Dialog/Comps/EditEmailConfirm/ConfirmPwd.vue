<template>
  <div>
    <div
      class="grid grid-cols-1 gap-4 text-sm text-[#b0b0b0] md:p-[1.9375rem_1.8125rem_1.9375rem_1.8125rem]"
    >
      <div>
        {{ t('personal.profile.change.email.enterPwd') }}
      </div>
      <div class="mt-1.5 flex flex-col">
        <div class="flex flex-row items-end">
          <ProfileSettingDialogCompsPasswordWithSwitch
            v-model="password"
            data-cy="password-change-confirm"
            :placeholder="t('personal.profile.change.email.enterPwdNext')"
          />
        </div>
      </div>
    </div>
    <div class="mt-[1.125rem] flex justify-end">
      <BaseButton
        type="tertiary"
        label="$t:base.upload.cancel"
        data-cy="6af06a50f9fe96c8"
        @click="OnCancel()"
      />
      <BaseButton
        class="ml-2"
        :disabled="!password"
        :loading="loading"
        :label="t('personal.profile.change.email.next')"
        data-cy="14404322f3b7de7a"
        @click="onConfirm()"
      />
    </div>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';

import { confirmPassword } from '@/api/v2/auth.js';

const emit = defineEmits(['close', 'confirm']);
const { t } = useI18n();

const password = ref('');
const loading = ref(false);

const reset = () => {
  password.value = '';
};
const OnCancel = () => {
  emit('close');
};
const onConfirm = async () => {
  try {
    if (!password.value || loading.value) {
      return false;
    }
    loading.value = true;
    await confirmPassword({
      password: password.value,
    });
    emit('confirm');
  } finally {
    loading.value = false;
  }
};
defineExpose({
  reset,
});
</script>
