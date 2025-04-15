export function useUserAgentWatch(pollInterval = 1000) {
  const userAgent = ref('');

  let intervalId: NodeJS.Timeout | null = null;

  const checkUserAgent = () => {
    const currentUserAgent = navigator.userAgent;
    if (userAgent.value !== currentUserAgent) {
      userAgent.value = currentUserAgent;
      window.location.reload();
    }
  };

  onMounted(() => {
    userAgent.value = navigator.userAgent;
    intervalId = setInterval(checkUserAgent, pollInterval);
  });

  onUnmounted(() => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
  });

  return {
    userAgent,
  };
}
