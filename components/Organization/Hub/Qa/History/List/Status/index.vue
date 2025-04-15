<template>
  <div
    class="inline-flex items-center gap-1 rounded px-2 py-0.5 leading-none"
    :class="{
      'bg-[#2A230E] text-[#E0B92C]': item.status === 'answered',
      'bg-[#43080a] text-[#e93f43]': item.status === 'not-answered',
      'bg-[#072c22] text-[#29c79d]': item.status === 'solved',
      'bg-[#1D2D34] text-[#98CEF7]': item.status === 'answered-by-teacher',
    }"
  >
    <div class="flex size-5 items-center justify-center">
      <i
        v-if="item.status === 'answered-by-teacher'"
        class="fa-light fa-graduation-cap"
      />
      <i
        v-if="item.status === 'not-answered'"
        class="fa-light fa-xmark-circle"
      />
      <i v-if="item.status === 'solved'" class="fa-light fa-check" />
      <i v-if="item.status === 'answered'" class="fa-solid fa-clock" />
    </div>
    {{ $t(formatString(item.status)) }}
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
  methods: {
    formatString(str) {
      if (str === 'answered') {
        return 'course.question.status.answered';
      } else if (str === 'not-answered') {
        return 'course.question.status.notAnswered';
      } else if (str === 'solved') {
        return 'course.question.status.solved';
      } else if (str === 'answered-by-teacher') {
        return 'course.question.status.answeredByT';
      } else {
        return str
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    },
  },
};
</script>
