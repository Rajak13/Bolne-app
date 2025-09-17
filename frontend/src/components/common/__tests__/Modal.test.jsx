import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../Modal';

describe('Modal', () => {
  beforeEach(() => {
    // Create a div with id 'root' for the modal portal
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);
  });

  afterEach(() => {
    // Clean up the root div
    const root = document.getElementById('root');
    if (root) {
      document.body.removeChild(root);
    }
    // Reset body overflow
    document.body.style.overflow = '';
  });

  it('does not render when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={() => {}}>Content</Modal>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={() => {}}>Content</Modal>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders with title when provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        Content
      </Modal>
    );
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        Content
      </Modal>
    );
    
    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnBackdrop={true}>
        Content
      </Modal>
    );
    
    const backdrop = screen.getByRole('dialog');
    await user.click(backdrop);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when backdrop is clicked and closeOnBackdrop is false', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnBackdrop={false}>
        Content
      </Modal>
    );
    
    const backdrop = screen.getByRole('dialog');
    await user.click(backdrop);
    
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnEscape={true}>
        Content
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when Escape key is pressed and closeOnEscape is false', () => {
    const handleClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnEscape={false}>
        Content
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('renders different sizes correctly', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={() => {}} size="small">
        Content
      </Modal>
    );
    
    expect(document.querySelector('.modal--small')).toBeInTheDocument();

    rerender(
      <Modal isOpen={true} onClose={() => {}} size="large">
        Content
      </Modal>
    );
    
    expect(document.querySelector('.modal--large')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} className="custom-modal">
        Content
      </Modal>
    );
    
    expect(document.querySelector('.custom-modal')).toBeInTheDocument();
  });

  it('prevents body scroll when open', () => {
    render(<Modal isOpen={true} onClose={() => {}}>Content</Modal>);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when closed', () => {
    const { rerender } = render(<Modal isOpen={true} onClose={() => {}}>Content</Modal>);
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(<Modal isOpen={false} onClose={() => {}}>Content</Modal>);
    expect(document.body.style.overflow).toBe('');
  });
});