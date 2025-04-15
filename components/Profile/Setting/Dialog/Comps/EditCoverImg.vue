<template>
  <BaseDialog
    v-model="open"
    :destroy-on-close="true"
    :title="$t('personal.profile.edit.background')"
    class="!w-[90%] md:!w-[51.25rem]"
  >
    <ProfileSettingDialogCompsImageEditor
      data-cy="edit-cover-image"
      :url="profileStore.myProfileDetail.cover"
      :options="options"
      @result="handleResult"
    />
  </BaseDialog>
  <div
    class="cursor-pointer"
    data-cy="edit-cover-image-editor-open-button"
    @click.stop="open = true"
  >
    <slot />
  </div>
</template>
<script setup>
import { useToast } from 'vue-toastification';

const profileStore = useProfileStore();
const authStore = useAuthStore();
const $toast = useToast();
const open = ref(false);

const options = {
  imageCropAspectRatio: 16 / 3,
  cropSelectPresetOptions: [],
  imageCropMinSize: { width: 2048, height: 380 },
};

const handleResult = async (res, cb) => {
  try {
    const { fileId } = await upload({ file: res });
    const params = {
      cover: {
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
      profileStore.myOrgProfileDetail.cover = data.cover;
    } else {
      profileStore.myUserProfileDetail.cover = data.cover;
    }
    cb(true);
  } catch (error) {
    $toast.error(error.message);
    cb(true);
  }
};
</script>
