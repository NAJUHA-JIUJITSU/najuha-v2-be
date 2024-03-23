export type OmitOptional<T> = Pick<
  T,
  {
    [K in keyof T]-?: T extends Record<K, T[K]> ? K : never;
  }[keyof T]
>;
