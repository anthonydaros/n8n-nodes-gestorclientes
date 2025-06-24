/**
 * Jest setup file for n8n nodes testing
 */

// Mock console methods in tests to avoid noise
global.console = {
  ...console,
  // Uncomment to silence logs during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Set test timeout
jest.setTimeout(10000);

// Custom matchers for n8n testing
expect.extend({
  toBeValidN8nNode(received: any) {
    const pass = received && 
                 typeof received.description === 'object' &&
                 Array.isArray(received.description.properties) &&
                 typeof received.execute === 'function';
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid n8n node`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid n8n node with description.properties and execute method`,
        pass: false,
      };
    }
  },
  
  toHaveValidCredentials(received: any) {
    const pass = received && 
                 typeof received.displayName === 'string' &&
                 Array.isArray(received.properties);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to have valid credentials structure`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to have valid credentials with displayName and properties`,
        pass: false,
      };
    }
  },
});

export {}; 