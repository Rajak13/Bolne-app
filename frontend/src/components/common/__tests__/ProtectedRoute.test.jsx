import { describe, it, expect } from 'vitest';
import ProtectedRoute from '../ProtectedRoute';

describe('ProtectedRoute', () => {
  it('should be defined and importable', () => {
    expect(ProtectedRoute).toBeDefined();
    expect(typeof ProtectedRoute).toBe('function');
  });

  it('should be a React component', () => {
    expect(ProtectedRoute.name).toBe('ProtectedRoute');
  });
});