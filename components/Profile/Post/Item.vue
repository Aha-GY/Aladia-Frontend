<template>
  <ProfileBox>
    <div class="mb-6 flex gap-3">
      <BaseAvatarNext
        :picture="item.owner.picture"
        size="md"
        :show-online="false"
      />
      <div class="flex h-12 w-0 flex-1 flex-col justify-between">
        <div class="text-xl font-semibold">
          {{ `${item?.owner?.firstName} ${item?.owner?.lastName}` }}
        </div>
        <div class="truncate text-sm leading-4 text-[#707070]">
          {{ formatDate(item?.createdAt, 'MMM DD YYYY, hh:mm a') }}
        </div>
      </div>
    </div>
    <div v-if="item.title" class="mb-4 font-bold">{{ item.title }}</div>
    <div ref="box" class="text-xs leading-5">
      <div
        style="word-break: break-word"
        class="chat-message text-sm leading-4 text-white/50"
        v-html="item?.content || ''"
      />
    </div>
    <div class="my-5 flex items-center gap-5">
      <img
        v-for="image in images"
        :key="image.fileId"
        class="mb-1 max-h-[18.75rem] max-w-[25rem] rounded object-cover"
        :src="image.url"
        loading="lazy"
      />
      <video
        v-for="video in videos"
        :key="video.fileId"
        :src="video.url"
        controls
        class="mb-1 max-h-[18.75rem] max-w-[25rem] rounded object-cover"
      />

      <!-- <div class="h-52 flex-1 rounded-md bg-white/80" />
      <div class="h-52 flex-1 rounded-md bg-white/80" />
      <div
        class="relative h-52 flex-1 overflow-hidden rounded-md bg-white/80"
      >
        <div
          class="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black/60 text-[3.125rem] font-extralight"
        >
          +4
        </div>
      </div> -->
    </div>

    <div class="flex items-center gap-8">
      <div class="w-0 flex-1 pt-6">
        <div class="flex items-center gap-3 border-t border-[#707070] pt-3">
          <BaseMemberPreview
            :max="5"
            width="2.25rem"
            :members="members"
            gap="0.3125rem"
          />
          <div
            class="flex h-9 flex-col justify-center text-xs leading-4 text-[#B1B2B1]"
          >
            <div>Millie August, Jonna Jurty</div>
            <div>
              and
              <span class="font-semibold">other 43 liked</span>
              the post
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex flex-col items-center gap-3">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
          >
            <i class="fa-light fa-heart" />
          </div>
          <div class="flex items-center gap-0.5 text-sm">
            <i class="fa-solid fa-heart" />
            {{ item.numberOf?.reactionsCount || 0 }}
          </div>
        </div>
        <div class="flex flex-col items-center gap-3">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
          >
            <i class="fa-light fa-comment" />
          </div>
          <div class="flex items-center gap-0.5 text-sm">
            <i class="fa-solid fa-comment" />
            {{ item.numberOf?.comments || 0 }}
          </div>
        </div>
        <div class="flex flex-col items-center gap-3">
          <div
            class="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
          >
            <i class="fa-light fa-share" />
          </div>
          <div class="flex items-center gap-0.5 text-sm">
            <i class="fa-solid fa-share" />
            {{ item.numberOf?.shares || 0 }}
          </div>
        </div>
      </div>
    </div>
  </ProfileBox>
</template>
<script>
import hljs from 'highlight.js';
import CopyButtonPlugin from 'highlightjs-copy';

export default {
  props: {
    item: Object,
  },
  data() {
    return {
      members: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
    };
  },
  computed: {
    images() {
      return (this.item.files || []).filter((r) =>
        r.metadata.mimetype.startsWith('image/'),
      );
    },
    videos() {
      return (this.item.files || []).filter((r) =>
        r.metadata.mimetype.startsWith('video/'),
      );
    },
  },
  mounted() {
    hljs.addPlugin(new CopyButtonPlugin());
    const syntaxs = this.$refs.box.querySelectorAll('.ql-syntax');
    for (let index = 0; index < syntaxs.length; index++) {
      const syntax = syntaxs[index];
      hljs.highlightElement(syntax);
    }
  },
};
</script>
