<template>
  <div v-if="read" class="relative flex flex-shrink-0 pr-0.5">
    <i class="fa-sharp fa-thin fa-check text-xs text-[#FFC700]/80" />
    <i
      class="fa-sharp fa-thin fa-pipe -translate-x-[1.5px] translate-y-[0.5px] rotate-[48deg] scale-y-90 text-xs text-[#FFC700]/80"
    />
  </div>
  <i
    v-else
    class="fa-sharp fa-thin fa-check flex-shrink-0 text-xs text-[#FFC700]/80"
  />
</template>
<script>
export default {
  props: {
    read: Boolean,
  },
};
</script>
