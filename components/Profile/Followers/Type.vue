<template>
  <div class="my-4 flex items-center justify-around gap-1.5 px-4">
    <div
      class="flex h-8 cursor-pointer items-center rounded-md px-2 transition-all active:scale-95"
      :class="
        modelValue === undefined || modelValue === ''
          ? 'text-[#FFF]'
          : 'border-transparent text-[#FFF]/50 hover:bg-white/5 hover:text-[#FFF]/70'
      "
      data-cy="9706e6718b2f255f"
      @click="$emit('update:modelValue', undefined)"
    >
      <div class="text-center text-xs">
        {{ $t('personal.friends.all') }}
      </div>
    </div>
    <div
      class="flex h-8 cursor-pointer items-center gap-1 rounded-md px-2 transition-all active:scale-95"
      :class="
        isUserTeacherSelected
          ? 'text-[#FFF]'
          : 'border-transparent text-[#FFF]/50 hover:bg-white/5 hover:text-[#FFF]/70'
      "
      data-cy="19b7dc2e7948767f"
      @click="$emit('update:modelValue', ['user', 'teacher'])"
    >
      <div
        class="flex h-6 w-6 items-center justify-center rounded-full bg-white/5"
      >
        <i class="fa-solid fa-user text-xs" />
      </div>
      <div class="text-xs">
        {{ $t('personal.friends.user.users') }}
      </div>
    </div>

    <div
      class="flex h-8 cursor-pointer items-center gap-1 rounded-md px-2 transition-all active:scale-95"
      :class="
        modelValue === 'organization'
          ? 'text-[#FFF]'
          : 'border-transparent text-[#FFF]/50 hover:bg-white/5 hover:text-[#FFF]/70'
      "
      data-cy="1523c91533fbe046"
      @click="$emit('update:modelValue', 'organization')"
    >
      <div
        class="flex h-6 w-6 items-center justify-center rounded-full bg-white/5"
      >
        <i class="fa-solid fa-user-group text-xs" />
      </div>
      <div class="text-xs">
        {{ $t('org.label') }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  computed: {
    // Check if the modelValue is equal to ['user', 'teacher']
    isUserTeacherSelected() {
      return (
        Array.isArray(this.modelValue) &&
        this.modelValue.includes('user') &&
        this.modelValue.includes('teacher')
      );
    },
  },
};
</script>
