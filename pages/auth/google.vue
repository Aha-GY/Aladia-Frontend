<template>
  <div />
</template>

<script>
export default {
  mounted() {
    const provider = useCookie('provider-auth');
    provider.value = true;
    window.close();
  },
};
</script>
