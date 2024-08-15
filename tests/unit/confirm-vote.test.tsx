import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { screen, fireEvent, render, act, waitFor } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach, beforeAll } from '@jest/globals';
import ConfirmVote from '@/components/confirm-vote';
import { DialogProvider } from '@/lib/providers/dialog';
import { AccountProvider } from '@/lib/providers/account';
import { SnackbarProvider } from '@/lib/providers/snackbar';
import { GlobalWithFetchMock } from 'jest-fetch-mock';

const customGlobal: GlobalWithFetchMock = global as unknown as GlobalWithFetchMock;
customGlobal.fetch = require('jest-fetch-mock');
customGlobal.fetchMock = customGlobal.fetch;

describe('ConfirmVote Component', () => {
  const mockSetVote = jest.fn();
  const mockResponse = {
    json: () => Promise.resolve({ message: 'Error' }),
    status: 500,
    statusText: 'Server Error',
    ok: false,
    headers: { get: () => 'application/json' }
  } as unknown as Response;

  beforeEach(() => {
    act(() => {
      render(<DialogProvider>
        <AccountProvider>
          <SnackbarProvider>
            <ConfirmVote isTest={true} callbackTest={mockSetVote} />
          </SnackbarProvider>
        </AccountProvider>
      </DialogProvider>);
    });
  });

  it('renders without crashing', () => {
    expect(screen.getByText(/Voting on Referendum #/)).toBeInTheDocument();
    expect(screen.getByText(/Add\/Update Vote/)).toBeInTheDocument();
    expect(screen.getByText(/Remove Vote/)).toBeInTheDocument();
  });

  it('clicks the Add/Update Vote button but returns a 500 error', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    act(() => {
      fireEvent.click(screen.getByText(/Add\/Update Vote/));
    });

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalled();
      expect(mockSetVote).toHaveBeenCalled();
    });

    fetchSpy.mockRestore();
  });
});