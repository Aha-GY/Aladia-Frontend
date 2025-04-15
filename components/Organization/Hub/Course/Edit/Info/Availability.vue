<template>
  <div class="relative mb-5 flex items-end gap-3">
    <div class="flex size-4 items-center justify-center pb-3 text-white/50">
      <i class="fa-light fa-users-line" />
    </div>
    <div class="relative flex-1">
      <BaseInput
        ref="seatCount"
        v-model="value"
        number
        :max-length="3"
        title="Availability"
        :class="limited ? '' : 'pointer-events-none'"
        data-cy="edit-course-seat-count"
        @focus="focused = true"
        @blur="focused = false"
      >
        <template #tooltip>
          <el-tooltip
            placement="top-start"
            effect="light"
            :popper-options="{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [-60, 10],
                  },
                },
              ],
            }"
          >
            <i
              class="fa-regular fa-circle-info pointer-events-auto text-xs text-white/50"
            />
            <template #content>
              <div class="flex flex-col gap-1 p-1 text-xs">
                <div class="flex">
                  <div class="mr-2 flex h-4 w-4 items-center justify-center">
                    <i class="fa-solid fa-infinity text-sm" />
                  </div>
                  <div>
                    <div>{{ $t('course.unlimited') }}</div>
                    <div>{{ $t('course.subscription.amount') }}</div>
                  </div>
                </div>
                <div class="flex">
                  <div class="mr-2 flex h-4 w-4 items-center justify-center">
                    <i class="fa-solid fa-users-rectangle text-sm" />
                  </div>
                  <div>
                    <div>{{ $t('course.limited.content1') }}</div>
                    <div>{{ $t('course.limited.content2') }}</div>
                    <div>{{ $t('course.limited.content3') }}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-tooltip>
        </template>
      </BaseInput>
      <div
        class="pointer-events-none absolute bottom-1 right-0 text-xs text-white/50"
      >
        {{ $t('course.seats') }}
      </div>
      <div
        class="absolute bottom-[1.625rem] right-0 flex items-center gap-2 transition-all"
      >
        <div
          class="relative flex h-4 w-8 cursor-pointer items-center rounded-2xl"
          :class="limited ? 'bg-[#c9a84e]' : 'bg-[#565656]'"
          data-cy="bd4c272a38234247"
          @click="onChange"
        >
          <div
            class="relative z-10 ml-0.5 h-3 w-3 rounded-full bg-white transition-all"
            :class="{ 'ml-[1.125rem]': limited }"
          />
          <i
            v-if="limited"
            class="fa-solid fa-users-rectangle absolute left-0.5 z-0 scale-75 text-xs"
          />
          <i
            v-else
            class="fa-solid fa-infinity absolute right-0.5 z-0 scale-75 text-xs"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  data() {
    return {
      value: 'Unlimited',
      focused: false,
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    limited() {
      return !!this.course.seatCount && this.course.seatCount !== -1;
    },
  },
  watch: {
    'course.seatCount': {
      handler(val) {
        if (val === -1) {
          this.value = 'Unlimited';
        } else {
          this.value = val;
        }
      },
      immediate: true,
    },
    focused(val) {
      if (val) {
        return;
      }
      if (this.value === 'Unlimited') {
        this.course.seatCount = -1;
      } else {
        this.course.seatCount = this.value;
      }
    },
  },
  methods: {
    async onChange() {
      if (this.limited) {
        this.course.seatCount = -1;
        this.$refs.seatCount.$refs.input.blur();
      } else {
        this.course.seatCount = 100;
        this.$refs.seatCount.$refs.input.focus();
      }
    },
  },
};
</script>
