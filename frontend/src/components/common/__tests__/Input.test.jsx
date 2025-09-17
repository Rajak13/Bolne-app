import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders with label correctly', () => {
    render(<Input label="Email" name="email" />);
    const label = screen.getByText('Email');
    const input = screen.getByLabelText('Email');
    
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<Input label="Password" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('handles different input types', () => {
    const { rerender } = render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    const passwordInput = screen.getByDisplayValue('');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('shows password toggle for password inputs', async () => {
    const user = userEvent.setup();
    render(<Input type="password" value="secret" onChange={() => {}} />);
    
    const input = screen.getByDisplayValue('secret');
    const toggleButton = screen.getByLabelText(/show password/i);
    
    expect(input).toHaveAttribute('type', 'password');
    
    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    
    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('handles focus and blur events', async () => {
    const user = userEvent.setup();
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
    const input = screen.getByRole('textbox');
    
    await user.click(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    await user.tab();
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('shows error state correctly', () => {
    render(<Input error="This field is required" />);
    const errorMessage = screen.getByRole('alert');
    
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('This field is required');
  });

  it('handles disabled state correctly', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    
    expect(input).toBeDisabled();
  });

  it('handles value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    
    await user.type(input, 'hello');
    expect(handleChange).toHaveBeenCalledTimes(5); // Once for each character
  });

  it('applies focus styles when focused', async () => {
    const user = userEvent.setup();
    render(<Input label="Test Input" />);
    
    const container = screen.getByText('Test Input').closest('.input-container');
    const input = screen.getByRole('textbox');
    
    await user.click(input);
    expect(container).toHaveClass('input-container--focused');
  });
});