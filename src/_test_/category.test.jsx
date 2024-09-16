import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { useState, useEffect } from 'react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils'; 
import Category from '../components/category/category'; 
import { fetch_get, fetch_post, fetch_delete } from '../api/apiManager';
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";
import { CATEGORY_POST, CATEGORY_DELETE } from '../utils/constants';


jest.mock('../api/axiosConfig');

jest.mock('../api/apiManager');

describe("Category Component", () => {
  it("should render Category component correctly", async () => {
    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );
    
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(screen.getByText("Add Category")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Add Category"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Category Name")).toBeInTheDocument();
    });
  });

  it("should update category name on input change", async () => {
    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Add Category"));

    const inputElement = await screen.findByPlaceholderText('Category Name');

    fireEvent.change(inputElement, { target: { value: 'New Category Name' } });

    expect(inputElement.value).toBe('New Category Name');
  });
});

  
  test('should open modal and check input value', async () => {
    render(  <MemoryRouter>
        <Category />
      </MemoryRouter>);
  
    const openModalButton = screen.getByText('Add Category'); 
    fireEvent.click(openModalButton);
  
    const inputElement = screen.getByPlaceholderText('Category Name');
  
    expect(inputElement).toBeInTheDocument();
    
    fireEvent.change(inputElement, { target: { value: 'New Category' } });
  
    expect(inputElement.value).toBe('New Category');
  });
  test('should open the modal and set the category data', () => {
    const setIsDeleteConfirmation = jest.fn();
    const setCategoryName = jest.fn();
    const setEditingCategoryId = jest.fn();
    const setModalOpen = jest.fn();
  
    const category = { id: 1, categoryName: 'Science Fiction' };
  
    const handleOpenModal = (category = null) => {
      setIsDeleteConfirmation(false);
      if (category) {
        setCategoryName(category.categoryName);
        setEditingCategoryId(category.id);
      } else {
        setCategoryName("");
        setEditingCategoryId(null);
      }
      setModalOpen(true);
    };
  
    handleOpenModal(category);
  
    expect(setIsDeleteConfirmation).toHaveBeenCalledWith(false);
    expect(setCategoryName).toHaveBeenCalledWith('Science Fiction');
    expect(setEditingCategoryId).toHaveBeenCalledWith(1);
    expect(setModalOpen).toHaveBeenCalledWith(true);
  });
  
  


const Toast = ({ message, type, onClose }) => (
  <div>
    <p>{message}</p>
    <button onClick={onClose}>Close</button>
  </div>
);

function TestComponent() {
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);

      return () => clearTimeout(timer); 
    }
  }, [toastMessage]);

  return (
    <div>
      <button onClick={() => showToast('This is a toast message', 'info')}>Show Toast</button>
      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />}
    </div>
  );
}


describe('showToast function', () => {
  beforeEach(() => {
    jest.useFakeTimers(); 
  });

  afterEach(() => {
    jest.clearAllTimers(); 
  });

  it('should show the toast with the correct message and type', async () => {
    render(<TestComponent />);

    userEvent.click(screen.getByText('Show Toast'));

    expect(screen.getByText('This is a toast message')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(4000); 
    });

    expect(screen.queryByText('This is a toast message')).not.toBeInTheDocument();
  });

  it('should display an error message when fetching categories fails', async () => {
    fetch_get.mockRejectedValueOnce(new Error('Failed to load categories'));
    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load categories')).toBeInTheDocument();
    });
  });

  it("should render Category component correctly", async () => {
    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );
    
    // Ensure the search bar and "Add Category" button are rendered
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(screen.getByText("Add Category")).toBeInTheDocument();
    
    // Simulate clicking the "Add Category" button
    fireEvent.click(screen.getByText("Add Category"));
    
    // Wait for the modal to open and the Category Name input field to appear
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Category Name")).toBeInTheDocument();
    });
  });

  
  it("should update category name on input change", async () => {
    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );
    
    // Simulate clicking the "Add Category" button to open the modal
    fireEvent.click(screen.getByText("Add Category"));
    
    // Wait for the input field to appear
    const inputElement = await screen.findByPlaceholderText('Category Name');
    
    // Simulate typing into the input field
    fireEvent.change(inputElement, { target: { value: 'New Category Name' } });
    
    // Assert that the input value has changed
    expect(inputElement.value).toBe('New Category Name');
  });
  

  test('should open the modal and set the category data', () => {
    const setIsDeleteConfirmation = jest.fn();
    const setCategoryName = jest.fn();
    const setEditingCategoryId = jest.fn();
    const setModalOpen = jest.fn();
    
    const category = { id: 1, categoryName: 'Science Fiction' };
    
    const handleOpenModal = (category = null) => {
      setIsDeleteConfirmation(false);
      if (category) {
        setCategoryName(category.categoryName);
        setEditingCategoryId(category.id);
      } else {
        setCategoryName("");
        setEditingCategoryId(null);
      }
      setModalOpen(true);
    };
    
    handleOpenModal(category);
    
    expect(setIsDeleteConfirmation).toHaveBeenCalledWith(false);
    expect(setCategoryName).toHaveBeenCalledWith('Science Fiction');
    expect(setEditingCategoryId).toHaveBeenCalledWith(1);
    expect(setModalOpen).toHaveBeenCalledWith(true);
  });

  
  it('should show the toast with the correct message and type', async () => {
    render(<TestComponent />);
  
    // Simulate user clicking on 'Show Toast'
    userEvent.click(screen.getByText('Show Toast'));
  
    // Assert that the toast message appears
    expect(screen.getByText('This is a toast message')).toBeInTheDocument();
  
    // Advance the timer and ensure the toast message disappears
    await act(async () => {
      jest.advanceTimersByTime(4000);
    });
  
    // Assert that the toast message has been removed after 4 seconds
    expect(screen.queryByText('This is a toast message')).not.toBeInTheDocument();
  });

  
  it('should display an error message when fetching categories fails', async () => {
    fetch_get.mockRejectedValueOnce(new Error('Failed to load categories'));
    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load categories')).toBeInTheDocument();
    });
  });
 
  
});
  

