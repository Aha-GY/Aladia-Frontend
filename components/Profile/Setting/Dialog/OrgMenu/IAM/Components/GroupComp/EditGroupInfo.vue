<template>
  <div
    :class="showEditDrawer ? 'left-0' : 'left-[120%]'"
    class="absolute top-0 z-[100] flex h-full w-full flex-col bg-[#060606] px-4 transition-all duration-300"
  >
    <div class="flex-1">
      <div
        class="py-4 pl-2 text-base text-[#D9D9D9]"
        @click="emit('update:modelValue', false)"
      >
        <i
          class="fa-sharp fa-solid fa-arrow-left mr-2 cursor-pointer"
          data-cy="901a418d6475d5d8"
        />
        <span>
          {{ $t('org.group.details') }}
        </span>
      </div>
      <div class="text-sm">
        <div class="mb-3 flex items-end gap-2">
          <div
            class="flex size-5 items-center justify-center pb-2 text-13 text-white/50"
          >
            <i class="fa-solid fa-text" />
          </div>
          <BaseInput
            v-model="infoData.name"
            required
            :title="$t('index.name')"
          />
        </div>
        <el-popover :width="350" trigger="click" placement="bottom">
          <template #reference>
            <div class="mb-3 flex cursor-pointer items-end gap-2">
              <div
                class="flex size-5 items-center justify-center pb-2 text-13 text-white/50"
              >
                <div
                  class="size-3 rounded-sm bg-white"
                  :style="{
                    backgroundColor: infoData.color,
                  }"
                />
              </div>
              <BaseInput
                v-model="colorTitle"
                readonly
                :title="$t('index.color')"
              />
            </div>
          </template>
          <LazyBaseColor :color="infoData.color" @change="onColorChange" />
        </el-popover>
        <el-popover :width="350" trigger="click" placement="bottom">
          <template #reference>
            <div class="flex cursor-pointer items-end gap-2">
              <div
                class="flex size-5 items-center justify-center pb-2 text-13 text-white/50"
              >
                <i
                  v-if="infoData.icon"
                  class="fa-light"
                  :class="infoData.icon"
                  :style="{
                    color: infoData.color,
                  }"
                />
                <img
                  v-else-if="imageUrl"
                  :src="imageUrl"
                  class="size-5 rounded object-cover"
                />
                <i v-else class="fa-regular fa-image text-white/40" />
              </div>
              <BaseInput
                v-model="iconTitle"
                readonly
                :clear="!!imageUrl"
                :size="file?.size || 0"
                :upload="uploadProgress"
                :title="$t('index.iconOrImage')"
                @clear="file = null"
              />
            </div>
          </template>
          <LazyBaseIconPicker :icon="infoData.icon" @change="onIconChange" />
        </el-popover>
        <div class="mt-5 flex items-start gap-2">
          <div
            class="flex size-5 items-center justify-center pt-4 text-13 text-white/50"
          >
            <i class="fa-regular fa-memo-pad" />
          </div>
          <div class="relative flex-1">
            <LazyBaseEditor
              v-model="infoData.description"
              name="description-editor"
              type="textarea"
              :options="{
                placeholder: $t('index.description.content'),
              }"
              area-height="20rem"
              limit-character
              :characters-limit="2000"
              :auto-focus="false"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-end justify-end pb-4">
      <BaseButton
        :disabled="!infoData.name"
        type="secondary"
        icon="fa-light fa-floppy-disk"
        :loading="loading"
        :label="$t('base.upload.save')"
        @click="onSave"
      />
    </div>
  </div>
</template>
<script setup>
import { createOrgGroup, updateOrgGroup } from '~/api/v2/org';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  groupDetail: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['save', 'update:modelValue']);
const profileStore = useProfileStore();
const showEditDrawer = ref(false);
watch(
  () => props.modelValue,
  (value) => {
    showEditDrawer.value = value;
  },
);
watch(
  () => props.groupDetail,
  (value) => {
    infoData.value = {
      name: value.name,
      description: value.description,
      color: value.color,
      icon: value.icon,
      picture: value.picture,
    };
    colorTitle.value = value.color;
    iconTitle.value = value.icon || value.picture?.metadata?.name;
  },
);
const infoData = ref({
  name: '',
  description: '',
  color: '#707070',
  icon: '',
  picture: {
    fileId: '',
    metadata: {
      name: '',
      size: 0,
      mimetype: '',
    },
  },
});
const loading = ref(false);
const colorTitle = ref('');
const iconTitle = ref('');
const file = ref(null);
const uploadProgress = ref(0);
const imageUrl = computed(() =>
  file.value
    ? URL.createObjectURL(file.value)
    : typeof infoData.value.picture === 'string'
      ? infoData.value.picture
      : infoData.value.picture?.url,
);

const onColorChange = (value) => {
  infoData.value.color = value;
  colorTitle.value = value;
};
const onIconChange = async (info) => {
  file.value = null;
  uploadProgress.value = 0;
  infoData.value.icon = '';
  infoData.value.picture = {
    fileId: '',
    metadata: {
      name: '',
      size: 0,
      mimetype: '',
    },
  };
  if (info.file) {
    file.value = info.file;
    infoData.value.icon = '';
    iconTitle.value = info.file.name;
    const { fileId } = await upload({
      file: info.file,
      onProgress: (progress) => {
        uploadProgress.value = (progress / 100) * info.file.size;
      },
    });
    infoData.value.picture.fileId = fileId;
    infoData.value.picture.metadata = {
      name: info.file.name,
      size: info.file.size,
      mimetype: info.file.type,
    };
  } else if (info.icon) {
    infoData.value.icon = info.icon;
    iconTitle.value = info.icon;
    infoData.value.picture.fileId = '';
  }
};
const onSave = async () => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  const fetchApi = props.groupDetail.id ? updateOrgGroup : createOrgGroup;
  try {
    const data = await fetchApi({
      organizationId: profileStore.myProfileDetail.id,
      name: infoData.value.name,
      groupId: props.groupDetail.id || undefined,
      color: infoData.value.color || undefined,
      icon: infoData.value.icon || undefined,
      description: infoData.value.description,
      picture: infoData.value.picture?.fileId ? infoData.value.picture : null,
    });
    emit('update:modelValue', false);
    emit('save', data);
  } finally {
    loading.value = false;
  }
};
</script>
