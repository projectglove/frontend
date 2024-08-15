import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { screen, fireEvent, render, act } from '@testing-library/react';
import Wallets from '@/components/wallets';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { AccountProvider } from '@/lib/providers/account';
import { DialogProvider } from '@/lib/providers/dialog';

describe('Wallets Component', () => {
  const mockUseAccounts = jest.fn().mockReturnValue({
    accounts: [],
    extensions: [{ name: 'polkadot-js' }],
    selectedExtension: null,
    selectedAccount: null
  });

  beforeEach(() => {
    act(() => {
      render(<DialogProvider>
        <AccountProvider>
          <Wallets defaultValue={mockUseAccounts()} />
        </AccountProvider>
      </DialogProvider>);
    });
  });

  it('should prompt user to choose a wallet extension if installed', () => {
    expect(screen.getByText(/Connect with one of the wallet extensions above./)).toBeInTheDocument();
  });
});