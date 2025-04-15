<template>
  <div class="flex items-center gap-3 overflow-hidden">
    <div
      class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5"
    >
      <i class="fa-light" :class="className" />
    </div>
    <i
      class="fa-circle-info cursor-pointer text-xs opacity-70 transition-all"
      :class="open ? 'fa-solid' : 'fa-light'"
    />
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    className() {
      return {
        'fa-clock text-[#DCAE0C]': this.item.status === 'answered',
        'fa-graduation-cap text-[#D9D9D9]':
          this.item.status === 'answered-by-teacher',
        'fa-xmark text-[#B31414]': this.item.status === 'not-answered',
        'fa-check text-[#35A823]': this.item.status === 'solved',
      };
    },
  },
};
</script>
