<template>
  <div
    class="mb-6 flex items-center gap-6 rounded border border-red-600 px-4 py-6"
  >
    <div class="flex w-32 justify-center">
      <img :src="`/icons/${provider}.svg`" class="h-20 w-20 object-contain" />
    </div>
    <div class="flex-1">
      <div class="mb-2 text-base font-semibold">
        {{ $t('auth.provider.header.title') }}
      </div>
      <div class="text-13 text-white/70">
        <div>{{ $t('auth.provider.header.description') }}</div>
        <div>
          <span class="capitalize">{{ provider }}</span>
          {{ $t('auth.provider.header.signIn') }}.
        </div>
        <div>{{ $t('auth.provider.header.title') }}.</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    provider: {
      type: String,
      required: true,
    },
  },
};
</script>
