<template>
  <div class="flex flex-col items-center px-3 pt-3 text-center">
    <div
      class="mb-4 flex size-[3.75rem] items-center justify-center rounded-full bg-white/5"
    >
      <i class="fa-light fa-magnifying-glass text-[2rem]" />
    </div>
    <div class="mb-4 text-sm text-white/50">
      {{ $t('base.member.invite.empty.title') }}
    </div>
    <div v-if="isEmail" class="text-sm text-white/50">
      {{ $t('base.member.invite.empty.suggest') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isEmail: {
      type: Boolean,
    },
  },
};
</script>
