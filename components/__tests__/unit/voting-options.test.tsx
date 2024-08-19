import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach, beforeAll } from '@jest/globals';
import VotingOptions from '@/components/voting-options';
import { DialogProvider } from '@/lib/providers/dialog';
import { Conviction, VotingOptionsProps } from '@/lib/types';

describe('VotingOptions Component', () => {
  const props: VotingOptionsProps = {
    index: 1,
    amounts: [1],
    multipliers: [Conviction.None],
    preferredDirection: {
      1: 'Aye'
    },
    handleAmountChange: jest.fn(),
    handleMultiplierChange: jest.fn(),
    handlePreferredDirectionChange: jest.fn()
  };

  beforeEach(() => {
    act(() => {
      render(
        <DialogProvider>
          <VotingOptions {...props} />
        </DialogProvider>
      );
    });
  });

  it('renders voting options', () => {
    expect(screen.getByText('Direction')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Conviction')).toBeInTheDocument();
  });

  // it('handles amount change', () => {
  //   fireEvent.change(screen.getByPlaceholderText('Select Direction'), { target: { value: 'Aye' } });
  //   expect(props.handlePreferredDirectionChange).toHaveBeenCalledWith(1, 'Aye');
  // });
});