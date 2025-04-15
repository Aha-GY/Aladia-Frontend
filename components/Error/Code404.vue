<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
  >
    <Head>
      <Title>{{ $t('index.common.error.page.notFound') }}</Title>
    </Head>
    <div class="flex w-full flex-col items-center gap-6 text-center">
      <img src="/logo/image.png" class="h-36" />
      <h1 class="text-8xl font-extrabold">404</h1>
      <h2 class="mt-6 text-3xl font-bold">
        {{ $t('index.common.error.page.lost') }}
      </h2>
      <div class="mt-2 text-sm text-red-500">
        {{ error.message || $t('index.common.error.page.description') }}
      </div>
      <div class="mt-5">
        <BaseButton
          class="inline-flex"
          data-cy="21fd4a6a0ff67fdc"
          @click="handleError"
        >
          <i class="fa-regular fa-house-chimney" />
          {{ $t('index.common.error.page.redirect') }}
        </BaseButton>
      </div>
      <div class="hidden">{{ JSON.stringify(error) }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: '404',
  props: {
    error: Object,
  },
  methods: {
    handleError() {
      clearError({ redirect: '/' });
    },
  },
};
</script>
