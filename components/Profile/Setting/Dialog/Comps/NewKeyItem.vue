<template>
  <div class="!relative mt-4 w-full">
    <div class="flex items-center">
      <span
        :data-cy="`api-key-value-${keyName}`"
        class="text-base text-white/70"
      >
        {{ keyName }}
      </span>
      <template v-if="!!expireAfter">
        <el-tooltip :teleported="false" placement="bottom" effect="light">
          <template #content>
            <div class="p-1.5 text-sm">
              {{ $t('personal.profile.expire.label') }}
              <span class="text-red-500">{{ expireAfter }}</span>
              {{
                $t('personal.profile.expire.desc', { date: formatSelectedDate })
              }}
            </div>
          </template>
          <i class="fa-solid fa-circle-info ml-2 text-sm text-[#707070]" />
        </el-tooltip>
      </template>
    </div>
    <div class="flex w-full flex-col items-center justify-between md:flex-row">
      <div
        class="flex flex-[0.95] overflow-hidden pr-1.5 text-9 md:text-11"
        :class="{
          '!text-11': !show && $device.isMobile,
          '!text-13': !show && !$device.isMobile,
        }"
      >
        {{ fullKeyValue }}
      </div>
      <div class="flex w-full items-center justify-end md:w-auto">
        <BaseButton
          type="tertiary"
          size="small"
          class="flex !h-6 !w-6 justify-center"
          @click="handleToggleShow"
        >
          <i
            class="fa-solid cursor-pointer text-sm"
            :class="show ? 'fa-eye-slash' : 'fa-eye'"
            data-cy="toggle-api-key-visibility-button"
          />
        </BaseButton>

        <BaseButton
          type="tertiary"
          size="small"
          class="flex !h-6 !w-6 justify-center"
          @click="handleClickCopy"
        >
          <i
            class="fa-solid fa-copy cursor-pointer text-sm"
            data-cy="copy-api-key-button"
          />
        </BaseButton>
        <div>
          <el-popover
            v-model:visible="editMenuPopupShow"
            trigger="click"
            :teleported="false"
            :show-arrow="false"
            placement="bottom-start"
            :popper-style="{
              border: 'none',
              background: 'transparent',
              'box-shadow': 'none',
              padding: '0',
              borderRadius: '0.375rem',
              minWidth: '6.25rem',
            }"
          >
            <template #reference>
              <BaseButton
                size="small"
                type="tertiary"
                class="flex !h-6 !w-6 items-center justify-center"
                data-cy="edit-api-key-menu-popup-trigger"
              >
                <i class="fa-solid fa-ellipsis text-md" />
              </BaseButton>
            </template>
            <div class="popupborder bg-[#060606] p-[0.375rem]">
              <ul class="leading-5">
                <BaseMenuItem
                  :icon-class="'fa-solid fa-pen-to-square'"
                  data-cy="5b3c6f6c944f568b"
                  @click="handleClickEdit"
                >
                  {{ $t('base.editor.edit') }}
                </BaseMenuItem>

                <BaseMenuItem
                  class="text-red-500"
                  :icon-class="
                    loading
                      ? 'fa-solid fa-spinner animate-spin'
                      : 'fa-solid fa-trash'
                  "
                  data-cy="28271e4a0cf95204"
                  @click="handleClickDelete"
                >
                  {{ $t('post.delete') }}
                </BaseMenuItem>
              </ul>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

const props = defineProps({
  keyName: {
    type: String,
    required: true,
  },
  keyValue: {
    type: String,
    required: true,
  },
  keyId: {
    type: String,
    required: true,
  },
  expireDate: {
    type: String,
  },
});

const emits = defineEmits(['editKey']);

const { t } = useI18n();

const $toast = useToast();
const authStore = useAuthStore();

const show = ref(false);
const editMenuPopupShow = ref(false);
const editMenuPopupRef = ref(null);
const loading = ref(false);

const fullKeyValue = computed(() =>
  show.value
    ? props.keyValue
    : '*'.repeat(props.keyValue.length - 4) + props.keyValue.slice(-4),
);

onClickOutside(editMenuPopupRef, () => {
  editMenuPopupShow.value = false;
});

const formatSelectedDate = computed(() =>
  props.expireDate ? formatDate(props.expireDate, 'MMM DD,YYYY') : '',
);
const expireAfter = computed(() =>
  props.expireDate ? timeAgo(props.expireDate) : '',
);

function handleToggleShow() {
  show.value = !show.value;
}

async function handleClickCopy() {
  try {
    await navigator.clipboard.writeText(props.keyValue);
    $toast.success(t('personal.profile.token.copy.success'));
  } catch (error) {
    console.error('Failed to copy key to clipboard', error);
  }
}

function handleClickEdit() {
  emits('editKey', props.keyId);
}

async function handleClickDelete() {
  loading.value = true;
  const res = await authStore.deleteAPIKey(props.keyId);
  if (res) {
    $toast.success(t('personal.profile.delete.success'));
  }
  await authStore.listAllToken();
  loading.value = false;
  editMenuPopupShow.value = false;
}
</script>
