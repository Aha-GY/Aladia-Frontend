<template>
  <div
    id="reply-social"
    ref="reply"
    class="hide-scrollbar relative z-10 overflow-auto pr-8 transition-all duration-300"
    :class="{
      'mb-0 max-h-[2.5rem] min-h-[2.5rem] translate-y-0 pt-0.5':
        socialStore.answerReplying && collapse,
      'mb-0 max-h-48 min-h-[2.5rem] translate-y-0 pt-0.5':
        socialStore.answerReplying && !collapse,
      'pointer-events-none -mb-5 max-h-[2.5rem] translate-y-2 pt-0':
        !socialStore.answerReplying,
    }"
  >
    <QuillEditor
      ref="editor"
      :content="socialStore.answer.body"
      theme="snow"
      content-type="html"
      class="reply-editor"
      :placeholder="$t('flux.message.write')"
      :options="options"
      @ready="onReady"
      @focus="onFocus"
      @update:content="onInput"
      @text-change="handleTextChange"
    />
    <SocialCommentsInputAttachment />
  </div>
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill';
import hljs from 'highlight.js';

import {
  mentionBlotName,
  registerQuillMention,
} from '~/libs/register-quill-mention';

export default {
  components: {
    QuillEditor,
  },
  props: {
    tagType: {
      type: String,
      default: 'global',
    },
  },
  setup() {
    registerQuillMention();
    const socialStore = useSocialStore();
    const globalStore = useGlobalStore();
    return { globalStore, socialStore };
  },
  data() {
    return {
      editor: null,
      tagUserIds: [],
      options: {
        modules: {
          toolbar: [
            'bold',
            'italic',
            'underline',
            'strike',
            { list: 'ordered' },
            {
              list: 'bullet',
            },
            'blockquote',
            'code-block',
          ],
          syntax: {
            highlight: (text) => hljs.highlightAuto(text).value,
          },
          keyboard: {
            bindings: {
              enter: {
                key: 13,
                handler: () => {
                  this.$emit('onEnter');
                  return false;
                },
              },
              custom: {
                key: 13,
                shortKey: true,
                handler: (range) => {
                  this.editor?.getQuill().insertText(range.index, '\n');
                  return false;
                },
              },
            },
          },
          mention: {
            allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
            mentionDenotationChars: ['@'],
            positioningStrategy: 'fixed',
            renderItem: (item) => {
              const el = document.createElement('div');
              el.className = 'flex items-center gap-2.5';
              if (item.picture) {
                el.innerHTML = `<img src="${item.picture}" class="w-8 h-8 rounded-full object-cover"/>`;
              } else {
                el.innerHTML = `<div class="w-8 h-8 flex items-center justify-center rounded-full bg-[#4F4F4F]"><i class="fa fa-user text-sm text-white/30" /></div>`;
              }
              el.innerHTML += `<span>${item.fullName}</span>`;
              return el;
            },
            source: debounce(async (searchTerm, renderList) => {
              const api = {
                global: this.globalStore.searchProfile,
              }[this.tagType];

              const { data } = await api({
                limit: 50,
                text: searchTerm || undefined,
              });

              // this.members = [...this.members, ...data].filter(
              //   (item) => !this.exclude.includes(item.id),
              // );
              renderList(
                data.filter(
                  (r) =>
                    ![this.$route.params.name, ...this.tagUserIds].includes(
                      r.id,
                    ),
                ),
              );
            }, 200),
            dataAttributes: ['id', 'fullName'],
            blotName: mentionBlotName,
          },
        },
      },
    };
  },
  computed: {
    // question() {
    //   return this.courseStore.qaPopup;
    // },
    // answerTo() {
    //   return this.courseStore.answerTo;
    // },
    collapse() {
      return this.socialStore.answerCollapse;
    },
  },
  watch: {
    async 'socialStore.answerFiles.length'(length) {
      if (length) {
        await sleep(200);
        this.socialStore.answerReplying = true;
        this.socialStore.answerCollapse = false;
        this.$refs.reply.scrollTo({
          top: this.$refs.reply.scrollHeight,
          behavior: 'smooth',
        });
      }
    },
    'socialStore.answerReplying'(state) {
      if (state) {
        window['answer-quill']?.focus?.();
      } else {
        this.editor?.setHTML?.('');
      }
    },
    'socialStore.answerSending'(state) {
      if (!state) {
        this.editor?.setHTML?.('');
      }
    },
    'socialStore.answer.body'(val) {
      if (!val || val === '<p><br></p>') {
        this.editor?.setHTML?.('');
        this.socialStore.answer.body = '';
      }
    },
  },
  methods: {
    onReady() {
      this.editor = this.$refs.editor;
      const quill = this.$refs.editor.getQuill();
      window['answer-quill'] = quill;

      quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
        const ops = [];
        delta.ops.forEach((op) => {
          if (op.insert && typeof op.insert === 'string') {
            ops.push({
              insert: op.insert,
            });
          }
        });
        delta.ops = ops;
        return delta;
      });

      document
        .querySelector('#reply-toolbar')
        ?.appendChild(document.querySelector('#reply-social .ql-toolbar'));
    },
    onFocus() {
      this.socialStore.answerCollapse = false;
    },
    async addTag() {
      const quill = this.$refs.editor.getQuill();
      quill.focus();
      const index = quill.getSelection().index;
      if (index > -1) {
        quill.insertText(index, '@');
      }
    },
    onInput() {
      const text = this.editor.getHTML();
      this.socialStore.answer.body = text;
      this.$emit('update:modelValue', text);
    },
    handleTextChange() {
      const rawContents = this.editor.getHTML();
      const regex = /data-id="([^"]*)"/g;
      let matches;
      const dataIds = [];
      while ((matches = regex.exec(rawContents)) !== null) {
        dataIds.push(matches[1]);
      }
      this.tagUserIds = dataIds;
      this.socialStore.answerMention = dataIds;
      this.$emit('onTagUsers', dataIds);
    },
  },
};
</script>

<style lang="scss">
#reply-social {
  .ql-editor {
    padding: 0px;
    word-break: break-all;
  }

  .ql-blank::before {
    left: 0 !important;
    font-style: normal;
    font-size: 13px;
    color: rgb(255 255 255 / 50%) !important;
  }

  .ql-container.ql-snow {
    border: none;
  }

  .ql-syntax {
    color: #bbb !important;
    background-color: #191919 !important;
  }
}
</style>
