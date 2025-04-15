<template>
  <div ref="box" class="relative">
    <div
      class="bubble-editor ql-container ql-bubble ql-disabled"
      data-cy="80cd5e467ccff236"
      @click.capture="handleUserClick"
    >
      <div ref="editor" class="ql-editor ql-blank" v-html="displayText" />
      <button
        v-if="needsToggle"
        class="toggle-button !text-[#E0B92C]"
        @click="toggleText"
      >
        {{ isExpanded ? $t('post.content.less') : $t('post.content.more') }}
      </button>
    </div>
  </div>
</template>

<script>
import hljs from 'highlight.js';
import CopyButtonPlugin from 'highlightjs-copy';

import { initLineNumbers } from '~/libs/highlightjs-line-numbers';

hljs.addPlugin(new CopyButtonPlugin());

export default {
  props: {
    body: {
      type: String,
      required: true,
    },
  },
  setup() {
    const profileStore = useProfileStore();
    return { profileStore };
  },
  data() {
    return {
      syntaxs: [],
      isExpanded: false,
      maxLength: 120,
    };
  },
  computed: {
    plainTextBody() {
      return this.body.replace(/<\/?[^>]+(>|$)/g, '');
    },
    displayText() {
      if (this.isExpanded || this.plainTextBody.length <= this.maxLength) {
        return this.body;
      }
      return `${this.body.slice(0, this.maxLength)}...`;
    },
    needsToggle() {
      return this.plainTextBody.length > this.maxLength;
    },
  },
  mounted() {
    this.handleSyntax();
  },
  methods: {
    toggleText() {
      this.$emit('expanded');
      this.isExpanded = !this.isExpanded;
    },
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
    handleUserClick(event) {
      const parent = this.$refs.box;
      let target = event.target;

      while (
        target &&
        target !== parent &&
        !target.classList.contains('mention')
      ) {
        target = target.parentElement;
      }

      if (target && target.getAttribute('data-denotation-char') === '@') {
        const dataId = target.getAttribute('data-id');
        this.profileStore.gotoProfile({
          id: dataId,
        });
      }
    },
  },
};
</script>

<style lang="scss">
.bubble-editor {
  .mention {
    cursor: pointer;
  }

  .ql-editor {
    padding: 0px;
    word-break: break-word;
    overflow-wrap: break-word;
    line-height: 20px;
    overflow: hidden;
    display: inline-block;
    position: relative;
  }

  .toggle-button {
    display: inline;
    background: none;
    border: none;
    margin: 0;
    padding: 0;
    color: #fafafa;
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
    white-space: nowrap;
  }

  .ql-syntax {
    white-space: pre-wrap;
    color: #bbb;
    word-break: break-word;
    overflow-wrap: break-word;
    background-color: #1f1f1f;
    overflow-x: auto;
  }

  p,
  li {
    text-align: justify;
    word-break: break-word !important;
    overflow-wrap: break-word !important;
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
  padding: 0px 12px 1.5px 8px;
  font-size: 12px;
  background-color: #060606;

  top: 10px;
  right: 5px;
}
.ql-syntax.hljs.language-subunit,
.bubble-editor .ql-syntax {
  white-space: pre-wrap !important;
}
</style>
