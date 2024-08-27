import React from 'react'
import CategoryTable from '../Components/CategoryTable';
import { useNavigate } from 'react-router-dom';
import HocContainer from '../Components/HocContainer';

function Categories() {
  
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/addCategory");
  };
  return (
    <div>
      <CategoryTable/>
    </div>
  )
}

export default HocContainer(Categories);