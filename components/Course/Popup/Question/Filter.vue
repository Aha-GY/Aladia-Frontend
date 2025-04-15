<template>
  <el-select v-model="type">
    <el-option
      v-for="item in types"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
export default {
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  data() {
    return {
      type: 1,
      types: [{}],
    };
  },
  computed: {
    course() {
      return this.courseStore.course;
    },
    question() {
      return this.courseStore.question;
    },
  },
};
</script>
