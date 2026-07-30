import { useEffect, useState } from 'react';

// Use a stable value during SSR/SSG to avoid hydration mismatches, then switch
// to the client value after the first client render.
export function useClientOnlyValue<TServer, TClient>(
  serverValue: TServer,
  clientValue: TClient
): TServer | TClient {
  const [value, setValue] = useState<TServer | TClient>(serverValue);

  useEffect(() => {
    setValue(clientValue);
  }, [clientValue]);

  return value;
}
