import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { screen, fireEvent, render } from '@testing-library/react';
import Wallets from '@/components/wallets';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { AccountProvider } from '@/lib/providers/account';
import { DialogProvider } from '@/lib/providers/dialog';

describe('Wallets Component', () => {
  beforeEach(() => {
    const mockUseAccounts = jest.fn().mockReturnValue({
      accounts: [],
      extensions: [{ name: 'polkadot-js', type: 'extension' }],
      selectedExtension: null,
      selectedAccount: null
    });
    jest.mock('@/lib/providers/account', () => ({
      useAccounts: mockUseAccounts
    }));
  });

  it('should prompt user to choose a wallet extension if installed', () => {
    render(<DialogProvider>
      <AccountProvider>
        <Wallets />
      </AccountProvider>
    </DialogProvider>);
    expect(screen.getByText(/Connect with one of the wallet extensions above./)).toBeInTheDocument();
  });
});