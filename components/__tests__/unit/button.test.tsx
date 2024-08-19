import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { screen, fireEvent, render, act, waitFor } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach, beforeAll } from '@jest/globals';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with default props', () => {
    act(() => {
      render(<Button>Click me</Button>);
    });
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary/80 text-primary-foreground hover:bg-primary');
  });

  it('applies variant styles', () => {
    act(() => {
      render(<Button variant="destructive">Delete</Button>);
    });
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveClass('bg-destructive/90 text-destructive-foreground hover:bg-destructive');
  });
});