<template>
  <div class="flex w-full flex-col gap-1 pb-2">
    <div
      class="border-b border-[#707070] px-5 py-1 text-13 font-bold leading-5 text-[#707070]"
    >
      Titolo
    </div>
    <div class="hide-scrollbar max-h-[9.375rem] overflow-y-auto">
      <OrganizationHubCalendarHeaderSearchItem
        v-for="item in hubCalendarStore.calendarList"
        :key="item.id"
        :item="item"
        @on-change="onChange"
      />
    </div>
    <div
      class="border-b border-[#707070] px-5 py-1 text-13 font-bold leading-5 text-[#707070]"
    >
      Persone
    </div>
    <div class="hide-scrollbar max-h-[11.25rem] overflow-y-auto">
      <OrganizationHubCalendarHeaderSearchItem
        v-for="item in personeListFilter"
        :key="item.id"
        :item="item"
        @on-change="onChange"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    searchValue: String,
    onChange: Function,
  },
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    return { hubCalendarStore };
  },
  data() {
    return {
      titoloList: [
        { id: 1, name: 'Abilità Logica', color: '#9747FF' },
        { id: 2, name: 'Anatomia', color: '#0478ED' },
        { id: 3, name: 'Assignment Method', color: '#E4B53D' },
        { id: 4, name: 'Assistenza Medica', color: '#E63030' },
        { id: 5, name: 'Astronomia', color: '#1F6A57' },
      ],
      personeList: [
        {
          id: 1,
          name: 'Arol Deep',
          src: 'https://storage.googleapis.com/testing_uploads/Harvey.jpeg',
        },
        {
          id: 2,
          name: 'Ann Siphron',
          src: 'https://storage.googleapis.com/testing_uploads/Harvey.jpeg',
        },
        {
          id: 3,
          name: 'Amanda Herwitz',
          src: 'https://storage.googleapis.com/testing_uploads/Harvey.jpeg',
        },
        {
          id: 4,
          name: 'Aria Ekstrom Bothman',
          src: 'https://storage.googleapis.com/testing_uploads/Harvey.jpeg',
        },
        {
          id: 5,
          name: 'Ahmad Septimus',
          src: 'https://storage.googleapis.com/testing_uploads/Harvey.jpeg',
        },
        {
          id: 6,
          name: 'Charlie Asminoff',
          src: 'https://storage.googleapis.com/testing_uploads/Harvey.jpeg',
        },
      ],
    };
  },
  computed: {
    calendarList() {
      return this.hubCalendarStore.calendarList;
    },
    titoloListFilter() {
      return this.titoloList.filter((r) =>
        r.name.toLowerCase().includes(this.searchValue.toLowerCase()),
      );
    },
    personeListFilter() {
      return this.personeList.filter((r) =>
        r.name.toLowerCase().includes(this.searchValue.toLowerCase()),
      );
    },
  },
};
</script>
