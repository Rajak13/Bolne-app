import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner data-testid="spinner" />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('spinner', 'spinner--medium', 'spinner--primary');
  });

  it('renders different sizes correctly', () => {
    const { rerender } = render(<LoadingSpinner size="small" data-testid="spinner" />);
    expect(screen.getByTestId('spinner')).toHaveClass('spinner--small');

    rerender(<LoadingSpinner size="large" data-testid="spinner" />);
    expect(screen.getByTestId('spinner')).toHaveClass('spinner--large');

    rerender(<LoadingSpinner size="xlarge" data-testid="spinner" />);
    expect(screen.getByTestId('spinner')).toHaveClass('spinner--xlarge');
  });

  it('renders different colors correctly', () => {
    const { rerender } = render(<LoadingSpinner color="black" data-testid="spinner" />);
    expect(screen.getByTestId('spinner')).toHaveClass('spinner--black');

    rerender(<LoadingSpinner color="white" data-testid="spinner" />);
    expect(screen.getByTestId('spinner')).toHaveClass('spinner--white');

    rerender(<LoadingSpinner color="gray" data-testid="spinner" />);
    expect(screen.getByTestId('spinner')).toHaveClass('spinner--gray');
  });

  it('renders with overlay when specified', () => {
    render(<LoadingSpinner overlay />);
    const overlay = document.querySelector('.spinner-overlay');
    expect(overlay).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-spinner" data-testid="spinner" />);
    expect(screen.getByTestId('spinner')).toHaveClass('custom-spinner');
  });

  it('forwards additional props', () => {
    render(<LoadingSpinner data-testid="loading-spinner" />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('contains spinning circle element', () => {
    render(<LoadingSpinner data-testid="spinner" />);
    const spinner = screen.getByTestId('spinner');
    const circle = spinner.querySelector('.spinner__circle');
    expect(circle).toBeInTheDocument();
  });
});