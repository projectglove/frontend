
import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { screen, fireEvent, render, act } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import Wallet from '@/components/wallet';
import { InjectedAccounts } from '@polkadot/extension-inject/types';
import { AccountProvider } from '@/lib/providers/account';
import { DialogProvider } from '@/lib/providers/dialog';

describe('Wallet Component', () => {
  it('renders wallet information', () => {
    act(() => {
      render(<DialogProvider>
        <AccountProvider>
          <Wallet wallet={{ name: 'polkadot-js', version: '1.0.0', accounts: {} as InjectedAccounts, signer: {} }} isTest={true} />
        </AccountProvider>
      </DialogProvider>);
    });
    expect(screen.getByText(/polkadot-js/)).toBeInTheDocument();
  });

  it('clicks the polkadot-js wallet extension', () => {
    const setActiveWallet = jest.fn();

    act(() => {
      render(<DialogProvider>
        <AccountProvider>
          <Wallet wallet={{ name: 'polkadot-js', version: '1.0.0', accounts: {} as InjectedAccounts, signer: {} }} isTest={true} testSetActiveWallet={setActiveWallet} />
        </AccountProvider>
      </DialogProvider>);
    });
    expect(screen.getByText(/polkadot-js/)).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByTestId('polkadot-js'));
    });
    expect(setActiveWallet).toHaveBeenCalled();
  });
});