<template>
  <BaseEditorPopup :show="showPopup" :location="toolbarLocation">
    <BaseEditorToolbar :id="name + '-toolbar'" @close="onCloseToolbar" />
  </BaseEditorPopup>
  <div class="flex-1">
    <div
      ref="editorContainer"
      class="quill-editor h-80 overflow-auto overscroll-contain whitespace-pre-wrap"
      :class="[editorClass, type === 'line' ? 'max-h-[15rem]' : '']"
      :style="{
        wordBreak: 'break-word',
        height: type === 'area' || type === 'textarea' ? areaHeight : '',
        maxHeight: type === 'area' || type === 'textarea' ? maxAreaHeight : '',
      }"
      :data-cy="`${dataCy}-quill-editor-textarea`"
      @dblclick="onDblclick"
      @click="onClick"
    />
  </div>
</template>

<script>
import hljs from 'highlight.js';
import Quill from 'quill';
import mention from 'quill-mention';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import { SlashModule } from './Slash/index.js';
import './Slash/index.css';

window.Quill = Quill;
export const mentionBlotName = 'styled-mention';

export default {
  props: {
    name: {
      type: String,
      default: 'quill-editor',
    },
    areaHeight: {
      type: String,
      default: '20rem',
    },
    editorClass: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'line', // line, area,textarea
    },
    modelValue: {
      type: String,
      default: '',
    },
    enable: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    autoFocus: {
      type: Boolean,
      default: true,
    },
    getTagList: {
      type: Function,
    },
    dataCy: {
      type: String,
      default: 'default',
    },
    limitCharacter: {
      type: Boolean,
      default: false,
    },
    charactersLimit: {
      type: Number,
      default: 63206,
    },
    maxAreaHeight: {
      type: String,
      default: '',
    },
    enterToSave: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'update:modelValue',
    'ready',
    'send',
    'change',
    'tag',
    'focus',
    'text',
  ],
  setup() {
    const MentionBlot = Quill.import('blots/mention');
    class StyledMentionBlot extends MentionBlot {
      static blotName = mentionBlotName;

      static render(data) {
        const anchor = document.createElement('span');
        anchor.innerText = data.fullName;
        return anchor;
      }

      static create(data) {
        const node = super.create(data);
        node.contentEditable = 'false';
        return node;
      }
    }
    window.Quill.register('modules/slash', SlashModule);

    window.Quill.register({
      'modules/mention': mention,
      'blots/mention': StyledMentionBlot,
    });
  },
  data() {
    return {
      quill: null,
      tagUserIds: [],
      showPopup: false,
      optionsLocation: {
        x: 0,
        y: 0,
      },
      toolbarLocation: {
        left: 0,
        top: 0,
        right: 0,
      },
      selection: null,
    };
  },
  watch: {
    modelValue(newValue, oldValue) {
      if (this.quill && newValue !== this.quill.root.innerHTML) {
        this.quill.root.innerHTML = newValue;
      }
      if (this.stripHtmlTags(oldValue) && !this.stripHtmlTags(newValue)) {
        this.showPopup = false;
      }
    },
    enable(newValue) {
      if (this.quill) {
        if (newValue) {
          this.quill.enable();
        } else {
          this.quill.disable();
        }
      }
    },
  },
  mounted() {
    this.initQuill();
  },
  beforeUnmount() {
    this.closeSlashPopup();
  },
  methods: {
    closeSlashPopup() {
      const slashModule = this.quill.getModule('slash');
      if (slashModule && slashModule.container) {
        slashModule.container.style.display = 'none';
      }
    },
    stripHtmlTags(html) {
      return html.replace(/<[^>]*>/g, '');
    },
    isCursorInFormat(formatting) {
      const range = this.quill.getSelection();
      if (range) {
        const format = this.quill.getFormat(range);
        return format[formatting] === true;
      }
      return false;
    },
    initQuill() {
      const defaultOptions = {
        theme: 'snow',
        modules: {
          slash: true,
          toolbar: {
            container: `#${this.name}-toolbar`,
            handlers: {
              'code-block'(value) {
                // 基础行为：格式化为代码块 / 取消代码块
                this.quill.format('code-block', value);
                // 以下操作仅在格式化为代码块时执行
                if (!value) {
                  return;
                }
                // 获取当前选区
                const selection = this.quill.getSelection();
                if (!selection) {
                  return;
                }
                // 获取当前代码块（无论代码块包含多少行代码，都算一行）
                const [codeBlock] = this.quill.getLine(selection.index);
                // 检查代码块后是否有其他元素
                const nextLine = codeBlock.next;
                if (nextLine) {
                  // 如果有后续元素，将光标移动到该元素的开头
                  this.quill.setSelection(nextLine.offset(), 0);
                } else {
                  // 如果没有后续元素，在代码块后插入空段落
                  const codeBlockIndex = codeBlock.offset();
                  const codeBlockLength = codeBlock.length();
                  this.quill.insertText(codeBlockIndex + codeBlockLength, '\n');
                  this.quill.setSelection(
                    codeBlockIndex + codeBlockLength + 1,
                    0,
                  );
                }
              },
            },
          },
          syntax: {
            highlight: (text) => hljs.highlightAuto(text).value,
          },
          keyboard: {
            bindings: {
              enter: {
                key: 13,
                handler: () => {
                  if (this.showPopup) {
                    this.showPopup = false;
                    return false;
                  }
                  if (
                    this.quill.getModule('slash').container.style.display ===
                    'block'
                  ) {
                    return false;
                  }
                  // 允许在代码块中按回车换行
                  if (this.isCursorInFormat('code-block')) {
                    return true;
                  }
                  if (!this.enterToSave) {
                    return true;
                  }
                  this.$emit('send');
                  return false;
                },
              },
              backsapce: {
                key: 8,
                handler: (range) => {
                  const [line] = this.quill.getLine(range.index);
                  if (line.length() === 1) {
                    if (this.isCursorInFormat('header')) {
                      this.quill.format('header', false);
                      this.quill.setSelection(range.index, 0);
                      return false;
                    }
                    // if (this.isCursorInFormat('code-block')) {
                    //   this.quill.format('code-block', false);
                    //   this.quill.setSelection(range.index, 0);
                    //   return true;
                    // }
                    // this.quill.removeFormat(range.index, 1);
                  }
                  return true;
                },
              },
              custom: {
                key: 13,
                shortKey: true,
                handler: (range) => {
                  this.quill.insertText(range.index, '\n');
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
              el.className = 'flex items-center flex-1 truncate gap-2.5';
              if (item.image) {
                el.innerHTML = `<img src="${item.image}" class="w-8 h-8 rounded-full object-cover"/>`;
              } else {
                el.innerHTML = `<div class="w-8 h-8 flex flex-shrink-0 items-center justify-center rounded-full bg-[#4F4F4F]"><i class="fa fa-user text-sm text-white/30" /></div>`;
              }
              el.innerHTML += `<span class='truncate w-full'>${item.fullName}</span>`;
              return el;
            },
            source: debounce(async (searchTerm, renderList) => {
              if (!this.getTagList) {
                return;
              }
              const data = await this.getTagList(searchTerm);
              if (!data) {
                return;
              }

              renderList(
                data.filter(
                  (r) =>
                    ![this.$route.params.name, ...this.tagUserIds].includes(
                      r.id,
                    ),
                ),
              );
            }, 200),
            dataAttributes: ['id', 'fullName', 'isOnline', 'role', 'type'],
            blotName: mentionBlotName,
          },
        },
        placeholder: this.$t('calendar.desc.placeholder'),
      };

      const options = { ...defaultOptions, ...this.options };

      const quill = new window.Quill(this.$refs.editorContainer, options);

      this.quill = quill;
      window[this.name] = quill;
      this.quill.on('text-change', this.handleTextChange);
      this.quill.on('selection-change', this.handleSelectionChange);

      this.$emit('ready', this.quill);

      this.quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
        const ops = [];
        delta.ops.forEach((op) => {
          // This comment is to fix the problem that the quill editor cannot paste and display @
          if (
            (op.insert && typeof op.insert === 'string') ||
            (node.classList && node.classList.contains('mention'))
          ) {
            ops.push({
              insert: op.insert,
            });
          }
        });
        delta.ops = ops;
        return delta;
      });
      if (this.autoFocus) {
        this.quill.focus();
      }
    },
    handleTextChange(_delta, _oldDelta, _source) {
      let text = this.quill.getText().trim();
      const textArray = Array.from(text);
      const textLength = textArray.length;
      if (
        !this.options?.keepExtraCharacters &&
        this.charactersLimit &&
        text &&
        textLength > this.charactersLimit
      ) {
        text = textArray.slice(0, this.charactersLimit).join('');
        this.quill.root.innerHTML = text;
      }
      let content = this.quill.root.innerHTML;
      content = content === `<p><br></p>` ? '' : content;
      this.$emit('update:modelValue', content);
      this.$emit('change', content);
      this.$emit('text', text);

      const regex = /data-denotation-char="@" data-id="([^"]*)"/g;
      let matches;
      const dataIds = [];
      while ((matches = regex.exec(content)) !== null) {
        dataIds.push(matches[1]);
      }
      this.tagUserIds = dataIds;
      this.$emit('tag', dataIds);
    },
    handleSelectionChange(range) {
      if (range && range.length !== 0) {
        this.selection = range;
        this.openPopup();
      } else {
        this.showPopup = false;
        this.selection = null;
      }
      if (!range) {
        this.$emit('focus', false);
      } else {
        this.$emit('focus', true);
      }
    },
    openPopup() {
      const rect = this.$refs.editorContainer.getBoundingClientRect();
      const range = this.quill.getSelection();
      if (range && range.length > 0) {
        const bounds = this.quill.getBounds(range.index, range.length);
        const top =
          (bounds.top > 0 ? bounds.top : 0) - (this.$device.isMobile ? 40 : 50);
        const left = bounds.left;
        const initLeft = this.type === 'line' ? 50 : 0;
        this.toolbarLocation = {
          left:
            left + 200 > rect.width
              ? left - 200 > 0
                ? left - 300
                : -30
              : left === 0 && bounds.width / 2 < 150
                ? initLeft
                : left + bounds.width / 2 - 150 > 0
                  ? left + bounds.width / 2 - 150
                  : initLeft,
          top: top ? top : 0,
          right: left + 200 > rect.width ? 0 : undefined,
        };

        this.showPopup = true;
      }
    },
    onClick(e) {
      if (e.detail > 3) {
        this.quill.setSelection(0, this.quill.getLength());
      }
    },
    onDblclick(e) {
      e.preventDefault();
      const range = this.quill.getSelection();
      if (range && range.length > 0) {
        this.openPopup(e);
      } else {
        if (range) {
          const [leaf, offset] = this.quill.getLeaf(range.index);
          const text = leaf.domNode.textContent;
          // if (!text) return;
          const start = range.index - offset;
          // const end = start + text.length;

          const clickIndex = range.index;
          const clickOffset = clickIndex - start;

          let startIndex = clickOffset;
          while (startIndex > 0 && !/\s/.test(text[startIndex - 1])) {
            startIndex--;
          }

          let endIndex = clickOffset;
          while (endIndex < text.length && !/\s/.test(text[endIndex])) {
            endIndex++;
          }

          const selectionStart = start + startIndex;
          const selectionEnd = start + endIndex;
          this.quill.setSelection(
            selectionStart,
            selectionEnd - selectionStart,
          );
          this.openPopup(e);
        }
      }
    },
    async onCopy() {
      this.quill.focus();
      if (this.selection) {
        const text = this.quill.getText(
          this.selection.index,
          this.selection.length,
        );
        await this.$copyText(text);
      }
    },
    onCut() {
      this.quill.focus();
      if (this.selection) {
        const text = this.quill.getText(
          this.selection.index,
          this.selection.length,
        );
        this.quill.deleteText(this.selection.index, this.selection.length);
        this.$copyText(text);
      }
    },
    async onPaste() {
      this.quill.focus();
      try {
        const text = await navigator.clipboard.readText();
        const range = this.quill.getSelection();
        if (range) {
          this.quill.deleteText(range.index, range.length);
          this.quill.clipboard.dangerouslyPasteHTML(range.index, text);
        }
      } catch (error) {
        console.error(error);
      }
    },
    onSelectAll() {
      this.quill.focus();
      this.quill.setSelection(0, this.quill.getLength());
    },
    onDelete() {
      this.quill.focus();
      if (this.selection) {
        this.quill.deleteText(this.selection.index, this.selection.length);
      }
    },
    onScrollOptions() {
      this.quill.focus();
      this.showPopup = true;
    },
    onCloseToolbar() {
      this.showPopup = false;
    },
    async setCursorToEnd() {
      await sleep(100);
      const length = this.quill.getLength();
      this.quill.setSelection(length - 1, 0);
    },
  },
};
</script>

<style lang="scss">
.ql-toolbar.ql-snow {
  border: none;
}
.quill-editor {
  .ql-editor.ql-blank::before {
    font-family: 'Inter', sans-serif;
    color: #555;
    font-style: normal;
    left: 0 !important;
  }

  .ql-editor {
    padding: 0px;
  }

  &.ql-container.ql-snow {
    border: none;
  }

  .ql-syntax {
    color: #bbb !important;
    background-color: #191919 !important;
  }
  .ql-hidden {
    display: none;
  }
  p > .hljs-attribute {
    color: rgba(255, 255, 255, 0.8);
  }
}
.ql-mention-list-container {
  padding: 0;
  border-radius: 0.3125rem;
  .ql-mention-list {
    overscroll-behavior: contain;
  }
  .ql-mention-list-item {
    border-radius: 0;
    border: none;
    padding: 0.5rem 1rem;
    color: rgba(255, 255, 255, 0.7);
    &.ql-mention-list-item.selected {
      background-color: rgba(255, 255, 255, 0.15);
    }
  }
}
</style>
