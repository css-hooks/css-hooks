export function exhausted(_: Record<any, never>) {
  return true as const;
}
