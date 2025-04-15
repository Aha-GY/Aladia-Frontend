const actionTypes = {
  text: 'TEXT',
  formatting: 'FORMATTING',
  colors: 'TEXT COLORS',
  bg: 'BACKGROUND COLORS',
};

const actionNames = {
  bold: 'Bold',
  italic: 'Italic',
  underline: 'Underline',
  strikethrough: 'Strikethrough',
  normal: 'Normal Text',
  'code-block': 'Code',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  'builleted-list': 'Bulleted list',
  'numbered-list': 'Numbered list',
  clear: 'Clear Format',
  red: 'Red',
  orange: 'Orange',
  yellow: 'Yellow',
  blue: 'Blue',
  purple: 'Purple',
  pink: 'Pink',
  green: 'Green',
  grey: 'Grey',
  bg_red: 'Red Highlight',
  bg_orange: 'Orange Highlight',
  bg_yellow: 'Yellow Highlight',
  bg_blue: 'Blue Highlight',
  bg_purple: 'Purple Highlight',
  bg_pink: 'Pink Highlight',
  bg_green: 'Green Highlight',
  bg_grey: 'Grey Highlight',
};
const actionIcons = {
  bold: 'fa-solid fa-bold',
  italic: 'fa-solid fa-italic',
  underline: 'fa-solid fa-underline',
  strikethrough: 'fa-solid fa-strikethrough',
  'code-block': 'fa-solid fa-code',
  h1: 'fa-solid fa-h1',
  h2: 'fa-solid fa-h2',
  h3: 'fa-solid fa-h3',
  h4: 'fa-solid fa-h4',
  'builleted-list': 'fa-solid fa-list-ul',
  'numbered-list': 'fa-solid fa-list-ol',
  normal: 'fa-solid fa-text',
  clear: 'fa-solid fa-ban',
  red: 'fa-solid fa-font text-[red]',
  orange: 'fa-solid fa-font text-[orange]',
  yellow: 'fa-solid fa-font text-[yellow]',
  blue: 'fa-solid fa-font text-[blue]',
  purple: 'fa-solid fa-font text-[purple]',
  pink: 'fa-solid fa-font text-[pink]',
  green: 'fa-solid fa-font text-[green]',
  grey: 'fa-solid fa-font text-[grey]',
  bg_red: 'fa-solid fa-font text-[#222]',
  bg_orange: 'fa-solid fa-font text-[#222]',
  bg_yellow: 'fa-solid fa-font text-[#222]',
  bg_blue: 'fa-solid fa-font text-[#222]',
  bg_purple: 'fa-solid fa-font text-[#222]',
  bg_pink: 'fa-solid fa-font text-[#222]',
  bg_green: 'fa-solid fa-font text-[#222]',
  bg_grey: 'fa-solid fa-font text-[#222]',
};

const defaultOptions = {
  actions: {
    formatting: [
      'clear',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'code-block',
    ],
    text: ['normal', 'h1', 'h2', 'h3', 'h4', 'builleted-list', 'numbered-list'],
    colors: [
      'red',
      'orange',
      'yellow',
      'blue',
      'purple',
      'pink',
      'green',
      'grey',
    ],
    bg: [
      'bg_red',
      'bg_orange',
      'bg_yellow',
      'bg_blue',
      'bg_purple',
      'bg_pink',
      'bg_green',
      'bg_grey',
    ],
  },
};

