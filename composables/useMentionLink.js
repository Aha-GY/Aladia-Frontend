/*
功能描述：当点击一个 @mention 时，跳转到对应的 profile 页面
实现方案：
- 添加全局的点击事件监听，当发现点击目标是 @mention 元素时，才执行跳转
- 如果点击目标不在指定容器中时，则不执行跳转，以免影响输入框中的 @mention 元素

@mention 在文本中的结构如下：

```html
<span
  class="mention"
  data-index="0"
  data-denotation-char="@"
  data-id="676a72bb9b1243d7a28404a3"  // important: 用户 id
  data-type="user"  // important: 用户类型, user | org
  data-full-name="Peter Zhang"
  contenteditable="false"
>
  <span contenteditable="false">
    <span class="ql-mention-denotation-char">@</span><span>Peter Zhang</span>
  </span>
</span>
```

*/

// 标记是否已经添加了全局的事件监听
let isReady = false;

// 具备这个类名的容器才会启用 @mention 跳转功能
const classWrapperEnabledMention = '--mention-link-enabled';

// 添加全局的事件监听
export function useMentionLink() {
  // 只在客户端执行
  if (!import.meta.client) {
    return;
  }

  // 如果已经添加了全局的事件监听，则直接返回
  if (isReady) {
    return;
  }

  const profileStore = useProfileStore();

  // 使用事件委托，监听全局点击事件
  document.addEventListener('click', (e) => {
    // 查找在启用 mention 容器内的 mention 元素
    const mentionEl = e.target.closest(
      `.${classWrapperEnabledMention} .mention`,
    );
    if (!mentionEl) {
      return;
    }

    // 阻止默认行为
    e.preventDefault();

    // 获取必要的属性
    const id = mentionEl.getAttribute('data-id');
    const entityType = mentionEl.getAttribute('data-type');

    // 跳转到对应的 profile 页面
    profileStore.gotoProfilePage({ id, entityType });
  });

  isReady = true;
  // console.log('[useMentionLink] isReady:', isReady);
}
