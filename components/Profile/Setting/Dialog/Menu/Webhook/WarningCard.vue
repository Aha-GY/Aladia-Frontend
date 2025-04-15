<template>
  <div
    class="absolute left-1/2 top-1/2 z-50 mx-3 my-3 w-96 max-w-full -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded bg-black text-white shadow-lg"
  >
    <div class="flex justify-between bg-[#0C0C0C] pb-3 pt-3">
      <div class="m-2 flex items-center gap-1 text-xl text-[#ED3C28]">
        <span class="ml-1 mr-2">
          <i class="fas fa-link-slash text-center text-[#ED3C28]" />
        </span>
        <span class="font-normal">
          {{ $t('personal.webhook.url.error.endpoint') }}
        </span>
      </div>

      <BaseButton
        type="secondary"
        class="fa-light fa-close m-2 border-none bg-transparent text-center transition-all hover:bg-none"
        @click="$emit('close')"
      />
    </div>
    <div class="p-6">
      <h2 class="text-xl font-normal text-[#B0B0B0]">
        {{ $t('personal.webhook.configuration.error') }}
      </h2>
      <div class="mt-2 pb-2 text-base text-[#B0B0B0]">
        <p class="pb-2">
          {{ $t('personal.webhook.url.incorrect') }}
        </p>
        <p class="pb-2">
          {{ $t('personal.webhook.url.verify') }}
        </p>

        <p class="pb-2">
          {{ $t('personal.webhook.url.support.ask') }}
        </p>
        <p class="mt-2">
          {{ $t('personal.webhook.url.support.reach') }}
          <a href="https://support.aladia.com" class="text-[#B91C1C] underline">
            {{ $t('personal.webhook.url.support.team') }}
          </a>
          {{ $t('personal.webhook.url.support.reach2') }}
        </p>
      </div>
    </div>
    <div class="pm-2 m-4 flex justify-between">
      <BaseButton
        type="secondary"
        icon="fa-light fa-xmark"
        class="items-center border-none p-2 text-[1rem] text-[#FAFAFA]"
        label="$t:base.upload.cancel"
        @click="$emit('close')"
      />
      <BaseButton
        type="error"
        icon="fa-light fa-phone "
        class="items-center border-none"
        label="$t:personal.webhook.url.support.label"
      />
    </div>
  </div>
</template>

<script>
export default {
  emits: ['close'],
  data() {
    return {
      isVisible: true, // Set this based on your conditions
    };
  },
  methods: {
    hideWarningCard() {
      this.isVisible = false;
    },
  },
};
</script>
