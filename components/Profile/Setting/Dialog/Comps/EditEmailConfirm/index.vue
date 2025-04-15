<template>
  <BaseDialog v-model="open" :title="title" class="!w-[90%] md:!w-[32.5rem]">
    <ProfileSettingDialogCompsEditEmailConfirmPwd
      v-if="step === 1"
      ref="PwdRef"
      @close="OnClose"
      @confirm="onNext"
    />
    <ProfileSettingDialogCompsEditEmailConfirmCode
      v-if="step === 2"
      ref="emailCodeRef"
      :is-secondary="props.isSecondary"
      :is-add-secondary="props.isAddSecondary"
      @close="OnClose"
      @confirm="emit('confirm')"
    />
  </BaseDialog>
  <div data-cy="98e5e94523100959" @click="open = true"><slot /></div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  isSecondary: { type: Boolean, default: false },
  isAddSecondary: { type: Boolean, default: false },
});
const emit = defineEmits(['close', 'confirm']);
const { t } = useI18n();
const step = ref(1);

const title = computed(() =>
  step.value === 1
    ? t('personal.profile.change.email.verifyPassword')
    : props.isSecondary
      ? t('personal.profile.change.email.secondary.title', {
          type: props.isAddSecondary
            ? t('personal.profile.change.email.secondary.add')
            : t('personal.profile.change.email.secondary.edit'),
        })
      : t('personal.profile.change.email.label'),
);

const PwdRef = ref(null);
const emailCodeRef = ref(null);
const open = ref(false);

const onNext = () => {
  step.value = 2;
};

const OnClose = () => {
  open.value = false;
  emit('close');
};

watchEffect(() => {
  if (!open.value) {
    step.value = 1;
    PwdRef.value?.reset();
    emailCodeRef.value?.reset();
  }
});
</script>
