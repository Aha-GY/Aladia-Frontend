<template>
  <div>
    <div>{{ $t('index.common.hi') }}</div>
    <div data-cy="88fda67696c48dbe" @click="changeLocale('en')">en</div>
    <div data-cy="23df8f05adc13cb5" @click="changeLocale('it')">it</div>
  </div>
</template>

<script setup>
const profileStore = useProfileStore();
const changeLocale = (locale) => {
  profileStore.setLanguage(locale);
};
</script>
