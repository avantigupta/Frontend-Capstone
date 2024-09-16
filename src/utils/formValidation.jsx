export const validateForm = ({ username, password, role, categoryName }) => {
  const errors = {};

  if (username !== undefined) {
    if (!username) {
      errors.username = "Username is required";
    } else if (role === "admin") {
      if (!/^[\w-\.]+@([\w-]+\.)+com$/.test(username)) {
        errors.username = "Enter a valid email address with .com domain";
      }
    } else if (role === "user" && username.length !== 10) {
      errors.username = "Phone number must be exactly 10 digits";
    }
  }

  if (password !== undefined && !password) {
    errors.password = "Password is required";
  }

  if (categoryName !== undefined) {
    const categoryPattern = /^[a-zA-Z0-9 ]+$/;
    if (!categoryName) {
      errors.categoryName = "Category name is required";
    } else if (!categoryPattern.test(categoryName)) {
      errors.categoryName = "Category name cannot contain special characters";
    }
  }
  return errors;
};
