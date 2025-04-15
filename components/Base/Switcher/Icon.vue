<template>
  <div
    ref="checkbox"
    class="relative flex h-[1.1875rem] w-[2.375rem] items-center justify-center"
  >
    <div class="h-full w-full rounded-[2.125rem] bg-[#151515]" />
    <div
      :class="active ? 'translate-x-2' : 'translate-x-[-12px]'"
      class="absolute flex h-6 w-6 items-center justify-center rounded-full bg-[#202020] text-[#F1F1F1] shadow-[2px_2px_6px_0px_#00000099] transition-all duration-300 hover:bg-white hover:bg-opacity-20 hover:text-white"
      data-cy="d8adf619cbced323"
      @click="handleClickToChange"
    >
      <i
        :class="[
          active ? 'opacity-100' : 'opacity-70',
          isClicked ? clickedIconClass : iconClass,
        ]"
        class="text-sm"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    iconClass: {
      type: String,
      default: 'fa-regular fa-chart-pie-simple',
    },
    clickedIconClass: {
      type: String,
      default: 'fa-solid fa-chart-pie-simple',
    },
  },
  setup() {
    const checkbox = ref(null);

    return { checkbox };
  },
  data() {
    return {
      isClicked: false,
    };
  },
  methods: {
    handleClickToChange() {
      this.isClicked = true;
      setTimeout(() => {
        this.isClicked = false;
        this.$emit('change');
      }, 300);
    },
  },
};
</script>
