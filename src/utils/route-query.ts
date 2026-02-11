export function omitQueryParam<T extends Record<string, unknown>>(
  query: T,
  key: string
): T {
  const next = { ...query }

  delete next[key as keyof T]

  return next
}
