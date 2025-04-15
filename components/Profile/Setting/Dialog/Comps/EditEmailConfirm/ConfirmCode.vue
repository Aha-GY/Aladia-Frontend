<template>
  <div>
    <div
      class="grid grid-cols-1 gap-4 text-sm text-[#b0b0b0] md:p-[1.9375rem_1.8125rem_1.9375rem_1.8125rem]"
    >
      <div>
        {{ content }}
      </div>
      <div class="mt-1.5 flex flex-col">
        <div class="flex flex-row items-end">
          <BaseInput v-model="email" :title="`Email`" class="h-auto" />
          <BaseButton
            class="ml-3"
            :disabled="!checkMail(email)"
            :loading="sendStatus.loading"
            data-cy="30fff6af52e0cdef"
            @click="sendEmail"
          >
            <span
              class="text-nowrap"
              :class="{ 'cursor-not-allowed': sendStatus.loading }"
            >
              {{
                sendStatus.haveClicked
                  ? $t('personal.account.code.resend')
                  : $t('personal.account.code.send')
              }}
            </span>
          </BaseButton>
        </div>
      </div>
      <BaseCode
        v-if="confirmStatus.codesShow"
        v-model="codes"
        :disabled="confirmStatus.codesDisabled"
        class="mb-3 mt-8 px-[2.625rem]"
        :class="{
          '*:cursor-not-allowed': confirmStatus.loading,
        }"
      />
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
        :disabled="confirmStatus.disabled"
        :loading="confirmStatus.loading"
        :label="confirmButtonText"
        data-cy="14404322f3b7de7a"
        @click="onConfirm()"
      />
    </div>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import {
  changeEmail,
  confirmEmail,
  verifySecondaryEmail,
  secondaryEmail,
  // resendCode,
} from '@/api/v2/auth.js';

const props = defineProps({
  isSecondary: { type: Boolean, default: false },
  isAddSecondary: { type: Boolean, default: false },
});
const emit = defineEmits(['close', 'confirm']);
const { t } = useI18n();
const $toast = useToast();
const { logout } = useAuthStore();

const content = computed(() => {
  if (confirmStatus.codesShow) {
    return t('personal.profile.change.email.verification');
  }
  return props.isSecondary
    ? t('personal.profile.change.email.secondary.content', {
        type: props.isAddSecondary
          ? t('personal.profile.change.email.secondary.add')
          : t('personal.profile.change.email.secondary.edit'),
      })
    : t('personal.profile.change.email.content');
});

const confirmButtonText = computed(() => {
  if (confirmStatus.codesShow) {
    return t('personal.profile.change.email.confirm');
  }
  if (props.isSecondary) {
    return t('personal.profile.change.email.secondary.confrimButtonText', {
      type: props.isAddSecondary
        ? t('personal.profile.change.email.secondary.add')
        : t('personal.profile.change.email.secondary.edit'),
    });
  }
  return t('personal.account.email.change');
});

const email = ref('');
const codes = ref(['', '', '', '', '', '']);
const sendStatus = reactive({
  loading: false,
  haveClicked: false,
});
const confirmStatus = reactive({
  loading: false,
  disabled: true,
  codesDisabled: true,
  codesShow: false,
});

const sendEmail = async () => {
  if (!checkMail(email.value) || sendStatus.loading) {
    return false;
  }
  sendStatus.loading = true;
  sendStatus.haveClicked = true;
  try {
    const fetch = props.isSecondary ? secondaryEmail : changeEmail;
    await fetch({ email: email.value });
    confirmStatus.codesDisabled = false;
    confirmStatus.codesShow = true;
  } finally {
    sendStatus.loading = false;
  }
};

const confirmPrimaryEmail = async () => {
  if (confirmStatus.disabled || confirmStatus.loading) {
    return false;
  }
  confirmStatus.loading = true;
  try {
    await confirmEmail({ code: +codes.value.join('') });
    logout({ noLogoutApi: true });
  } finally {
    confirmStatus.loading = false;
  }
};

const confirmSecondaryEmail = async () => {
  if (confirmStatus.disabled || confirmStatus.loading) {
    return false;
  }
  confirmStatus.loading = true;
  try {
    const { verified } = await verifySecondaryEmail({
      code: +codes.value.join(''),
    });
    if (verified) {
      $toast.success(
        t('personal.profile.change.email.secondary.success', {
          type: props.isAddSecondary
            ? t('personal.profile.change.email.secondary.add')
            : t('personal.profile.change.email.secondary.edit'),
        }),
      );
      OnCancel();
      emit('confirm');
    }
  } finally {
    confirmStatus.loading = false;
  }
};

const reset = () => {
  sendStatus.loading = false;
  sendStatus.haveClicked = false;
  confirmStatus.loading = false;
  confirmStatus.disabled = true;
  confirmStatus.codesDisabled = true;
  confirmStatus.codesShow = false;
  email.value = '';
  codes.value = ['', '', '', '', '', ''];
};
const OnCancel = () => {
  emit('close');
};
const onConfirm = async () => {
  if (props.isSecondary) {
    confirmSecondaryEmail();
  } else {
    confirmPrimaryEmail();
  }
};

watchEffect(() => {
  confirmStatus.codesDisabled = !email.value;
});
watch(
  codes,
  (codes) => {
    confirmStatus.disabled = !(codes && codes.join('')?.length === 6);
  },
  { deep: true },
);

defineExpose({
  reset,
});
</script>
