<template>
  <div class="flex max-h-96 min-h-32 flex-col gap-2 overflow-y-auto text-sm">
    <div
      v-for="item in filter"
      :key="item.id"
      class="group flex cursor-pointer items-center gap-1 rounded p-1 transition-all hover:bg-[#6b540033]"
      data-cy="dadf726bc1d995af"
      @click="onClick(item)"
    >
      <CountryFlag v-if="item.flagIcon" :country="item.flagIcon" size="small" />
      {{ item.value }}
    </div>
  </div>
</template>

<script>
import CountryFlag from 'vue-country-flag-next';

export default {
  components: {
    CountryFlag,
  },
  props: {
    value: Object,
  },
  setup() {
    const teacherStore = useTeacherStore();
    return { teacherStore };
  },
  computed: {
    filter() {
      if (
        this.value.value &&
        !this.teacherStore.states.find(
          (item) => item.value === this.value.value,
        )
      ) {
        return this.teacherStore.states.filter((item) =>
          item.value.toLowerCase().includes(this.value.value.toLowerCase()),
        );
      }

      return this.teacherStore.states;
    },
  },
  mounted() {
    if (!this.teacherStore.states.length) {
      this.teacherStore.getStates({
        numberOfElements: 300,
        pageNumber: 1,
      });
    }
  },
  methods: {
    onClick(item) {
      this.$emit('select', { ...item });
    },
  },
};
</script>
