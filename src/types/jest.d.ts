/**
 * Type definitions for custom Jest matchers
 */

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidN8nNode(): R;
      toHaveValidCredentials(): R;
    }
  }
}

export {}; 