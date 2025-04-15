<template>
  <div class="w-full" @click="onOpenModal">
    <i class="fa-regular fa-map mr-2 text-xs" />
    {{ $t('personal.profile.roadmap.feature') }}
  </div>
  <BaseDialog
    v-model="isOpenModal"
    :title="$t('personal.profile.roadmap.title')"
    class="!w-[90%] md:!w-[36.25rem]"
    @close="onCancel"
  >
    <template #titleIcon>
      <i
        class="fa-light fa-up-right-from-square pr-2 text-base !font-normal text-[#b0b0b0]"
      />
    </template>

    <div class="grid grid-cols-1 gap-4 text-sm text-[#b0b0b0]">
      <p>
        {{ $t('personal.profile.roadmap.contentOne') }}
        <strong>{{ $t('personal.profile.roadmap.contentTwo') }}</strong>
        {{ $t('personal.profile.roadmap.contentThree') }}
      </p>
    </div>

    <div class="mt-[1.125rem] flex justify-end">
      <BaseButton
        type="tertiary"
        :label="$t('personal.profile.roadmap.buttons.cancel')"
        @click="onCancel"
      />
      <BaseButton
        class="ml-3"
        :label="$t('personal.profile.roadmap.buttons.continue')"
        @click="onContinue"
      />
    </div>
  </BaseDialog>
</template>

<script setup>
const isOpenModal = ref(false);

const onCancel = () => {
  isOpenModal.value = false;
};
const onOpenModal = () => {
  isOpenModal.value = true;
};

const onContinue = async () => {
  window.open('https://feedback.aladia.io', '_blank');
  onCancel();
};
</script>
