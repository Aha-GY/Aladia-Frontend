<template>
  <div class="pt-48 text-center text-2xl">
    {{ $t('auth.stripe.error') }}
  </div>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      window.close();
    }, 3000);
  },
};
</script>
