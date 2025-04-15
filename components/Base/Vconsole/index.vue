<template>
  <div data-type="vconsole" />
</template>

<script setup>
useScriptTag('https://unpkg.com/vconsole@latest/dist/vconsole.min.js', () => {
  new window['VConsole']();
});
</script>
