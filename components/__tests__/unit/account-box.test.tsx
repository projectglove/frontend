import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { screen, fireEvent, render, act, waitFor } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach, beforeAll } from '@jest/globals';
import AccountBox from '@/components/account-box';
import { AccountProvider } from '@/lib/providers/account';
import { SnackbarProvider } from '@/lib/providers/snackbar';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { DialogProvider } from '@/lib/providers/dialog';

describe('AccountBox Component', () => {
  const account: InjectedAccountWithMeta = {
    address: '5GHs...WQLb',
    meta: { name: 'Alice', source: 'polkadot-js' }
  };

  beforeEach(() => {
    act(() => {
      render(
        <DialogProvider>
          <SnackbarProvider>
            <AccountProvider>
              <AccountBox account={account} isList={false} />
            </AccountProvider>
          </SnackbarProvider>
        </DialogProvider>
      );
    });
  });

  it('renders account information', () => {
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  // it('triggers account set on click', () => {
  //   const setActiveAccount = jest.fn();

  //   act(() => {
  //     fireEvent.click(screen.getByText('Alice'));
  //   });
  //   expect(setActiveAccount).toHaveBeenCalledWith(account);
  // });
});