export function exhausted(x: Record<any, never>) {
  return true as const;
}
