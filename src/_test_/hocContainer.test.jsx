import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HocContainer from '../components/hocContainer';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../components/header', () => {
  return {
    __esModule: true,
    default: ({ title }) => <div data-testid="mock-header">{title}</div>
  };
});

jest.mock('../components/sideNav', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-sidenav">SideNav</div>
  };
});

const MockComponent = () => <div data-testid="mock-component">Mock Component</div>;

describe('HocContainer', () => {
  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  test('renders the Header component with correct title', () => {
    const WrappedComponent = HocContainer(MockComponent, 'Test Title');
    renderWithRouter(<WrappedComponent />);
    
    const header = screen.getByTestId('mock-header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Test Title');
  });

  test('renders the SideNav component when showSideNav is true', () => {
    const WrappedComponent = HocContainer(MockComponent, 'Test', true);
    renderWithRouter(<WrappedComponent />);
    
    expect(screen.getByTestId('mock-sidenav')).toBeInTheDocument();
  });

  test('does not render the SideNav component when showSideNav is false', () => {
    const WrappedComponent = HocContainer(MockComponent, 'Test', false);
    renderWithRouter(<WrappedComponent />);
    
    expect(screen.queryByTestId('mock-sidenav')).not.toBeInTheDocument();
  });

  test('renders the wrapped component', () => {
    const WrappedComponent = HocContainer(MockComponent, 'Test');
    renderWithRouter(<WrappedComponent />);
    
    expect(screen.getByTestId('mock-component')).toBeInTheDocument();
  });

  test('applies correct CSS class when SideNav is shown', () => {
    const WrappedComponent = HocContainer(MockComponent, 'Test', true);
    renderWithRouter(<WrappedComponent />);
    
    const container = screen.getByTestId('mock-component').parentElement;
    expect(container).toHaveClass('dashboard-hoc-right-container');
  });

  test('applies correct CSS class when SideNav is hidden', () => {
    const WrappedComponent = HocContainer(MockComponent, 'Test', false);
    renderWithRouter(<WrappedComponent />);
    
    const container = screen.getByTestId('mock-component').parentElement;
    expect(container).toHaveClass('dashboard-hoc-full-container');
  });
});