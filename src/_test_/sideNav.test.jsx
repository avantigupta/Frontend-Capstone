import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import SideNav from '../components/sideNav'; 

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
  useLocation: () => ({ pathname: '/dashboard' })
}));

// Mock the images
jest.mock('../assets/icons/dashboard.png', () => 'dashboard-icon');
jest.mock('../assets/icons/book.png', () => 'book-icon');
jest.mock('../assets/icons/library.png', () => 'library-icon');
jest.mock('../assets/icons/user.png', () => 'user-icon');
jest.mock('../assets/icons/menu.png', () => 'menu-icon');

describe('SideNav Component', () => {
    let originalLocalStorageClear;

    beforeAll(() => {
      originalLocalStorageClear = Storage.prototype.clear;
      Storage.prototype.clear = jest.fn();
    });
  
  
    afterAll(() => {
        Storage.prototype.clear = originalLocalStorageClear;
        });
  const setup = (initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <SideNav />
      </MemoryRouter>
    );
  };

  // Test 1: Component renders correctly
  test('renders SideNav component', () => {
    setup();

    const dashboardLink = screen.getByText(/Dashboard/i);
    expect(dashboardLink).toBeInTheDocument();
    
    const categoriesLink = screen.getByText(/Category/i);
    expect(categoriesLink).toBeInTheDocument();
    
    const booksLink = screen.getByText(/Books/i);
    expect(booksLink).toBeInTheDocument();

    const usersLink = screen.getByText(/Users/i);
    expect(usersLink).toBeInTheDocument();
    
    const issuancesLink = screen.getByText(/Issuances/i);
    expect(issuancesLink).toBeInTheDocument();
  });
  test('renders all navigation links', () => {
    setup();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Issuances')).toBeInTheDocument();
  });
  test('renders logout button', () => {
    setup()
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });



  test('closes modal when cancel button is clicked', () => {
    setup();
    fireEvent.click(screen.getByText('Logout'));
    fireEvent.click(screen.getByText('No'));
    expect(screen.queryByText('Are you sure you want to log out?')).not.toBeInTheDocument();
  });
 

  // Test 3: Logout button opens the modal
  test('opens logout confirmation modal when clicking logout button', () => {
    setup();

    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    const modalText = screen.getByText(/Are you sure you want to log out?/i);
    expect(modalText).toBeInTheDocument();
  });

  test('confirms logout and navigates to home page', () => {
    const localStorageMock = {
        clear: jest.fn()
      };
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  
    setup();

    const logoutButton = screen.getByText(/Logout/i);
    fireEvent.click(logoutButton);

    const confirmButton = screen.getByText(/Yes/i);
    fireEvent.click(confirmButton);

    expect(localStorage.clear).toHaveBeenCalled();
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
  });

 
});
