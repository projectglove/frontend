import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { screen, fireEvent, render, act, waitFor } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach, beforeAll } from '@jest/globals';
import { ReferendumList } from '@/components/referendum-list';
import { DialogProvider } from '@/lib/providers/dialog';
import { AccountProvider } from '@/lib/providers/account';

describe('ReferendumList Component', () => {
  beforeEach(() => {
    act(() => {
      render(
        <DialogProvider>
          <AccountProvider>
            <ReferendumList isTest={true} />
          </AccountProvider>
        </DialogProvider>
      );
    });
  });

  it('displays referendum list and page elements', () => {
    expect(screen.getByText(/Active Treasury Referenda/)).toBeInTheDocument();
    expect(screen.getByText(/All/)).toBeInTheDocument();
  });
});