<template>
  <div class="flex flex-col gap-2 p-2">
    <div class="mb-1 text-xs text-[#707070]">
      {{ $t('org.edit.replicate.content') }}
    </div>

    <!-- <div
      class="flex items-center gap-2 rounded-md px-3 py-2.5 transition-all"
      :class="actions.length === 0 ? 'bg-white/5' : 'hover:bg-white/5'"
    >
      <BaseCheckboxStyle
        class="mx-3"
        :state="actions.length === 0 ? 'checked' : 'unchecked'"
        @click="onAll" data-cy="9321225b84990c8a"/>
      <div class="text-xs">Select All</div>
    </div> -->

    <div class="overflow-hidden rounded-md">
      <BaseCheckboxList
        icon="fa-border-all"
        name="base.editor.selectAll"
        :active="actions.length === 0"
        @change="onAll"
      />
      <BaseCheckboxList
        v-for="item in dataList"
        :key="item.value"
        :icon="item.icon"
        :name="item.label"
        :data-cy="`${item.value}-data-list`"
        :active="!actions.includes(item.value)"
        @change="onChange(item)"
      />
      <!-- <div
        v-for="item in dataList"
        :key="item.id"
        class="flex items-center gap-2 border-b border-[#565656] px-3 py-2.5 transition-all last:border-b-0"
        :class="
          !actions.includes(item.value) ? 'bg-white/5' : 'hover:bg-white/5'
        "
      >
        <BaseCheckboxStyle
          class="mx-3"
          :state="!actions.includes(item.value) ? 'checked' : 'unchecked'"
          @click="onChange(item)" data-cy="583947692b78dc12"/>
        <div class="text-xs">{{ item.label }}</div>
      </div> -->
    </div>
    <div class="flex items-center justify-between gap-5 py-2">
      <BaseButton
        label="$t:base.upload.cancel"
        type="secondary"
        data-cy="c27905251977d716"
        @click="onClose"
      />
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 hover:bg-[#181818] hover:text-white active:scale-95"
        data-cy="cdfd62b06ca35826"
        @click="onSave"
      >
        <i class="fa-light fa-save text-base" />
        {{ $t('base.upload.save') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubEvent = useHubEventStore();
    return { hubEvent };
  },
  data() {
    return {
      dataList: [
        {
          id: 1,
          label: 'org.room.live',
          value: 'live',
          icon: 'fa-video-plus',
        },
        {
          id: 2,
          label: 'org.room.onPremise',
          value: 'onPremise',
          icon: 'fa-location-dot',
        },
        {
          id: 3,
          label: 'org.room.description',
          value: 'description',
          icon: 'fa-align-left',
        },
        {
          id: 4,
          label: 'org.room.attachments',
          value: 'attachments',
          icon: 'fa-link',
        },
        {
          id: 5,
          label: 'org.room.frequency',
          value: 'frequency',
          icon: 'fa-rotate',
        },
      ],
      actions: [],
    };
  },
  computed: {
    event() {
      return this.hubEvent.event;
    },
    resetFields() {
      return this.event.resetFields;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.actions = [...this.resetFields];
    },
    onChange(item) {
      const index = this.actions.indexOf(item.value);
      if (index === -1) {
        this.actions.push(item.value);
      } else {
        this.actions.splice(index, 1);
      }
    },
    onAll() {
      if (this.actions.length === 0) {
        this.actions.push(...this.dataList.map((r) => r.value));
      } else {
        this.actions.splice(0, this.actions.length);
      }
    },
    onClose() {
      this.actions = [...this.resetFields];
      this.$emit('close');
    },
    onSave() {
      this.event.resetFields = [...this.actions];
      this.$emit('save');
    },
  },
};
</script>
