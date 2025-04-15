<template>
  <div class="relative">
    <div class="bubble-editor ql-container ql-bubble ql-disabled">
      <div ref="editor" class="ql-editor ql-blank" v-html="body" />
    </div>
    <span class="hidden bg-[#a9a044]" />
  </div>
</template>

<script>
import hljs from 'highlight.js';
import CopyButtonPlugin from 'highlightjs-copy';

import { initLineNumbers } from '~/libs/highlightjs-line-numbers';

hljs.addPlugin(new CopyButtonPlugin());

export default {
  props: {
    body: String,
  },
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  data() {
    return {
      syntaxs: [],
    };
  },
  // watch: {
  //   'socialStore.answerTags'() {
  //     this.handleMention();
  //   },
  // },
  mounted() {
    this.handleSyntax();
    // this.handleMention();
  },
  methods: {
    async handleSyntax() {
      const editor = this.$refs.editor;
      this.syntaxs = editor.querySelectorAll('.ql-syntax');
      await this.$nextTick();
      const { lineNumbersBlock } = initLineNumbers();
      for (let index = 0; index < this.syntaxs.length; index++) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('relative');
        const syntax = this.syntaxs[index];
        syntax?.parentNode?.insertBefore(wrapper, syntax);
        wrapper.appendChild(syntax);
        hljs.highlightElement(syntax);
        lineNumbersBlock(syntax);
      }
    },
    // async handleMention() {
    //   const editor = this.$refs.editor;
    //   const tags = this.socialStore.answerTags;
    //   this.mentions = editor.querySelectorAll('.mention');
    //   await this.$nextTick();
    //   for (let index = 0; index < this.mentions.length; index++) {
    //     const mention = this.mentions[index];
    //     const find = tags.find((tag) => tag.username === mention.dataset.value);
    //     if (find) {
    //       mention.dataset.image = find.image || '';
    //       mention.dataset.username = find.username;
    //       mention.className =
    //         'inline-flex gap-1 items-center rounded p-0.5 pr-1 bg-[#a9a044] leading-none cursor-pointer mb-1 ml-0.5 tag';
    //       mention.innerHTML = `
    //         <img src="${find.image}" class="w-5 h-5 rounded object-cover" />
    //         <span class="text-black translate-y-px">${find.username}</span>
    //       `;
    //     }
    //   }
    // },
    onCopy(index) {
      const syntax = this.syntaxs[index];
      this.$copyText(syntax.innerText).then(() => {
        this.$toast.success(this.$t('index.copy.done'));
      });
    },
  },
};
</script>

<style lang="scss">
.bubble-editor {
  .ql-editor {
    padding: 0px;
    word-break: normal;
  }

  .ql-syntax {
    white-space: pre !important;
    color: #bbb !important;
    background-color: #1f1f1f !important;
    overflow-x: auto !important;
  }

  p,
  li {
    text-align: justify;
    word-break: normal;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
}

.question .bubble-editor .ql-syntax {
  max-width: calc(70vw - 16rem);
}

.answer .bubble-editor .ql-syntax {
  max-width: calc(70vw - 21rem);
}

.hljs-ln-numbers {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  text-align: center;
  color: #4e4e4e;
  border-right: 1px solid #4e4e4e;
  vertical-align: top;
  padding-right: 5px;
}

.hljs-ln-code {
  padding-left: 10px;
}

.hljs-copy-button {
  cursor: pointer;
  padding: 0 5px;
  font-size: 12px;
  background-color: #060606;
}
.ql-syntax.hljs.language-subunit,
.bubble-editor .ql-syntax {
  white-space: pre-wrap !important;
}
</style>
