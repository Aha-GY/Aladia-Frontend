<template>
  <div class="w-40 overflow-hidden rounded bg-white/10">
    <div v-if="item.type === 'auto-post'">
      <img
        v-if="item.subType === 'joined-platform'"
        src="~/assets/social/autopost/join.png"
        class="aspect-video w-full object-contain"
      />
      <img
        v-if="item.subType === 'became-teacher'"
        src="~/assets/social/autopost/be-teacher.png"
        class="aspect-video w-full object-contain"
      />
      <img
        v-if="item.subType === 'published-course' && entity?.thumbnail?.url"
        :src="entity.thumbnail.url"
        class="aspect-video w-full object-cover"
      />
      <img
        v-if="item.subType === 'enrolled-course' && entity?.thumbnail?.url"
        :src="entity.thumbnail.url"
        class="aspect-video w-full object-cover"
      />
      <img
        v-if="item.subType === 'started-new_role'"
        src="~/assets/social/autopost/new-role.png"
        class="aspect-video w-full object-contain"
      />
      <img
        v-if="item.subType === 'one-year-anniversary'"
        src="~/assets/social/autopost/one-year-anniversary.png"
        class="aspect-video w-full object-contain"
      />
      <img
        v-if="item.subType === 'graduation'"
        src="~/assets/social/autopost/celebrating-graduation.png"
        class="aspect-video w-full object-contain"
      />
      <img
        v-if="item.subType === 'earned-certification'"
        src="~/assets/social/autopost/new-certification.png"
        class="aspect-video w-full object-contain"
      />
    </div>
    <div v-else>
      <img
        v-if="entity?.thumbnail?.url"
        :src="entity.thumbnail.url"
        class="aspect-video w-full object-cover"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  computed: {
    entity() {
      return this.item.entity;
    },
  },
};
</script>
