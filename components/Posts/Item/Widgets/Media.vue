<!-- 这是旧版的 Media 组件，已被 MediaCarousel.vue 取代 -->
<!-- TODO: 当 Post 卡片稳定后，删除本文件 -->

<template>
  <div>
    <!-- single -->
    <div v-if="medias.length === 1" class="my-2">
      <img
        v-if="medias[0].metadata.mimetype.includes('image')"
        :src="medias[0].url"
        :alt="$t('post.image')"
        class="h-auto max-h-[40rem] w-full cursor-pointer rounded-lg object-cover"
        @click="onMediaClick(medias[0].fileId)"
      />
      <PostsItemWidgetsPlayerPost
        v-if="medias[0].metadata.mimetype.includes('video')"
        :key="medias[0].fileId"
        :video="medias[0]"
      />
      <PostsItemWidgetsLoomItem
        v-if="medias[0].metadata.mimetype.includes('loom')"
        class="h-[18rem] w-full rounded-5"
        :class="commonHeight"
        :src="medias[0].url"
      />
      <PostsCreationLocationEditor
        v-if="medias[0].metadata.mimetype.includes('location')"
        :location-item="medias[0].location"
        :is-closable="false"
        :height="`!${commonHeight}`"
      />
    </div>

    <!-- Multiple -->
    <div
      v-else-if="medias.length > 1"
      :class="[
        'my-2 grid gap-4',
        medias.length === 3 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-2',
      ]"
    >
      <div
        v-for="(media, index) in medias.slice(0, 4)"
        :key="index"
        :class="[
          'relative',
          medias.length === 3 && index === 2 ? 'col-span-2' : '',
        ]"
      >
        <img
          v-if="media.metadata.mimetype.includes('image')"
          :src="media.url"
          :alt="$t('post.image')"
          :class="[
            'w-full cursor-pointer rounded-lg object-cover',
            commonHeight,
          ]"
          @click="onMediaClick(media.fileId)"
        />

        <PostsItemWidgetsPlayerPost
          v-if="media.metadata.mimetype.includes('video')"
          :key="media.fileId"
          :video="media"
          :custom-style="
            medias.length === 3 && index === 2
              ? customStyle('video') + ' h-auto'
              : customStyle('video')
          "
          :options="
            medias.length === 3 && index === 2
              ? {}
              : {
                  playbackRate: false,
                  aspectRatio: false,
                  setting: false,
                  pip: false,
                  fullscreenWeb: false,
                  miniProgressBar: false,
                }
          "
        />
        <PostsItemWidgetsLoomItem
          v-if="media.metadata.mimetype.includes('loom')"
          class="w-full rounded-5 object-cover"
          :class="commonHeight"
          :src="media.url"
        />
        <PostsCreationLocationEditor
          v-if="media.metadata.mimetype.includes('location')"
          :location-item="media.location"
          :is-closable="false"
          :height="`!${commonHeight}`"
        />

        <!-- more -->
        <div
          v-if="index === 3 && medias.length > 4"
          class="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black bg-opacity-50 text-2xl text-white"
          @click="onMediaClick(medias[3].fileId)"
        >
          +{{ medias.length - 4 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    medias: Array,
  },
  computed: {
    commonHeight() {
      const isFeed = this.$route.name.endsWith('feed');
      console.log('feed', isFeed);
      return isFeed ? 'h-[22rem]' : 'h-[24rem]';
    },
  },
  methods: {
    onMediaClick(id) {
      this.$emit('mediaClick', id);
    },
    customStyle(type) {
      let style = `${this.commonHeight} `;

      if (type === 'video') {
        if (this.medias.length === 2) {
          style += 'aspect-[4/5] w-[95%]';
          style += 'aspect-[4/5] w-[95%]';
        } else if (this.medias.length === 4) {
          style += 'aspect-[12/13]';
          style += 'aspect-[12/13]';
        }
      }
      return style;
    },
  },
};
</script>
