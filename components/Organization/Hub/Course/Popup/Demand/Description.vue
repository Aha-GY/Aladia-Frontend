<template>
  <div class="flex gap-4">
    <div class="flex w-4 justify-center">
      <i class="fa-light fa-align-left text-base text-white/20" />
    </div>
    <div class="relative flex-1">
      <LazyBaseEditor
        v-model="lecture.description"
        name="description-editor"
        type="textarea"
        :options="{
          placeholder: $t('calendar.description'),
        }"
        area-height="10rem"
        limit-character
        :characters-limit="500"
        :auto-focus="false"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lecture: Object,
  },
};
</script>
