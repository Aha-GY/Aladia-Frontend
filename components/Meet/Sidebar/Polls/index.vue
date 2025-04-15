<template>
  <div
    class="flex h-full w-full flex-col gap-2.5 overflow-hidden rounded-5 border border-white/10 bg-[#060606]"
  >
    <MeetSidebarHeader title="Polls">
      <template #prefix>
        <div
          class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
          data-cy="b9d2658db64ff068"
          @click="onBack"
        >
          <i class="fa-regular fa-arrow-left text-lg text-[#FAFAFA]" />
        </div>
      </template>
    </MeetSidebarHeader>
    <div class="hide-scrollbar flex h-0 flex-1 flex-col gap-2 overflow-y-auto">
      <MeetSidebarPollsQuestion
        v-for="(item, index) in questions"
        :key="index"
        :index="index + 1"
        :all-len="questions.length"
        :item="item"
        :state="state"
        :voted="votedIds.includes(item.index)"
        @vote="onVote"
        @delete="onDelete(index)"
      />

      <div
        v-if="state === 'create'"
        class="flex cursor-pointer items-center gap-2 bg-[#0D0D0D] px-6 py-4 text-sm text-[#FAFAFA]"
        data-cy="262c40ec6464c7bb"
        @click="add"
      >
        <div class="flex h-6 w-6 cursor-pointer items-center justify-center">
          <i class="fa-regular fa-plus" />
        </div>
        {{ $t('meet.banner.poll.create') }}
      </div>
    </div>
    <div class="flex items-center p-4">
      <BaseButton
        label="$t:base.upload.cancel"
        type="tertiary"
        data-cy="c7d3bba9faa85853"
        @click="onBack"
      />

      <div class="flex w-0 flex-1 items-center justify-end gap-5">
        <BaseButton
          v-if="state === 'create' && isLaunch"
          :label="
            questions.length > 1
              ? '$t:flux.meet.launch.all'
              : '$t:flux.meet.launch.single'
          "
          :type="isLaunch ? 'Primary' : 'tertiary'"
          data-cy="8685dbd91cded32f"
          @click="onLaunch"
        />
        <BaseButton
          v-if="isSave && state === 'create'"
          label="$t:base.upload.save"
          :disabled="saveDisabled"
          data-cy="47fea49a593577f8"
          @click="onSave"
        />
        <BaseButton
          v-if="isCreatePeer && state !== 'stopped'"
          label="$t:flux.meet.poll.end"
          type="tertiary"
          data-cy="d0d5e2736fcc3864"
          @click="onEnd"
        />
        <BaseButton
          v-if="state === 'started'"
          label="$t:flux.header.vote"
          :disabled="!votes.length"
          data-cy="f0c4f7df5b3d243f"
          @click="onVoted"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { selectPollByID } from '@100mslive/hms-video-store';

import { hmsActions, hmsStore } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      questions: [
        {
          type: 'single-choice',
          text: '',
          options: [{ text: '' }, { text: '' }],
          isSave: false,
        },
      ],
      unsub1: null,
      poll: {},
      fetchedInitialResponses: false,
      state: 'create',
      votes: [],
      votedIds: [],
    };
  },
  computed: {
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    isSave() {
      return this.questions.some((item) => !item.isSave);
    },
    saveDisabled() {
      return (
        this.questions.some((item) => !item.text) ||
        this.questions.some((item) =>
          item.options.some((option) => !option.text),
        ) ||
        this.questions.some((item) => item.options.length < 2)
      );
    },
    isLaunch() {
      return (
        this.questions.length > 0 && this.questions.every((item) => item.isSave)
      );
    },
    isCreatePeer() {
      return this.poll.createdBy === this.hmsLocalPeer.id;
    },
  },
  created() {
    this.init();
  },
  unmounted() {
    if (this.unsub1) {
      this.unsub1();
    }
  },
  methods: {
    onBack() {
      this.hmsStore.openPopup = 'active';
    },
    init() {
      if (this.hmsStore.pollId) {
        this.unsub1 = hmsStore.subscribe((value) => {
          this.poll = value;
          this.state = value.state;
          this.questions = (value.questions || []).map((r) => ({
            ...r,
            isSave: true,
          }));
          if (!this.fetchedInitialResponses) {
            hmsActions.interactivityCenter.getPollResponses(value, true);
            this.fetchedInitialResponses = true;
          }
        }, selectPollByID(this.hmsStore.pollId));
      }
    },
    add() {
      this.questions.push({
        type: 'single-choice',
        text: '',
        options: [{ text: '' }, { text: '' }],
        isSave: false,
      });
    },
    onDelete(index) {
      this.questions.splice(index, 1);
    },
    async onLaunch() {
      if (!this.isLaunch) {
        return this.$toast.error(this.$t('meet.actions.save.question'));
      }
      try {
        const id = Date.now().toString();
        await hmsActions.interactivityCenter.startPoll({
          id,
          title: '',
          anonymous: false,
          rolesThatCanViewResponses: ['host', 'co-host'],
          type: 'poll', // or "quiz"
          questions: this.questions,
        });
        this.hmsStore.pollId = id;
        this.init();
      } catch (err) {
        this.$toast.error(`Failed to create poll - ${err.message}`);
      }
    },
    async onSave() {
      if (this.questions.some((item) => !item.text)) {
        return this.$toast.error(this.$t('meet.banner.poll.error.noQuestion'));
      }
      if (
        this.questions.some((item) =>
          item.options.some((option) => !option.text),
        )
      ) {
        return this.$toast.error(this.$t('meet.banner.poll.error.noOption'));
      }
      if (this.questions.some((item) => item.options.length < 2)) {
        return this.$toast.error(this.$t('meet.banner.poll.error.minOption'));
      }

      this.questions.forEach((item) => {
        item.isSave = true;
      });
    },
    onVote(index, option) {
      const _index = this.votes.findIndex(
        (item) => item.questionIndex === index,
      );
      if (_index === -1) {
        this.votes.push({ questionIndex: index, option });
      } else {
        this.votes[_index].option = option;
      }
    },
    async onVoted() {
      if (!this.votes.length) {
        return;
      }
      await hmsActions.interactivityCenter.addResponsesToPoll(
        this.hmsStore.pollId,
        this.votes,
      );
      this.votedIds.push(...this.votes.map((item) => item.questionIndex));
      this.votes = [];
    },
    async onEnd() {
      this.onVoted();
      await hmsActions.interactivityCenter.stopPoll(this.hmsStore.pollId);
    },
  },
};
</script>