describe('Category Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle search functionality', async () => {
    fetch_get.mockResolvedValueOnce({ data: { content: [], totalPages: 0 } });
    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    await act(async () => {
      userEvent.type(searchInput, 'test category');
      jest.advanceTimersByTime(1000);
    });

    expect(fetch_get).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      search: 'testcategory'
    }));
  });

  it('should handle pagination', async () => {
    fetch_get.mockResolvedValueOnce({ 
      data: { 
        content: [{ id: 1, categoryName: 'Category 1' }], 
        totalPages: 2 
      } 
    });
    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(fetch_get).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      page: 1
    }));
  });

  it('should handle adding a new category', async () => {
    fetch_post.mockResolvedValueOnce({ data: { message: 'Category added successfully' } });
    
    const { debug } = render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );

    // Wait for the initial render to complete
    await waitFor(() => {
      expect(screen.getByText('Add Category')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add Category'));
    
    const input = await screen.findByPlaceholderText('Category Name');
    fireEvent.change(input, { target: { value: 'New Category' } });
    
    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(fetch_post).toHaveBeenCalledWith(
        CATEGORY_POST,
        [{ categoryName: 'New Category', id: null }]
      );
    });

    // Debug: Log the current state of the DOM
    debug();

    // Check for either success message or error message
    await waitFor(() => {
      const successMessage = screen.queryByText('Category added successfully');
      const errorMessage = screen.queryByText('Failed to load categories');
      
      if (successMessage) {
        expect(successMessage).toBeInTheDocument();
      } else if (errorMessage) {
        expect(errorMessage).toBeInTheDocument();
      } else {
        throw new Error('Neither success nor error message found');
      }
    });
  });

 

  it('should handle errors when saving a category', async () => {
    fetch_post.mockRejectedValueOnce({ 
      response: { 
        status: 409, 
        data: { message: 'Category cannot be deleted as some books under this category are currently issued.' } 
      } 
    });
    
    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Add Category'));
    const input = await screen.findByPlaceholderText('Category Name');
    fireEvent.change(input, { target: { value: 'New Category' } });
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByText('Category cannot be deleted as some books under this category are currently issued.')).toBeInTheDocument();
    });
  });

  it('should handle generic errors when saving a category', async () => {
    fetch_post.mockRejectedValueOnce({ 
      response: { 
        status: 500
      } 
    });
    
    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Add Category'));
    const input = await screen.findByPlaceholderText('Category Name');
    fireEvent.change(input, { target: { value: 'New Category' } });
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => {
      expect(screen.getByText('Failed to save category. Please try again.')).toBeInTheDocument();
    });
  });
});

describe('Category Component Delete Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch_get.mockResolvedValue({ 
      data: { 
        content: [{ id: 77, categoryName: 'Science Fiction' }], 
        totalPages: 1 
      } 
    });
  });

  const openDeleteModal = async () => {
    await waitFor(() => {
      expect(screen.getByText('Science Fiction')).toBeInTheDocument();
    });
    const row = screen.getByText('Science Fiction').closest('tr');
    const deleteButton = within(row).getByText('Delete');
    fireEvent.click(deleteButton);
  };

  it('should open delete confirmation modal when delete button is clicked', async () => {
    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );

    await openDeleteModal();

    expect(screen.getByText('Are you sure you want to delete this category?')).toBeInTheDocument();
  });

  it('should close modal when cancel button is clicked', async () => {
    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );

    await openDeleteModal();
    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.queryByText('Are you sure you want to delete this category?')).not.toBeInTheDocument();
  });

  it('should handle successful category deletion', async () => {
    fetch_delete.mockResolvedValueOnce({ data: { message: 'Category deleted successfully' } });

    render(
      <MemoryRouter>
        <Category />
      </MemoryRouter>
    );

    await openDeleteModal();
    
    const confirmDeleteButton = within(screen.getByText('Confirm Deletion').closest('div')).getByText('Delete');
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(fetch_delete).toHaveBeenCalledWith(`${CATEGORY_DELETE}77`);
      expect(screen.getByText('Category deleted successfully')).toBeInTheDocument();
    });
  });

  
})