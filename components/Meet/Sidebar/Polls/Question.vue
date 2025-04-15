<template>
  <div class="flex flex-col gap-4 bg-[#0D0D0D] px-6 py-4 text-[#FAFAFA]">
    <div class="flex items-center gap-2.5">
      <div class="flex w-0 flex-1 items-center gap-2 text-sm font-semibold">
        {{
          $t('meet.banner.poll.label', {
            index: index,
            total: allLen,
          })
        }}
        <div
          v-if="item.isSave"
          class="flex h-6 items-center justify-center gap-1.5 rounded-5 px-1 text-xs font-medium"
          :class="stateClass"
        >
          <i v-if="stateName === 'meet.draft'" class="fa-regular fa-edit" />
          {{ $t(stateName) }}
        </div>
      </div>

      <BaseButton
        v-if="state === 'create' && item.isSave"
        label="$t:base.editor.edit"
        type="tertiary"
        data-cy="65c5ec423f63c9e8"
        @click="item.isSave = false"
      />
      <div
        v-if="state === 'create'"
        class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
        data-cy="3e0246122afa4d3f"
        @click="$emit('delete')"
      >
        <i class="fa-regular fa-trash text-base text-[#FAFAFA]" />
      </div>
    </div>

    <div v-if="!item.isSave" class="flex flex-col gap-2 text-sm">
      <BaseInput
        v-model="item.text"
        :title="$t('course.question.ask')"
        class="mb-2 pl-1"
      />
      <div
        v-for="(option, idx) in item.options"
        :key="idx"
        class="flex items-end gap-1"
      >
        <div
          class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
          data-cy="1baff618cbcb1f10"
          @click="item.options.splice(idx, 1)"
        >
          <i class="fa-regular fa-circle-minus text-xs" />
        </div>
        <BaseInput v-model="option.text" :title="`Option ${idx + 1}`" />
      </div>
      <div class="my-2 flex items-center gap-2">
        <div
          class="flex cursor-pointer items-center rounded-5 py-1 pr-1.5 text-sm hover:bg-white/5"
          data-cy="6cc9c0314a95aa15"
          @click="add"
        >
          <div class="flex h-6 w-6 cursor-pointer items-center justify-center">
            <i class="fa-regular fa-plus" />
          </div>
          {{ $t('meet.banner.quiz.addOption') }}
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col gap-4">
      <div class="flex h-9 items-center text-sm">{{ item.text }}</div>
      <div
        v-for="(option, idx) in item.options"
        :key="idx"
        class="flex items-center gap-2 text-sm"
      >
        <BaseCheckboxStyle
          v-if="state !== 'create'"
          :state="radio === option.index ? 'checked' : 'unchecked'"
          :disabled="isVoted || state === 'stopped'"
          data-cy="6f2e2f5d2e733db9"
          @click="onVote(item.index, option.index)"
        />
        <div class="flex w-0 flex-1 flex-col gap-2">
          <div class="flex items-center justify-between leading-4">
            {{ option.text }}
            <div v-if="state !== 'create'" class="flex items-center gap-2">
              {{ option.voteCount || 0 }} votes
              <div v-if="isLocalPeerAnswered(option)" class="text-[#707070]">
                ({{ $t('meet.banner.poll.answer.yours') }})
              </div>
            </div>
          </div>
          <div class="relative h-2 w-full rounded-full bg-[#303030]">
            <div
              v-if="state !== 'create'"
              class="absolute left-0 top-0 h-2 rounded-full bg-[#E0B92C]"
              :style="{
                width: (option.voteCount / voteTotal) * 100 + '%',
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      default: 0,
    },
    allLen: {
      type: Number,
      default: 0,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    actions: {
      type: Array,
      default: () => [],
    },
    state: {
      type: String,
      default: '',
    },
    voted: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      radio: null,
      initVoted: false,
    };
  },
  computed: {
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    voteTotal() {
      return this.item?.result?.totalResponses || 0;
    },
    isVoted() {
      return this.voted || this.initVoted;
    },
    stateName() {
      if (this.state === 'started') {
        return 'meet.live';
      } else if (this.state === 'stopped') {
        return 'meet.ended';
      } else {
        return 'meet.draft';
      }
    },
    stateClass() {
      if (this.state === 'started') {
        return 'bg-[#022C22] text-[#86EFAC]';
      } else if (this.state === 'stopped') {
        return 'bg-[#262626] text-[#D4D4D4]';
      } else {
        return 'bg-[#7373734D] text-[#D4D4D4]';
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await sleep(300);
      const responses = (this.item?.responses || []).find(
        (response) =>
          response.questionIndex === this.item.index &&
          response.peer.peerid === this.hmsLocalPeer.id,
      );

      if (responses) {
        if (this.item.type === 'single-choice') {
          this.radio = responses?.option;
        }
        this.initVoted = true;
      }
    },
    add() {
      this.item.options.push({
        text: '',
      });
    },
    onVote(index, optionIndex) {
      if (this.isVoted || this.state === 'stopped') {
        return;
      }
      this.radio = optionIndex;
      this.$emit('vote', index, optionIndex);
    },
    isLocalPeerAnswered(option) {
      if (this.item.type === 'single-choice') {
        return option.index === this.radio;
      }
    },
  },
};
</script>
