// Mock react-native modules
import 'react-native-gesture-handler/jestSetup';

// Silence the warning about Animated
global.__reanimatedWorkletInit = jest.fn();

// Mock console to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
