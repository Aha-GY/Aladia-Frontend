<template>
  <div ref="compRef" class="min-h-[calc(60vh_-_10px)]"><slot /></div>
  <ProfileSettingDialogCompsConsole :shadow="shadow" />
</template>
<script setup>
const compRef = ref(null);
const shadow = ref(false);

onMounted(() => {
  const element = compRef.value.parentNode;
  shadow.value = element.scrollHeight > element.clientHeight;
});
</script>
