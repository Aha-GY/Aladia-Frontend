<template>
  <div class="flex flex-col gap-6 px-3 py-2">
    <div class="flex items-center justify-between">
      <div class="text-base font-medium text-[#D9D9D9]/80">
        {{ $t('filter.all.spaces') }}
      </div>
      <BaseInput
        v-model="name"
        fixed
        search
        clear
        class="!w-80"
        :placeholder="$t('flux.search.space')"
      />
    </div>

    <div
      class="hide-scrollbar flex h-60 flex-col gap-2 overflow-y-auto text-xs transition-all duration-300"
    >
      <OrganizationHubHeaderSpace
        v-for="space in spaces"
        :key="space.id"
        :item="space"
        :actions="actions"
        :change="onChange"
      />
    </div>

    <div class="flex items-center justify-end gap-3">
      <BaseButton
        type="secondary"
        class="px-4"
        label="$t:base.upload.cancel"
        data-cy="fa09c50a203f784d"
        @click="$emit('close')"
      />
      <BaseButton
        icon="fa-solid fa-circle-check"
        class="px-4"
        label="$t:base.upload.apply"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      actions: [],
      spaces: [
        {
          id: 1,
          name: 'space1',
          children: [
            {
              id: 2,
              name: 'folder1',
              isFolder: true,
              courses: [
                { id: 3, name: 'course1', isCourse: true },
                { id: 4, name: 'course2', isCourse: true },
                { id: 5, name: 'course3', isCourse: true },
              ],
            },
            { id: 6, name: 'course5', isCourse: true },
            { id: 7, name: 'course6', isCourse: true },
          ],
        },
        {
          id: 8,
          name: 'space2',
          children: [
            {
              id: 9,
              name: 'folder2',
              isFolder: true,
              courses: [
                { id: 10, name: 'course1', isCourse: true },
                { id: 11, name: 'course2', isCourse: true },
                { id: 12, name: 'course3', isCourse: true },
              ],
            },
            { id: 13, name: 'course5' },
            { id: 14, name: 'course6' },
          ],
        },
      ],
    };
  },
  methods: {
    onChange(id) {
      console.log(id);
      if (this.actions.includes(id)) {
        this.actions = this.actions.filter((item) => item !== id);
      } else {
        this.actions.push(id);
      }
    },
  },
};
</script>
