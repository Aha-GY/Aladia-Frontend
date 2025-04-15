<template>
  <div class="flex h-full w-60 flex-col justify-center">
    <div class="mb-1 text-sm text-[#707070]">Remaining money</div>
    <div class="text-3xl">{{ moneyFormat(1.1947, 0) }} €</div>
    <div class="mx-2 flex h-0 flex-1 items-center">
      <BaseMemberPreview
        class="origin-left scale-[1.2]"
        :add="false"
        :remove="false"
        :max="7"
        :length="teamMembersProfile.length"
        :members="teamMembersProfile"
      />
    </div>
    <div
      class="mx-2 flex items-center justify-between border-t border-[#707070] py-2"
    >
      <div class="text-lg text-[#E4B53D]">17 usages</div>
      <div class="text-xs text-[#707070]">from 24 January 2024</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      teamMembersProfile: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
      ],
    };
  },
};
</script>
