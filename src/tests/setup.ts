// Global test setup
import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = vi.fn();