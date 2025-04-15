<template>
  <ProfileBox>
    <div class="mb-3 text-base font-medium text-[#B0B0B0]">
      {{ $t('personal.friends.title') }}
    </div>
    <div class="mb-2 flex items-center gap-1">
      <BaseInput v-model="name" search fixed placeholder="Search users" />
      <div
        class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-white/5"
      >
        <i class="fa-light fa-list-ul text-xs" />
      </div>
    </div>
    <div class="hide-scrollbar flex h-64 flex-col gap-1 overflow-y-auto">
      <div
        v-for="item in friends"
        :key="item.id"
        class="flex items-center gap-2 p-1.5"
      >
        <div class="h-9 w-9 rounded-full bg-white/80" />
        <div class="w-0 flex-1 truncate text-sm font-medium text-white">
          {{ item.name }}
        </div>
        <i
          class="fa-star text-[#D9D9D9]/80"
          :class="item.isFollower ? 'fa-solid' : 'fa-light'"
        />
      </div>
    </div>
  </ProfileBox>
</template>

<script>
export default {
  data() {
    return {
      friends: [
        { id: 1, name: 'Alena Curtis', isFollower: true },
        { id: 2, name: 'Corey Press', isFollower: false },
        { id: 3, name: 'Lindsey Stanton', isFollower: false },
        { id: 4, name: 'Angel Franci', isFollower: true },
        { id: 5, name: 'Gustavo Schleifer', isFollower: false },
      ],
      name: '',
    };
  },
};
</script>
