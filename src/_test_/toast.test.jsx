import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Toast from '../components/toast'; 

describe('Toast Component', () => {

  test('renders toast with message and type', () => {
    render(<Toast message="Test message" type="error" onClose={() => {}} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('Test message').parentElement).toHaveClass('error');
  });

  
  test('can be manually dismissed', () => {
    const handleClose = jest.fn();
    render(<Toast message="Test message" onClose={handleClose} />);
    
    // Click the close button
    fireEvent.click(screen.getByText('×'));
    
    // Check if onClose callback was called
    expect(handleClose).toHaveBeenCalled();
  });

  

});
