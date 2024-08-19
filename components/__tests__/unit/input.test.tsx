import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { screen, fireEvent, render, act, waitFor } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach, beforeAll } from '@jest/globals';
import { Input } from '@/components/ui/input';

describe('Input Component', () => {
  it('renders input with placeholder', () => {
    act(() => {
      render(<Input placeholder="Enter text here" />);
    });
    const input = screen.getByPlaceholderText('Enter text here');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm');
  });
});