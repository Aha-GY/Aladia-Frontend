<template>
  <BaseDialog
    v-model="open"
    :destroy-on-close="true"
    :title="$t('personal.profile.edit.avatar')"
    class="!w-[90%] md:!w-[51.25rem]"
  >
    <ProfileSettingDialogCompsImageEditor
      ref="imageEditor"
      data-cy="edit-avatar-image"
      :options="options"
      :url="profileStore.myProfileDetail.picture"
      @result="handleResult"
    >
      <template v-if="!authStore.isOrg" #extra-button>
        <BaseButton
          type="secondary"
          data-cy="change-profile-status-button"
          @click="openChangeStatus"
        >
          <i class="fa-solid fa-right-left" />
          {{ $t('personal.account.status') }}
        </BaseButton>
      </template>
    </ProfileSettingDialogCompsImageEditor>
  </BaseDialog>
  <div
    class="cursor-pointer"
    data-cy="edit-avatar-image-editor-open-button"
    @click.stop="open = true"
  >
    <slot />
  </div>

  <!-- set status -->
  <BaseDialog
    v-model="openStatus"
    :destroy-on-close="true"
    :title="$t('event.set.status')"
    class="!w-[90%] md:!w-[40rem]"
  >
    <div class="flex flex-col">
      <div
        class="mb-3 flex w-full justify-center border-b border-[#fff]/20 pb-5"
      >
        <div class="relative">
          <img
            v-if="myAvatar"
            :src="myAvatar"
            class="h-[12rem] w-[12rem] rounded-full object-cover"
          />
          <div
            v-else
            class="flex h-[12rem] w-[12rem] items-center justify-center rounded-full bg-[#1f1f1f]"
          >
            <i class="fa-solid fa-user text-[6rem]" />
          </div>
          <img
            v-if="currentStatus"
            :src="currentStatus === 'hiring' ? Hiring : OpenToWork"
            class="absolute bottom-0 left-0"
          />
        </div>
      </div>
      <div class="flex items-center justify-center">
        <div
          v-for="(item, index) in statusList"
          :key="index"
          class="mx-2 flex w-[7.5rem] cursor-pointer flex-col items-center rounded-lg border py-3 hover:border-[#fff]/20"
          :class="{
            'border-[#fff]/20': currentStatus === item.value,
            'border-transparent': currentStatus !== item.value,
          }"
          :data-cy="`change-status-${item.value}-button`"
          @click="handleChangeStatus(item)"
        >
          <div class="relative">
            <img
              v-if="myAvatar"
              :src="myAvatar"
              class="h-20 w-20 rounded-full object-cover"
            />
            <div
              v-else
              class="flex h-20 w-20 items-center justify-center rounded-full bg-[#1f1f1f]"
            >
              <i class="fa-solid fa-user text-[2rem]" />
            </div>
            <img :src="item.mask" class="absolute bottom-0 left-0" />
          </div>
          <span class="pt-2">
            {{ $t(item.label) }}
          </span>
        </div>
      </div>
    </div>
    <div class="mt-[1.125rem] flex justify-end">
      <BaseButton
        type="secondary"
        data-cy="00f191d03039ba88"
        @click="openStatus = false"
      >
        {{ $t('base.upload.cancel') }}
      </BaseButton>
      <BaseButton
        class="ml-3"
        label="$t:base.upload.save"
        :loading="loading"
        data-cy="change-status-save-button"
        @click="confirmStatus"
      />
    </div>
  </BaseDialog>
</template>
<script setup>
import { useToast } from 'vue-toastification';

import Hiring from '~/assets/images/Hiring.svg';
import OpenToWork from '~/assets/images/OpenToWork.svg';

const $toast = useToast();

const authStore = useAuthStore();
const profileStore = useProfileStore();
const open = ref(false);

const handleResult = async (res, cb) => {
  try {
    const { fileId } = await upload({ file: res });
    const params = {
      picture: {
        fileId,
        metadata: {
          name: res.name,
          size: res.size,
          mimetype: res.type,
        },
      },
    };
    const data = await profileStore.updateProfile(params, false);
    open.value = false;
    if (authStore.isOrg) {
      profileStore.myOrgProfileDetail.picture = data.picture;
      profileStore.myOrganizationList.forEach((org) => {
        if (org.id === profileStore.myOrgProfileDetail.id) {
          org.picture = data.picture;
        }
      });
    } else {
      profileStore.myUserProfileDetail.picture = data.picture;
      authStore.user.picture = data.picture;
    }
    cb(true);
  } catch (error) {
    $toast.error(error.message);
    cb(true);
  }
};
const options = {
  rounded: true,
  imageCropAspectRatio: 1,
  cropSelectPresetOptions: [],
  imageCropMinSize: { width: 400, height: 400 },
};
const imageEditor = ref(null);
const openStatus = ref(false);
const myAvatar = ref(null);
const currentStatus = ref(null);
const loading = ref(false);
const statusList = ref([
  { label: 'personal.profile.status.none', value: null },
  { label: 'personal.profile.status.hiring', value: 'hiring', mask: Hiring },
  {
    label: 'personal.profile.status.open',
    value: 'open-to-work',
    mask: OpenToWork,
  },
]);
const openChangeStatus = async () => {
  currentStatus.value = profileStore.myProfileDetail.status || null;
  const file = await imageEditor.value.getCurrentImg();
  myAvatar.value = file ? URL.createObjectURL(file) : null;
  openStatus.value = true;
};
const handleChangeStatus = (item) => {
  currentStatus.value = item.value;
};
const confirmStatus = async () => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  try {
    const data = await profileStore.updateProfile(
      {
        status: currentStatus.value,
      },
      false,
    );
    openStatus.value = false;
    profileStore.myUserProfileDetail.status = data.status;
    authStore.user.status = data.status;
  } finally {
    loading.value = false;
  }
};
</script>
