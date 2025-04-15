<template>
  <NuxtLink
    :to="to"
    class="group relative flex h-full items-center justify-center gap-2 px-6 py-2"
    @click="handleClick()"
  >
    <div
      class="font-meduim flex cursor-pointer items-center justify-center gap-2 transition-all active:scale-95"
      :class="active ? 'text-[#F7C02B]' : 'text-[#B0B0B0]'"
    >
      <i class="fa-solid" :class="icon" />
      {{ $t(label) }}
    </div>
    <div
      class="pointer-events-none absolute flex h-10 w-24 justify-center overflow-y-hidden"
    >
      <div
        class="h-16 w-16 translate-y-3 scale-125 scale-y-[0.25] rounded-full blur transition-all duration-300"
        :class="
          active ? 'bg-[#F7C02B]' : 'bg-white opacity-0 group-hover:opacity-40'
        "
      />
    </div>
  </NuxtLink>
</template>

<script>
export default {
  props: {
    title: String,
    label: {
      type: String,
      default: '',
    },
    icon: String,
  },
  setup() {
    const authStore = useAuthStore();
    const hubPaymentStore = useHubPaymentStore();
    return { authStore, hubPaymentStore };
  },
  computed: {
    name() {
      let name = this.title;
      if (this.title === 'Q&A') {
        name = 'qa';
      } else if (this.title === 'Marketplace') {
        name = 'courses';
      }
      return name.toLowerCase();
    },
    to() {
      if (this.name === 'courses') {
        return `/marketplace`;
      } else {
        return `${this.authStore.hub}/${this.name}`;
      }
    },
    active() {
      const path = this.$route.name.replace(/.*-hub-name(-)?/, '');
      return path === this.name;
    },
  },
  methods: {
    handleClick() {
      // 执行`reset`操作
      if (this.name === 'payment') {
        this.hubPaymentStore.reset();
      }
    },
  },
};
</script>
