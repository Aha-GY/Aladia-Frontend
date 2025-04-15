<template>
  <BaseDialog
    :model-value="popupOpen"
    :title="$t('personal.profile.token.new')"
    destroy-on-close
    :width="!$device.isMobile ? 543 : 380"
    :before-close="handleClickClosePopupConfirm"
  >
    <div class="mt-1.5 rounded bg-white bg-opacity-5 p-4">
      <BaseInput
        v-model="name"
        open
        :title="$t('personal.profile.token.name')"
        required
        :placeholder="$t('personal.profile.token.placeholder')"
        data-cy="new-api-access-token-name"
      />
    </div>
    <div
      class="mt-1.5 flex items-center justify-between rounded bg-white bg-opacity-5 p-4"
    >
      <div ref="datepickerPopupRef" class="flex-grow">
        <BaseInput
          v-model="formatSelectedDate"
          open
          required
          :disabled="noExpiration"
          :title="$t('personal.profile.token.expiration')"
          prefix-icon-class="fa-light fa-calendar"
          :placeholder="$t('personal.profile.token.date.pick')"
          data-cy="new-api-access-token-expiration"
          @click="handleExpirationInputClick"
        />
        <BasePopup
          :open="datePickerPopup"
          placement="bottom"
          :virtual-ref="datepickerPopupRef"
          :width="340"
        >
          <BaseDatePicker
            ref="datepickerRef"
            v-model="selectedDate"
            data-cy="new-api-access-token-expiration"
            :disabled-dates="[{ end: afterToday() }]"
            @change="onDateChange"
          />
        </BasePopup>
      </div>

      <div class="ml-8 flex flex-shrink-0 items-center">
        <BaseCheckboxStyle
          :state="noExpiration ? 'checked' : 'unchecked'"
          data-cy="new-api-access-token-no-expiration"
          @click="handleClickCheckBox"
        />
        <span class="ml-2">
          {{ $t('personal.profile.token.noExpiration') }}
        </span>
      </div>
    </div>
    <div class="flex items-center justify-end pt-3">
      <BaseButton
        :icon="loading ? 'fa-spinner animate-spin' : ''"
        label="$t:personal.account.token.generate"
        data-cy="new-api-access-token-save"
        @click="handleClickSaveAndGenerateToken"
      />
    </div>
  </BaseDialog>

  <el-dialog
    v-model="isOpenAllConfirmModal"
    :show-close="false"
    append-to-body
    destroy-on-close
    width="24rem"
  >
    <div class="flex flex-col">
      <div
        class="flex items-center justify-between rounded-t-sm bg-white/5 p-3"
      >
        <div class="flex items-center gap-2 text-sm">
          <i class="fa-regular fa-floppy-disk" />
          {{ $t('course.changeConfirmation.title') }}
        </div>
        <BaseIconClose @click="onCloseModal" />
      </div>
      <div
        class="flex flex-col gap-5 px-5 py-7 text-sm font-light text-white/70"
      >
        <div>{{ $t('course.changeConfirmation.contentOne') }}</div>
        <div>{{ $t('course.changeConfirmation.contentTwo') }}</div>
      </div>
      <div class="flex items-center justify-end gap-4 p-3">
        <BaseButton
          type="tertiary"
          :label="$t('course.changeConfirmation.quit')"
          icon="fa-regular fa-arrow-left-from-bracket"
          @click="onCloseAllModal"
        />
        <BaseButton @click="handleClickSaveAndGenerateToken">
          <div class="flex size-3 items-center justify-center">
            <i
              v-if="loading"
              class="fa-light fa-loader animate-spin text-base"
            />
            <i v-else class="fa-solid fa-save text-sm" />
          </div>
          {{ $t('course.changeConfirmation.save') }}
        </BaseButton>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

const props = defineProps({
  popupOpen: {
    type: Boolean,
    required: true,
  },
  closePopup: {
    type: Function,
    required: true,
  },
  editKeyItem: {
    type: Object,
  },
});

const { t } = useI18n();

const $toast = useToast();
const authStore = useAuthStore();

const editId = ref(null);
const name = ref('');
const noExpiration = ref(false);
const loading = ref(false);
const datePickerPopup = ref(false);
const datepickerPopupRef = ref(null);
const datepickerRef = ref(null);
const selectedDate = ref(null);
const isOpenAllConfirmModal = ref(false);
const formatSelectedDate = computed(() =>
  selectedDate.value ? formatDate(selectedDate.value, 'MMM DD,YYYY') : '',
);

onUpdated(() => {
  // edit
  if (props.editKeyItem) {
    name.value = props.editKeyItem.name;
    noExpiration.value = props.editKeyItem.noExpiration;
    selectedDate.value = props.editKeyItem.expiresIn;
    editId.value = props.editKeyItem.id;
  }
});

const isFormChanged = computed(
  () => name.value !== '' || noExpiration.value || selectedDate.value !== null,
  // return (
  //   name.value !== props.editKeyItem.name ||
  //   noExpiration.value !== props.editKeyItem.noExpiration ||
  //   selectedDate.value !== props.editKeyItem.expiresIn
  // );
);

onClickOutside(datepickerRef, () => {
  datePickerPopup.value = false;
});
const onCloseModal = () => {
  isOpenAllConfirmModal.value = false;
};
const onOpenModal = () => {
  isOpenAllConfirmModal.value = true;
};
function handleClickClosePopup() {
  editId.value = null;
  name.value = '';
  noExpiration.value = false;
  selectedDate.value = null;
  props.closePopup();
}

const onCloseAllModal = () => {
  onCloseModal();
  handleClickClosePopup();
};
function onDateChange() {
  datePickerPopup.value = false;
}

const handleClickClosePopupConfirm = () => {
  if (isFormChanged.value) {
    onOpenModal();
  } else {
    handleClickClosePopup();
  }
};
function handleExpirationInputClick() {
  if (noExpiration.value) {
    return;
  }
  datePickerPopup.value = true;
}

function handleClickCheckBox() {
  noExpiration.value = !noExpiration.value;
  if (noExpiration.value) {
    selectedDate.value = null;
  }
}

async function handleClickSaveAndGenerateToken() {
  try {
    loading.value = true;
    if (!name.value) {
      $toast.error(t('personal.profile.token.required.name'));
      return;
    }
    if (!noExpiration.value && !selectedDate.value) {
      $toast.error(t('personal.profile.token.required.expiration'));
      return;
    }
    const params = {
      name: name.value,
      noExpiration: noExpiration.value,
      expiresIn: selectedDate.value,
    };
    if (editId.value) {
      const updataRes = await authStore.updateAPIKey({
        ...params,
        id: editId.value,
      });
      if (updataRes) {
        $toast.success(t('personal.profile.token.success.update'));
      }
    } else {
      const addRes = await authStore.createAPIKey(params);
      if (addRes) {
        $toast.success(t('personal.profile.token.success.update'));
      }
    }
    authStore.listAllToken();
    handleClickClosePopup();
    onCloseModal();
  } catch (err) {
    console.error('handleClickSaveAndGenerateToken', err);
    $toast.error(t('personal.profile.token.error.create'));
  } finally {
    loading.value = false;
  }
}
</script>
