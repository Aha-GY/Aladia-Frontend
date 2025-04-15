<template>
  <div
    v-if="username"
    class="flex h-full w-full flex-col items-center justify-center gap-3"
  >
    <i class="fa-light fa-magnifying-glass text-[4rem]" />
    <div class="text-center text-base font-medium">
      No matching users found.
    </div>
    <div class="text-center text-sm font-light">
      You can invite unregistered users using a valid email.
    </div>
  </div>
  <div
    v-else
    class="flex h-full w-full flex-col items-center justify-center gap-3"
  >
    <i class="fa-light fa-user-plus text-[4rem]" />
    <div class="text-center text-base font-medium">
      Start by inviting members
      <br />
      to join your {{ type }}.
    </div>
    <div class="text-center text-sm font-light">
      You can also invite unregistered users
      <br />
      by entering their valid email addresses
      <br />
      or by sending an invitation link.
    </div>
  </div>
</template>

<script>
export default {
  props: {
    username: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: '',
    },
  },
};
</script>
