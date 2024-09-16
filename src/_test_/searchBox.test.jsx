import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/searchBox'; 

describe('SearchBar Component', () => {
  test('renders SearchBar component', () => {
    render(<SearchBar placeholder="Search..." />);
    
    const inputElement = screen.getByPlaceholderText(/Search.../i);
    expect(inputElement).toBeInTheDocument();
  });

  test('displays placeholder text correctly', () => {
    render(<SearchBar placeholder="Search..." />);
    
    const inputElement = screen.getByPlaceholderText(/Search.../i);
    expect(inputElement).toBeInTheDocument();
  });

  test('updates input value when typing', () => {
    render(<SearchBar placeholder="Search..." />);
    
    const inputElement = screen.getByPlaceholderText(/Search.../i);
    fireEvent.change(inputElement, { target: { value: 'React' } });
    
    expect(inputElement.value).toBe('React');
  });

  test('calls onSearch with correct value', () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar placeholder="Search..." onSearch={mockOnSearch} />);
    
    const inputElement = screen.getByPlaceholderText(/Search.../i);
    fireEvent.change(inputElement, { target: { value: 'React' } });
    
    expect(mockOnSearch).toHaveBeenCalledWith('React');
  });

  test('displays the search icon', () => {
    render(<SearchBar placeholder="Search..." />);
    
    const iconElement = screen.getByAltText('search');
    expect(iconElement).toBeInTheDocument();
  });
});
