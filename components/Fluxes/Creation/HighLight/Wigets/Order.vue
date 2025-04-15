<template>
  <div
    class="popupborder max-h-[14.625rem] w-[3rem] overflow-y-auto rounded-5 bg-[#060606] p-1"
  >
    <ul class="text-center text-base leading-6">
      <li
        v-for="index in listCount"
        :key="index"
        class="cursor-pointer rounded-5 px-2 py-1 transition-all hover:bg-white/10"
        @click="handleToPos(index)"
      >
        <span data-cy="7d95fa48dbfe910e">
          {{ index }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    listCount: {
      type: Number,
      required: true,
    },
  },
  emits: ['select'],
  methods: {
    handleToPos(pos) {
      let index = 0;
      if (pos === 'first') {
        index = 0;
      } else if (pos === 'last') {
        index = this.listCount - 1;
      } else {
        index = Number(pos) - 1;
      }

      this.$emit('select', index);
    },
  },
};
</script>
