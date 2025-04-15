<template>
  <div
    class="inline-flex items-center gap-1 rounded-[0.3125rem] px-1 text-[0.75rem] leading-5"
    :class="{
      'bg-[#022C22] text-[#86EFAC]': isSolved,
      'bg-[#450A0A] text-[#EF4444]': isNotAnswered,
      'bg-[#2A230E] text-[#E0B92C]': isAnswerd,
      'bg-[#1D2D34] text-[#98CEF7]': isAnsByTeacher,
    }"
  >
    <span v-if="isSolved">
      <i class="fa-solid fa-circle-check" />
      {{ $t('course.question.status.solved') }}
    </span>
    <span v-if="isNotAnswered">
      <i class="fa-solid fa-circle-xmark" />
      {{ $t('course.question.status.notAnswered') }}
    </span>
    <span v-if="isAnswerd">
      <i class="fa-solid fa-clock" />
      {{ $t('course.question.status.answered') }}
    </span>
    <span v-if="isAnsByTeacher">
      <i class="fa-solid fa-graduation-cap" />
      {{ $t('course.question.status.answeredByT') }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    status: String, // 'solved', 'not_answered', 'answered', 'answered_by_teacher'
  },
  computed: {
    isSolved() {
      return this.status === 'solved';
    },
    isNotAnswered() {
      return this.status === 'not-answered';
    },
    isAnswerd() {
      return this.status === 'answered';
    },
    isAnsByTeacher() {
      return this.status === 'answered-by-teacher';
    },
  },
};
</script>
