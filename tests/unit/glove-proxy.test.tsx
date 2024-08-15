import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { screen, fireEvent, render, act, waitFor } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach, } from '@jest/globals';
import GloveProxy from '@/components/glove-proxy';
import { DialogProvider } from '@/lib/providers/dialog';
import { AccountProvider } from '@/lib/providers/account';
import { useApi } from '@/lib/providers/api';
import { SnackbarProvider } from '@/lib/providers/snackbar';


describe('GloveProxy Component', () => {
  const mockSetProxy = jest.fn();

  beforeEach(() => {
    act(() => {
      render(<DialogProvider>
        <AccountProvider>
          <SnackbarProvider>
            <GloveProxy isTest={true} callbackTest={mockSetProxy} />
          </SnackbarProvider>
        </AccountProvider>
      </DialogProvider>);
    });
  });

  it('renders without crashing', () => {
    expect(screen.getByText(/How to join Glove/)).toBeInTheDocument();
  });

  // it('handles proxy assignment', async () => {
  //   render(<GloveProxy />);
  //   fireEvent.click(screen.getByText(/Join Glove/));
  //   await waitFor(() => expect(mockAddMessage).toHaveBeenCalledWith(expect.objectContaining({ type: 'info' })));
  //   expect(mockSetOpenGloveProxy).toHaveBeenCalledWith(false);
  // });

  // it('handles errors during proxy assignment', async () => {
  //   useApi.mockReturnValueOnce({
  //     isConnected: false
  //   });
  //   render(<GloveProxy />);
  //   fireEvent.click(screen.getByText(/Join Glove/));
  //   await waitFor(() => expect(mockAddMessage).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' })));
  // });
});