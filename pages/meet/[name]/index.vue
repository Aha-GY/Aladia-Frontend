<template>
  <NuxtLayout name="empty">
    <Head>
      <Title>{{ $t('event.meet.label') }}</Title>
    </Head>
    <div class="h-screen w-screen">
      <Meet :room-id="roomId" />
    </div>
  </NuxtLayout>
</template>

<script>
export default {
  setup() {
    const route = useRoute();
    const hmsStore = useHmsStore();

    if (route.params.name?.length !== 24) {
      showError({
        statusCode: 404,
        statusMessage: `${(this, $t('event.meet.notFound'))}: ${route.params.name}`,
      });
    }

    return { hmsStore };
  },
  data() {
    return {
      roomId: null,
    };
  },
  beforeMount() {
    this.init();
  },
  methods: {
    init() {
      this.roomId = this.$route.params.name;
    },
  },
};
</script>
