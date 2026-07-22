import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "@vitest/expect" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- declaration merging requires an interface, not a type alias
  interface Assertion<R = unknown> extends TestingLibraryMatchers<R, void> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- declaration merging requires an interface, not a type alias
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<
    unknown,
    void
  > {}
}
