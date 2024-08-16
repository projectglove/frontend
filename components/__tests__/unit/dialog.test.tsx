import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { screen, fireEvent, render, act, waitFor } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach, beforeAll } from '@jest/globals';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

describe('Dialog Component', () => {
  const onOpenChange = jest.fn();

  beforeEach(() => {
    act(() => {
      render(<Dialog open={true} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogTitle>Test Dialog</DialogTitle>
          <div>Dialog content here</div>
        </DialogContent>
      </Dialog>);
    });
  });

  it('renders dialog with content and title', () => {
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog content here')).toBeInTheDocument();
  });

  it('closes after clicking the close button', () => {
    expect(screen.getByTestId('dialog-close-button')).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByTestId('dialog-close-button'));
    });
    expect(onOpenChange).toHaveBeenCalled();
  });
});