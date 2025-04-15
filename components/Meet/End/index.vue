<template>
  <div
    class="relative flex h-full w-full flex-col items-center justify-center text-[#FAFAFA]"
  >
    <div
      v-if="!isFeedback && !submitted"
      class="absolute left-5 top-5 flex items-center gap-1.5"
    >
      <div class="relative h-[2.625rem] w-[2.625rem]">
        <BaseClockCountdown
          :second="countdown"
          :total="60"
          class="origin-top-left scale-[0.62]"
        />
        <div
          class="absolute left-0 top-0 flex h-full w-full items-center justify-center text-xs"
        >
          {{ countdown }}
        </div>
      </div>
      <div class="text-xs font-medium">
        {{ $t('meet.end.leave') }}
      </div>
    </div>

    <div class="text-xl">{{ $t('meet.end.left') }}</div>
    <div class="mb-10 mt-5 flex items-center gap-5">
      <div
        class="flex h-6 cursor-pointer items-center rounded-5 px-1.5 text-xs font-medium hover:bg-white/5"
        @click="rejoin"
      >
        {{ $t('meet.rejoin') }}
      </div>
      <BaseButton
        size="small"
        label="$t:meet.end.leave"
        class="justify-center"
        @click="onCoursesClick"
      />
    </div>
    <div
      class="flex h-[10.875rem] w-[23.125rem] flex-col items-center justify-center gap-4 rounded-5 border border-[#565656] p-4"
    >
      <div v-if="!submitted" class="text-xs">
        {{ $t('meet.end.feedback.dialog') }}
      </div>
      <div v-if="!submitted" class="flex items-center gap-2">
        <div
          v-for="n in 5"
          :key="n"
          class="flex h-[3.875rem] w-[3.25rem] cursor-pointer flex-col items-center justify-center gap-1 rounded-5"
          :class="stars >= n ? 'text-[#E0B92C]' : 'hover:bg-white/5'"
          @click="onChange(n)"
        >
          <i
            class="fa-star text-base"
            :class="stars >= n ? 'fa-solid' : 'fa-light'"
          />
          <div class="text-base font-medium leading-5">
            {{ n }}
          </div>
        </div>
      </div>
      <div
        v-if="!submitted"
        class="flex w-[292px] items-center"
        :class="isFeedback ? 'justify-center' : 'justify-between'"
      >
        <div v-if="isFeedback" class="text-xs">
          {{ $t('meet.end.feedback.submit') }}
        </div>
        <div v-if="!isFeedback" class="text-xs">
          {{ $t('meet.end.feedback.bad') }}
        </div>
        <div v-if="!isFeedback" class="text-xs">
          {{ $t('meet.end.feedback.excellent') }}
        </div>
      </div>
      <div v-if="submitted" class="text-base">
        {{ $t('meet.end.feedback.submitted') }}
      </div>
      <div v-if="submitted" class="text-xs text-[#565656]">
        {{ $t('meet.end.feedback.usage') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      countdown: 60,
      timer: null,
      stars: 0,
      submitted: false,
    };
  },
  computed: {
    end() {
      return this.hmsStore.end;
    },
    isFeedback() {
      return this.hmsStore.openPopup === 'feedback';
    },
  },
  watch: {
    isFeedback() {
      if (!this.isFeedback) {
        this.submitted = true;
      }
      this.timer && clearInterval(this.timer);
    },
  },
  mounted() {
    // if (this.end.disconnect) {
    this.init();
    // }
  },
  beforeUnmount() {
    this.timer && clearInterval(this.timer);
  },
  methods: {
    init() {
      this.timer && clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.timer);
          this.onCoursesClick();
        }
      }, 1000);
    },
    rejoin() {
      this.hmsStore.end.show = false;
      this.hmsStore.openPopup = '';
    },
    onCoursesClick() {
      this.$router.push(`/marketplace`);
      hmsActions.leave();
    },
    onChange(n) {
      this.stars = n;
      this.hmsStore.openPopup = 'feedback';
    },
  },
};
</script>
