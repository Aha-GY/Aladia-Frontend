import Quill from 'quill';
import 'quill-mention';

export const mentionBlotName = 'styled-mention';
export function registerQuillMention() {
  try {
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

    Quill.register({
      'blots/mention': StyledMentionBlot,
    });
  } catch (error) {
    console.error(error);
  }
}
