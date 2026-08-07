export type DebouncedFunction<TArgs extends unknown[]> = ((...args: TArgs) => void) & {
  cancel: () => void;
  flush: () => void;
};

export function debounce<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  waitMs: number,
): DebouncedFunction<TArgs> {
  let timer: number | null = null;
  let latestArgs: TArgs | null = null;

  const debounced = ((...args: TArgs) => {
    latestArgs = args;
    if (timer !== null) {
      window.clearTimeout(timer);
    }

    timer = window.setTimeout(() => {
      callback(...args);
      timer = null;
      latestArgs = null;
    }, waitMs);
  }) as DebouncedFunction<TArgs>;

  debounced.cancel = () => {
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
  };

  debounced.flush = () => {
    if (timer !== null && latestArgs) {
      window.clearTimeout(timer);
      callback(...latestArgs);
      timer = null;
      latestArgs = null;
    }
  };

  return debounced;
}