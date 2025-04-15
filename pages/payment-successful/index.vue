<template>
  <NuxtLayout>
    <Head>
      <Title>{{ $t('filter.payment.success') }}</Title>
    </Head>
    <div class="flex justify-center pt-16">
      {{ $t('filter.payment.dashSuccess') }}
    </div>
  </NuxtLayout>
</template>

<script setup>
const route = useRoute();
const id = ref(route.query.id);
const type = ref(route.query.type);

if (type.value === 'course') {
  navigateTo(`/courses/${id.value}?payment=success`);
}
</script>
