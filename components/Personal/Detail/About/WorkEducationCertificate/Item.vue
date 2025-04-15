<template>
  <div
    class="work-education-cerificate flex flex-row items-center justify-center gap-1.5 border-b-[1px] border-[#56565690] py-1.5 leading-[1.125rem] transition-all duration-300 last:border-none hover:cursor-pointer hover:bg-[#191919] md:px-2"
    data-cy="181ecf2446c1100f"
    @click.stop="handleDetail()"
  >
    <div
      class="flex h-12 w-12 items-center justify-center rounded-md bg-[#FFFFFF0D]"
    >
      <template v-if="data.type === 'work'">
        <img
          v-if="data.brand?.picture || data.organization?.picture"
          :src="data.brand?.picture || data.organization?.picture"
          class="h-full w-full object-scale-down"
        />
        <i v-else class="fa-solid fa-briefcase" />
      </template>
      <i v-if="data.type === 'study'" class="fa-solid fa-graduation-cap" />
      <i
        v-if="data.type === 'certificate'"
        class="fa-solid fa-file-certificate"
      />
    </div>
    <div class="flex flex-1 flex-col overflow-hidden">
      <div class="flex flex-row items-center truncate">
        <div class="max-w-[20rem] truncate text-base leading-6 text-[#F1F1F1]">
          {{ data.name || data.degree }}
        </div>
        <div class="truncate text-xs text-[#555555]">
          <span class="inline-block w-4 text-center text-base text-[#555555]">
            &middot;
          </span>
          {{ formatDate(data.startDate, 'MMM YYYY') }}
          {{
            data.endDate
              ? ` - ${formatDate(data.endDate, 'MMM YYYY')}`
              : ` - ${$t('personal.now')}`
          }}
          <span
            v-if="data.authority"
            class="inline-block w-4 text-center text-base text-[#555555]"
          >
            &middot;
          </span>
          {{ data.authority }}
        </div>
        <el-tag
          v-if="
            profileStore.getPersonalProfileDetail()?.mainExperience?.id ===
            data.id
          "
          type="warning"
          class="ml-3"
        >
          {{ $t('personal.main.work') }}
        </el-tag>
      </div>
      <div
        v-if="data.type === 'certificate'"
        class="truncate text-xs text-[#707070]"
      >
        <div class="underline-offset-3 truncate text-xs underline">
          {{ data.link || '' }}
        </div>
      </div>
    </div>
    <el-popover
      v-model:visible="show"
      trigger="click"
      width="fit-content"
      popper-class="!min-w-[0rem]"
    >
      <template #reference>
        <div
          class="flex h-6 w-6 items-center justify-center hover:bg-[#292929]"
          data-cy="c4869f56b704ee03"
          @click.stop
        >
          <i class="fa-regular fa-ellipsis" />
        </div>
      </template>
      <template v-if="isMe">
        <div
          v-if="data.certificateOrEducationalExperienceType !== 'internal'"
          class="w-24 cursor-pointer p-2 transition-all hover:bg-white/10"
          data-cy="68ba85494be378f4"
          @click="handleEdit"
        >
          <i class="fa-solid fa-pen-to-square min-w-4 text-center" />
          <span class="ml-1.5">{{ $t('base.editor.edit') }}</span>
        </div>
        <div
          v-if="
            profileStore.getPersonalProfileDetail()?.mainExperience?.id !==
              data.id && data.type === 'work'
          "
          class="w-24 cursor-pointer p-2 transition-all hover:bg-white/10"
          data-cy="28c10d9edbc2f87a"
          @click="handleSetMain"
        >
          <i
            v-if="mainLoading"
            class="fa-solid fa-spinner min-w-4 animate-spin text-center"
          />
          <i v-else class="fa-sharp fa-solid fa-bookmark min-w-4 text-center" />
          <span class="ml-1.5">
            {{ $t('personal.main.set') }}
          </span>
        </div>
        <div
          class="w-24 cursor-pointer p-2 text-[#DB4446] transition-all hover:bg-white/10"
          data-cy="2745755633b7ff63"
          @click="onOpenModal"
        >
          <i class="fa-solid fa-trash min-w-4 text-center" />
          <span class="ml-1.5">{{ $t('base.editor.delete') }}</span>
        </div>
      </template>
      <template v-else>
        <div
          class="w-24 cursor-pointer p-2 transition-all hover:bg-white/10"
          data-cy="3267c51d3045bf60"
          @click="handleShare"
        >
          <i class="fa-solid fa-share-nodes min-w-4 text-center" />
          <span class="ml-1.5">
            {{ $t('personal.share') }}
          </span>
        </div>
      </template>
    </el-popover>
  </div>
  <BaseDialog
    v-model="openConfirmModal"
    :title="$t('personal.confirmDeletion.title')"
    title-class="!text-xl !text-[#EB4937]"
    class="!w-[90%] md:!w-[580px]"
    @close="onCancelModal"
  >
    <template #titleIcon>
      <i
        class="fa-solid fa-trash-can pr-1.5 text-base !font-normal !text-[#EB4937]"
      />
    </template>

    <div class="grid grid-cols-1 gap-4 text-sm text-[#b0b0b0]">
      <span v-if="props.showType === 'certificate'">
        {{ $t('personal.confirmDeletion.content.certificate') }}
      </span>
      <span v-if="props.showType === 'study'">
        {{ $t('personal.confirmDeletion.content.education') }}
      </span>
      <span v-if="props.showType === 'work'">
        {{ $t('personal.confirmDeletion.content.work') }}
      </span>
    </div>
    <div class="mt-[1.125rem] flex justify-end">
      <BaseButton
        type="tertiary"
        label="$t:personal.profile.logged.cancel"
        @click="onCancelModal"
      />
      <BaseButton
        class="ml-3"
        type="error"
        label="$t:base.editor.delete"
        :loading="loading"
        :disabled="loading"
        @click="onDelete"
      />
    </div>
  </BaseDialog>
</template>
<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  showType: {
    type: String,
    default: '',
  },
});
const emits = defineEmits(['refresh', 'openItem']);
const profileStore = useProfileStore();
const isMe = computed(
  () =>
    profileStore.myProfileDetail.id ===
    profileStore.getPersonalProfileDetail().id,
);
const experiencesStore = useExperiencesStore();
const show = ref(false);
const loading = ref(false);
const mainLoading = ref(false);
const openConfirmModal = ref(false);

const onOpenModal = () => {
  openConfirmModal.value = true;
};

const onCancelModal = () => {
  openConfirmModal.value = false;
};
const handleEdit = () => {
  emits('openItem', { action: 'edit', item: props.data });
};
const handleDetail = () => {
  emits('openItem', { action: 'detail', item: props.data });
};
const onDelete = async () => {
  try {
    if (loading.value) {
      return false;
    }
    loading.value = true;
    await experiencesStore.deleteExperience({ experienceId: props.data.id });
    emits('refresh');
  } finally {
    loading.value = false;
    onOpenModal.value = false;
  }
};
const handleSetMain = async () => {
  try {
    if (mainLoading.value) {
      return false;
    }
    mainLoading.value = true;
    await profileStore.updateMyProfile({
      mainExperienceId: props.data.id,
    });
    await profileStore.getUserProfile({
      profileId: profileStore.getPersonalProfileDetail().id,
    });
  } finally {
    mainLoading.value = false;
  }
};
const handleShare = () => {
  console.log('--------------↓↓↓↓↓---------------------');
  console.log('click share button', props.data);
  console.log('--------------↑↑↑↑↑---------------------');
};
</script>
