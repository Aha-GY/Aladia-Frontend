<template>
  <div class="relative">
    <div class="w-12 shrink-0">
      <BaseAvatar :picture="userPicture" class="size-7" />
    </div>
    <BaseAvatar
      :picture="orgPicture"
      class="absolute bottom-[0.57rem] right-[-1.125rem] size-3"
    />
  </div>
</template>

<script>
export default {
  props: {
    userPicture: {
      type: String,
      default: '',
    },
    orgPicture: {
      type: String,
      default: '',
    },
  },
};
</script>
