<template>
  <NuxtLayout>
    <ErrorCode404 v-if="error.statusCode === 404" :error="error" />
    <ErrorCode403 v-else-if="error.statusCode === 403" :error="error" />
    <div v-else>{{ JSON.stringify(error) }}</div>
  </NuxtLayout>
</template>

<script setup>
const { error } = defineProps({
  error: Object,
});
</script>
