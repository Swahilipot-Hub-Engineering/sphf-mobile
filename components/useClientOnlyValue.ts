export function useClientOnlyValue<TClient, TServer>(
  value: TClient,
  _serverValue: TServer
): TClient {
  return value;
}
