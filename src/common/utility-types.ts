export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type NotNull<T> = {
  [P in keyof T]: Exclude<T[P], null>;
};
