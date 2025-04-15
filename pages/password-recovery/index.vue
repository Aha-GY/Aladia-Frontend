<template>
  <NuxtLayout>
    <Head>
      <Title>{{ $t('auth.forgot.recovery.title') }}</Title>
    </Head>
    <div class="flex justify-center pt-16">
      <div
        class="relative h-[40rem] w-[25rem] rounded-md border border-white/10 bg-black/60 p-5 text-13 shadow-[0px_3px_6px_#000000]"
      >
        <AuthBorder />
        <AuthRecovery />
      </div>
    </div>
  </NuxtLayout>
</template>
