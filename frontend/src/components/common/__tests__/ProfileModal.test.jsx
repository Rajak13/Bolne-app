import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ProfileModal from '../ProfileModal';
import { AuthContext } from '../../../context/AuthContext';

// Mock the auth service
vi.mock('../../../services/authService', () => ({
  updateProfile: vi.fn(),
  logout: vi.fn(),
}));

// Mock user data
const mockUser = {
  _id: '1',
  fullName: 'John Doe',
  email: 'john@example.com',
  profilePic: 'https://example.com/avatar.jpg'
};

// Mock auth context
const mockAuthContext = {
  user: mockUser,
  updateProfile: vi.fn(),
  logout: vi.fn(),
  isLoading: false,
  error: null
};

// Wrapper component with auth context
const TestWrapper = ({ children }) => (
  <AuthContext.Provider value={mockAuthContext}>
    {children}
  </AuthContext.Provider>
);

describe('ProfileModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders profile modal when open', () => {
    render(
      <TestWrapper>
        <ProfileModal isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    );

    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <TestWrapper>
        <ProfileModal isOpen={false} onClose={mockOnClose} />
      </TestWrapper>
    );

    expect(screen.queryByText('Profile Settings')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <TestWrapper>
        <ProfileModal isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    );

    const closeButton = screen.getByLabelText('Close profile modal');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('updates full name input', () => {
    render(
      <TestWrapper>
        <ProfileModal isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    );

    const nameInput = screen.getByDisplayValue('John Doe');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

    expect(nameInput.value).toBe('Jane Doe');
  });

  it('shows error for empty full name', async () => {
    render(
      <TestWrapper>
        <ProfileModal isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    );

    const nameInput = screen.getByDisplayValue('John Doe');
    const saveButton = screen.getByText('Save Changes');

    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument();
    });
  });

  it('handles image file selection', () => {
    render(
      <TestWrapper>
        <ProfileModal isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    );

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [file] } });

    // The file should be selected (we can't easily test the preview without more complex setup)
    expect(fileInput.files[0]).toBe(file);
  });

  it('shows logout confirmation dialog', () => {
    render(
      <TestWrapper>
        <ProfileModal isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(screen.getByText('Confirm Logout')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to logout?')).toBeInTheDocument();
  });

  it('cancels logout confirmation', () => {
    render(
      <TestWrapper>
        <ProfileModal isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Confirm Logout')).not.toBeInTheDocument();
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
  });

  it('disables save button when no changes', () => {
    render(
      <TestWrapper>
        <ProfileModal isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    );

    const saveButton = screen.getByRole('button', { name: 'Save Changes' });
    expect(saveButton).toBeDisabled();
  });

  it('enables save button when changes are made', () => {
    render(
      <TestWrapper>
        <ProfileModal isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    );

    const nameInput = screen.getByDisplayValue('John Doe');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

    const saveButton = screen.getByRole('button', { name: 'Save Changes' });
    expect(saveButton).not.toBeDisabled();
  });

  it('shows error for invalid image file', async () => {
    render(
      <TestWrapper>
        <ProfileModal isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    );

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Please select a valid image file')).toBeInTheDocument();
    });
  });

  it('shows error for large image file', async () => {
    render(
      <TestWrapper>
        <ProfileModal isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    );

    // Create a mock file larger than 5MB
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(screen.getByText('Image size must be less than 5MB')).toBeInTheDocument();
    });
  });
});