export class SlashModule {
  constructor(quill, options) {
    this.quill = quill;
    this.options = { ...defaultOptions, ...options };
    this.filteredActions = Object.keys(this.options.actions).flatMap(
      (type) => this.options.actions[type],
    );
    this.selectedIndex = -1;
    this.container = document.createElement('div');
    this.rendderContainer();
    this.quill.on('text-change', this.onTextChange.bind(this));
    this.quill.on('selection-change', this.onSelectionChange.bind(this));
    this.container.addEventListener('click', this.onContainerClick.bind(this));
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  rendderContainer() {
    this.container.classList.add(
      'ql-slash-container',
      'max-sm:!max-h-[12.5rem]',
    );
    this.container.innerHTML = `
      <div class="ql-slash-list"></div>`;
    this.renderItem();
    document.body.appendChild(this.container);
  }
  renderItem(index = -1) {
    const list = this.container.querySelector('.ql-slash-list');
    list.innerHTML = '';
    let selectKey = '';
    if (index !== -1) {
      selectKey = this.filteredActions[index];
    }
    Object.keys(this.options.actions).forEach((type) => {
      if (
        this.options.actions[type].some((action) =>
          this.filteredActions.includes(action),
        )
      ) {
        list.innerHTML += `<div class="ql-slash-list-type">${actionTypes[type]}</div>`;
        this.options.actions[type].forEach((action) => {
          if (this.filteredActions.includes(action)) {
            const style = action.startsWith('bg_')
              ? `background:${action.replace('bg_', '')}`
              : '';
            list.innerHTML += `
            <div class="ql-slash-list-item ${selectKey === action ? 'selected' : ''}" data-action="${action}">
                <div class="slash-list-item-icon" style="${style}"><i class="${actionIcons[action]}"></i></div> ${actionNames[action]}
            </div>
          `;
          }
        });
      }
      this.selectedIndex = index;
    });

    this.items = this.container.querySelectorAll('.ql-slash-list-item');
    this.items.forEach((item) => {
      item.addEventListener('mouseover', () => {
        this.items.forEach((i) => i.classList.remove('selected'));
      });
    });
  }

  onTextChange() {
    const range = this.quill.getSelection();
    if (!range) {
      return;
    }

    const textBeforeCursor = this.quill.getText(0, range.index);
    const match = textBeforeCursor.match(/\/(\w*)$/);
    if (match) {
      const query = match[1];
      this.filteredActions = Object.keys(actionNames).filter((key) =>
        actionNames[key].toLowerCase().includes(query.toLowerCase()),
      );
      if (this.filteredActions.length > 0) {
        let index = query === '' ? -1 : this.filteredActions.length ? 0 : -1;
        if (this.container.style.display !== 'block') {
          this.showContainer(range);
          index = -1;
        }
        this.renderItem(index);
      } else {
        this.hideContainer();
      }
    } else {
      this.hideContainer();
    }
  }

  onSelectionChange(range) {
    if (!range) {
      this.hideContainer();
    }
  }

  showContainer(range) {
    this.items.forEach((i) => i.classList.remove('selected'));
    const bounds = this.quill.getBounds(range.index);
    const quillContainer = this.quill.container.getBoundingClientRect();
    const containerTop = quillContainer.top + window.scrollY;
    const containerLeft = quillContainer.left + window.scrollX;
    this.container.style.display = 'block';
    this.container.style.position = 'absolute';

    let left = containerLeft + bounds.left;
    let bottom = window.innerHeight - (containerTop + bounds.bottom);
    const top = containerTop + bounds.bottom;

    const containerHeight = this.container.offsetHeight;
    const containerWidth = this.container.offsetWidth;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    if (bottom + containerHeight > viewportHeight) {
      bottom = window.innerHeight - (containerTop + bounds.top);
    }
    if (bottom < 0) {
      bottom = window.innerHeight - (containerTop + bounds.bottom);
    }
    if (left + containerWidth > viewportWidth) {
      left = viewportWidth - containerWidth;
    }
    if (left < 0) {
      left = 0;
    }

    this.container.style.left = `${left}px`;
    if (top < containerHeight) {
      this.container.style.top = `${containerTop + bounds.top + bounds.height}px`;
    } else {
      this.container.style.bottom = `${bottom + bounds.height + 4}px`;
    }

    this.selectedIndex = -1;
  }

  hideContainer() {
    this.container.style.display = 'none';
  }

  onContainerClick(event) {
    const action = event.target.getAttribute('data-action');
    if (action) {
      this.executeAction(action);
      this.clearSlashAndText();
      this.hideContainer();
    }
  }

  onKeyDown(event) {
    if (this.container.style.display === 'block') {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
        this.updateSelection();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.selectedIndex =
          (this.selectedIndex - 1 + this.items.length) % this.items.length;
        this.updateSelection();
      } else if (event.key === 'Enter' && this.selectedIndex >= 0) {
        event.preventDefault();
        event.stopPropagation();
        const action =
          this.items[this.selectedIndex].getAttribute('data-action');
        this.executeAction(action);
        this.clearSlashAndText();
        this.hideContainer();
      }
    }
  }

  updateSelection() {
    this.items.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });
  }

  executeAction(action) {
    switch (action) {
      case 'normal':
      case 'clear':
        this.quill.format('bold', false);
        this.quill.format('italic', false);
        this.quill.format('underline', false);
        this.quill.format('strike', false);
        this.quill.format('code', false);
        this.quill.format('header', false);
        this.quill.format('list', false);
        this.quill.format('code-block', false);
        this.quill.format('color', false);
        this.quill.format('background', false);
        break;
      case 'bold':
        this.quill.format('bold', true);
        break;
      case 'italic':
        this.quill.format('italic', true);
        break;
      case 'underline':
        this.quill.format('underline', true);
        break;
      case 'strikethrough':
        this.quill.format('strike', true);
        break;
      case 'code-block':
        this.quill.format('code-block', true);
        break;
      case 'h1':
        this.quill.format('header', 1);
        break;
      case 'h2':
        this.quill.format('header', 2);
        break;
      case 'h3':
        this.quill.format('header', 3);
        break;
      case 'h4':
        this.quill.format('header', 4);
        break;
      case 'builleted-list':
        this.quill.format('list', 'bullet');
        break;
      case 'numbered-list':
        this.quill.format('list', 'ordered');
        break;
      case 'red':
      case 'orange':
      case 'yellow':
      case 'blue':
      case 'purple':
      case 'pink':
      case 'green':
      case 'grey':
        this.quill.format('color', action);
        break;
      case 'bg_red':
      case 'bg_orange':
      case 'bg_yellow':
      case 'bg_blue':
      case 'bg_purple':
      case 'bg_pink':
      case 'bg_green':
      case 'bg_grey':
        this.quill.format('color', '#222');
        this.quill.format('background', action.replace('bg_', ''));
        break;
      default:
        break;
    }
  }

  clearSlashAndText() {
    const range = this.quill.getSelection();
    if (range) {
      const text = this.quill.getText(0, range.index);
      const match = text.match(/\/(\w*)$/);
      if (match) {
        const startIndex = range.index - match[0].length;
        this.quill.deleteText(startIndex, match[0].length);
      }
    }
  }
}
