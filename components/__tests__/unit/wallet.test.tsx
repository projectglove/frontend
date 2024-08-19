import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { screen, fireEvent, render, act, waitFor } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import Wallet from '@/components/wallet';
import { InjectedAccounts } from '@polkadot/extension-inject/types';
import { AccountProvider } from '@/lib/providers/account';
import { DialogProvider } from '@/lib/providers/dialog';

describe('Wallet Component', () => {
  const setActiveWallet = jest.fn();

  beforeEach(() => {
    act(() => {
      render(<DialogProvider>
        <AccountProvider>
          <Wallet wallet={{ name: 'polkadot-js', version: '1.0.0', accounts: {} as InjectedAccounts, signer: {} }} isTest={true} callbackTest={setActiveWallet} />
        </AccountProvider>
      </DialogProvider>);
    });
  });

  it('renders wallet information', () => {
    expect(screen.getByText(/polkadot-js/)).toBeInTheDocument();
  });

  it('clicks the polkadot-js wallet extension', async () => {
    act(() => {
      fireEvent.click(screen.getByTestId('polkadot-js'));
    });
    await waitFor(() => expect(setActiveWallet).toHaveBeenCalled());
  });
});