import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import { jest, describe, it, expect, beforeEach, beforeAll } from '@jest/globals';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

describe('Select Component', () => {
  it('renders select with options', () => {
    act(() => {
      render(
        <Select>
          <SelectContent>
            <SelectItem value="none">Choose an option</SelectItem>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );
    });
    expect(screen.getByText('Choose an option')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });
});