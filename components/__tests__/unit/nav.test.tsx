import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { screen, fireEvent, render, act, waitFor } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach, beforeAll } from '@jest/globals';
import Nav from '@/components/nav';
import { DialogProvider } from '@/lib/providers/dialog';
import { AccountProvider } from '@/lib/providers/account';

describe('Nav Component', () => {
  beforeEach(() => {
    render(
      <DialogProvider>
        <AccountProvider>
          <Nav />
        </AccountProvider>
      </DialogProvider>
    );
  });

  it('renders navigation links when logged in', () => {
    expect(screen.getByText('Docs')).toBeInTheDocument();
  });

  it('opens documentation on button click', () => {
    const url = 'https://github.com/projectglove/glove-monorepo/?tab=readme-ov-file#building-glove';
    const spy = jest.spyOn(window, 'open').mockImplementation(() => window);
    fireEvent.click(screen.getByText('Docs'));
    expect(spy).toHaveBeenCalledWith(url, '_blank');
    spy.mockRestore();
  });
});