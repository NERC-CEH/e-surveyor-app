declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

/**
 * Like Partial but creates recursive partial deep type;
 */
type PartialDeep<K> = {
  [attr in keyof K]?: K[attr] extends object ? PartialDeep<K[attr]> : K[attr];
};

/**
 * Makes selected keys optional.
 *
 * Optional<{a; b; c}, 'b'>
 *
 * {a; c}
 * Omit<T, K>
 * &
 * {a?; b?; c?}
 * Partial<T>;
 * =
 * {a; b?; c}
 */
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

/**
 * Makes all optional except selected keys.
 *
 * OptionalExcept<{a; b; c}, 'a' | 'c'>
 *
 * {a; c;}
 * Pick<T, K>
 * &
 * {a?; b?; c?}
 * Partial<T>;
 * =
 * {a; b?; c}
 */
type OptionalExcept<T, K extends keyof T> = Pick<T, K> & Partial<T>;
