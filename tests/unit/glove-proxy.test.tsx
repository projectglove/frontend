import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { screen, fireEvent, render, act, waitFor } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach, } from '@jest/globals';
import GloveProxy from '@/components/glove-proxy';
import { DialogProvider } from '@/lib/providers/dialog';
import { AccountProvider } from '@/lib/providers/account';
import { useApi } from '@/lib/providers/api';
import { SnackbarProvider } from '@/lib/providers/snackbar';
import { GlobalWithFetchMock } from 'jest-fetch-mock';

const customGlobal: GlobalWithFetchMock = global as unknown as GlobalWithFetchMock;
customGlobal.fetch = require('jest-fetch-mock');
customGlobal.fetchMock = customGlobal.fetch;

describe('GloveProxy Component', () => {
  const mockSetProxy = jest.fn();
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
            <GloveProxy isTest={true} callbackTest={mockSetProxy} />
          </SnackbarProvider>
        </AccountProvider>
      </DialogProvider>);
    });
  });

  it('renders without crashing', () => {
    expect(screen.getByText(/How to join Glove/)).toBeInTheDocument();
  });

  it('clicks the Join Glove button but returns a 500 error', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    act(() => {
      fireEvent.click(screen.getByTestId('glove-proxy-button'));
    });

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalled();
      expect(mockSetProxy).toHaveBeenCalled();
    });

    fetchSpy.mockRestore();
  });
});