export function useInfiniteScroll({
  onLoad,
  isLoading = ref(false),
  isEnd = ref(false),
  containerRef,
  threshold = 100,
}) {
  const lastScrollTop = ref(0);

  const isNearBottom = () => {
    if (!containerRef.value) {
      return false;
    }

    const container = containerRef.value;
    const containerRect = container.getBoundingClientRect();
    const containerBottom = containerRect.bottom;
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    return containerBottom - windowHeight < threshold;
  };

  const handleScroll = () => {
    const st = window.scrollY || document.documentElement.scrollTop;
    if (st > lastScrollTop.value) {
      if (!isLoading.value && !isEnd.value && isNearBottom()) {
        onLoad();
      }
    }

    lastScrollTop.value = st <= 0 ? 0 : st;
  };

  const checkInitialLoad = () => {
    if (!isLoading.value && !isEnd.value && isNearBottom()) {
      onLoad();
    }
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    nextTick(checkInitialLoad);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  return {
    lastScrollTop,
  };
}
