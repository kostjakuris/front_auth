export const scrollToBottom = (timeoutRef: React.RefObject<NodeJS.Timeout | null>,
  elementRef: React.RefObject<HTMLDivElement | null>) => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }
  timeoutRef.current = setTimeout(() => {
    elementRef.current?.scrollIntoView({behavior: 'instant'});
  }, 100);
};