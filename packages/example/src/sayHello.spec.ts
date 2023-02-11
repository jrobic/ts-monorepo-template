import { expect, test } from 'vitest';

import { sayHello } from './sayHello';

test('should return "Hello, Joe!"', () => {
  expect(sayHello('Joe')).toBe('Hello, Joe!');
});
