import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/Button'; // Adjust the import path as needed

describe('Button Component', () => {
  
  test('renders button with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies custom class name', () => {
    render(<Button className="extra-class">Click Me</Button>);
    expect(screen.getByText('Click Me')).toHaveClass('custom-button extra-class');
  });

  test('sets button type correctly', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByText('Submit')).toHaveAttribute('type', 'submit');
  });

  test('defaults button type to "button"', () => {
    render(<Button>Default Button</Button>);
    expect(screen.getByText('Default Button')).toHaveAttribute('type', 'button');
  });

});
