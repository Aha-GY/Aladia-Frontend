<template>
  <div
    class="absolute right-0 top-1.5 z-10 flex flex-col"
    :class="share ? 'overflow-visible' : 'overflow-hidden'"
  >
    <div
      class="absolute flex h-8 w-8 scale-100 cursor-pointer items-center justify-center rounded-md bg-gradient-to-b from-sky-800 to-black p-1 transition-all duration-300 hover:scale-110 active:scale-95"
      :class="share ? 'left-[1rem] opacity-100' : 'left-0 opacity-0'"
      data-cy="a1a1c42cd29b4d67"
      @click="onShare('facebook')"
    >
      <img src="~/assets/blank.png" />
    </div>
    <div
      class="absolute flex h-8 w-8 scale-100 cursor-pointer items-center justify-center rounded-md bg-gradient-to-b from-fuchsia-800 to-black p-1 transition-all duration-300 hover:scale-110 active:scale-95"
      :class="share ? 'left-[4rem] opacity-100' : 'left-0 opacity-0'"
      data-cy="70e2153efae05f20"
      @click="onShare('instagram')"
    >
      <img src="~/assets/blank.png" />
    </div>
    <div
      class="absolute flex h-8 w-8 scale-100 cursor-pointer items-center justify-center rounded-md bg-gradient-to-b from-green-800 to-black p-1 transition-all duration-300 hover:scale-110 active:scale-95"
      :class="share ? 'left-[7rem] opacity-100' : 'left-0 opacity-0'"
      data-cy="d4b06bef1e463f59"
      @click="onShare('whatsapp')"
    >
      <img src="~/assets/blank.png" />
    </div>
    <div
      class="absolute flex h-8 w-8 scale-100 cursor-pointer items-center justify-center rounded-md bg-black px-1 py-0.5 transition-all duration-300 hover:scale-110 active:scale-95"
      :class="share ? 'left-[10rem] opacity-100' : 'left-0 opacity-0'"
      data-cy="2404e6cade163b9a"
      @click="doCopy"
    >
      <i class="fa-solid fa-copy" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    share: Boolean,
  },
  computed: {
    name() {
      return this.$route.params.name;
    },
  },
  methods: {
    onShare() {
      this.$emit('onShare');
    },
    doCopy() {
      this.$emit('onShare');
      const url = `${location.origin}/courses/${this.name}`;
      this.$copyText(url).then(
        () => {
          this.$toast.success(this.$t('index.copy.success'));
        },
        () => {
          this.$toast.error(this.$t('index.copy.fail'));
        },
      );
    },
  },
};
</script>
