import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dropdown from '../components/Dropdown'; 

describe('Dropdown Component', () => {
  const mockOnSelect = jest.fn();
  const options = [
    { label: 'Option 1' },
    { label: 'Option 2' },
    { label: 'Option 3' }
  ];

  test('renders without crashing', () => {
    render(<Dropdown options={options} onSelect={mockOnSelect} useInput={true} />);
    expect(screen.getByPlaceholderText('Select an option')).toBeInTheDocument();
  });

  test('selects an option and calls onSelect callback', async () => {
    render(<Dropdown options={options} onSelect={mockOnSelect} useInput={true} />);
    const dropdownInput = screen.getByPlaceholderText('Select an option');
  
    fireEvent.click(dropdownInput);
    const option = screen.getByText('Option 1');
    fireEvent.click(option);
  
    expect(mockOnSelect).toHaveBeenCalledWith({ label: 'Option 1' });
    await waitFor(() => {
      expect(screen.queryByRole('list')).toBeNull();
    });
  });
    


  test('filters options based on input value', async () => {
    render(<Dropdown options={options} onSelect={mockOnSelect} useInput={true} />);
    const dropdownInput = screen.getByPlaceholderText('Select an option');
    
    fireEvent.change(dropdownInput, { target: { value: 'Option 2' } });
    await waitFor(() => {
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.queryByText('Option 1')).toBeNull();
      expect(screen.queryByText('Option 3')).toBeNull();
    });
  });

 
 
});
