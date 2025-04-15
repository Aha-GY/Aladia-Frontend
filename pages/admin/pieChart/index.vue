<template>
  <NuxtLayout :footer="false" class="ml-36 mt-36 flex items-center">
    <div class="flex gap-10">
      <Chart1 />
      <Chart2 />
      <Chart3 />
    </div>
  </NuxtLayout>
</template>

<script setup>
import Chart1 from './Chart1.vue';
import Chart2 from './Chart2.vue';
import Chart3 from './Chart3.vue';
</script>
