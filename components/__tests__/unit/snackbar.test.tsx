import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach, beforeAll } from '@jest/globals';
import { Snackbar } from '@/components/ui/snackbar';
import { Message } from '@/lib/types';

describe('Snackbar Component', () => {
  it('renders correctly with initial open state', () => {
    const message: Message = { id: 1, type: 'success', title: 'Success', content: 'Operation completed successfully' };
    act(() => {
      render(<Snackbar message={message} initialOpen={true} />);
    });
    expect(screen.getByText('Operation completed successfully')).toBeInTheDocument();
  });

  it('closes on close button click', () => {
    const message: Message = { id: 1, type: 'info', title: 'Info', content: 'This is an info message' };
    act(() => {
      render(<Snackbar message={message} initialOpen={true} />);
    });
    act(() => {
      fireEvent.click(screen.getByText('Close'));
    });
    expect(screen.queryByText('This is an info message')).toBeNull();
  });
});