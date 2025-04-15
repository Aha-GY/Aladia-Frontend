<template>
  <div
    class="flex h-full w-full flex-col gap-2 overflow-hidden rounded-5 border border-white/10 bg-[#060606]"
  >
    <MeetSidebarHeader :title="$t('meet.actions.write.review.label')">
      <template #prefix>
        <div
          class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
          @click="onBack"
        >
          <i class="fa-regular fa-arrow-left text-lg text-[#FAFAFA]" />
        </div>
      </template>
    </MeetSidebarHeader>

    <div class="bg-[#0D0D0D] px-6">
      <div class="py-1.5 text-sm font-semibold text-[#FAFAFA]">
        {{ $t('meet.actions.write.review.title') }}
      </div>
      <LazyBaseEditor
        v-model="description"
        name="description-editor"
        type="textarea"
        :options="{
          placeholder: $t('meet.actions.write.report.placeholder'),
        }"
        area-height="10rem"
        limit-character
        :characters-limit="200"
        :auto-focus="false"
      />
    </div>
    <div class="h-0 flex-1" />
    <div class="flex items-center justify-end gap-5 p-4">
      <BaseButton
        label="$t:base.upload.cancel"
        type="tertiary"
        @click="onBack"
      />
      <BaseButton
        label="$t:meet.actions.write.submit"
        :disabled="!description"
        @click="onSave"
      />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      description: '',
    };
  },
  methods: {
    onBack() {
      this.$emit('back');
    },
    onSave() {},
  },
};
</script>
