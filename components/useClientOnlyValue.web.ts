import { useSyncExternalStore } from 'react';

// On web, `useSyncExternalStore`'s server snapshot only runs during server
// rendering, and its client snapshot only runs once hydrated on the client.
// This lets us pick a stable value during SSR/SSG to avoid hydration
// mismatches, then switch to the client value after the first client render,
// without calling `setState` from inside an effect.
function subscribe() {
  return () => {};
}

export function useClientOnlyValue<S, C>(server: S, client: C): S | C {
  const isHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  return isHydrated ? client : server;
}
