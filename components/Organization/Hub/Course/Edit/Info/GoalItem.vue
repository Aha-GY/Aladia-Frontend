<template>
  <div
    class="rounded border-l border-white/80 bg-[rgba(255,255,255,0.01)] p-3 pl-3 transition-all"
  >
    <div class="group/chapter">
      <div class="flex items-center justify-between gap-2">
        <div
          class="flex flex-1 cursor-pointer items-center gap-2"
          @click="open = !open"
        >
          <div
            class="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-sm"
          >
            <i
              class="fa-light fa-chevron-right text-white transition-all duration-300 hover:text-white/50"
              :class="open ? 'rotate-90' : ''"
            />
          </div>
          <div class="text-sm">
            {{ type }} {{ index + 1 }}
            <span v-if="type === 'Goal' && index <= 4" class="text-red-500">
              *
            </span>
          </div>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <BaseCheckboxStyle
            class="ml-auto"
            :state="state"
            @click="$emit('onSelect', index)"
          />
        </div>
      </div>
    </div>

    <div
      class="overflow-hidden transition-all"
      :class="{
        'max-h-[1024rem] pt-2': open,
        'max-h-0 pt-0 opacity-0': !open,
      }"
    >
      <div class="flex items-end gap-2 pl-6">
        <div class="flex-1 rounded-5 bg-[rgba(226,226,226,0.03)]">
          <textarea
            ref="autoResizeTextarea"
            v-model="goals[index]"
            class="mb-0 w-full resize-none overflow-hidden border-none bg-transparent p-1 text-13 text-[#D9D9D9] outline-none placeholder:text-[#555555]"
            maxlength="200"
            :placeholder="placeHolder"
            @input="adjustHeight"
          />
          <div
            class="flex items-center pb-1 pl-2 text-start text-xs"
            :class="length === 200 ? 'text-red-500' : 'text-[#6D6D6D]'"
          >
            {{ length }}/200
          </div>
        </div>
        <i
          class="fa-regular fa-trash-can cursor-pointer pb-0.5 text-sm hover:text-white/50"
          @click="$emit('onRemove', index)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      required: true,
    },

    listView: {
      type: Boolean,
      default: false,
    },
    placeHolder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
  },
  setup() {
    const hubCourse = useHubCoursesStore();
    const autoResizeTextarea = ref(null);

    const adjustHeight = () => {
      if (autoResizeTextarea.value) {
        autoResizeTextarea.value.style.height = 'auto';
        autoResizeTextarea.value.style.height = `${autoResizeTextarea.value.scrollHeight}px`;
      }
    };

    onMounted(() => {
      nextTick(() => {
        adjustHeight();
      });
    });

    return { hubCourse, autoResizeTextarea, adjustHeight };
  },
  data() {
    return {
      open: this.listView,
    };
  },
  computed: {
    goals() {
      if (this.type === 'Goal') {
        const { objectives } = this.hubCourse.detail;
        return objectives;
      } else {
        const { requirements } = this.hubCourse.detail;
        return requirements;
      }
    },
    length() {
      return this.goals[this.index]?.length || 0;
    },
  },
  watch: {
    listView: {
      handler() {
        this.open = this.listView;
      },
      immediate: true,
    },
  },
};
</script>
