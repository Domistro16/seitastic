import {useNavigate} from "react-router-dom"


function Add() {

  const navigate = useNavigate();
    return (
      <div className="p-6 rounded-lg shadow h-[320px] bg-transparent border-dashed border-gray-400 border-8 flex flex-col items-center justify-center" onClick={() => navigate('/admin/adcourse')}>
        <div className="relative w-20 h-20 my-0 mx-auto items-center">
            <div className="absolute bg-gray-400 w-full h-2 top-1/2 left-0 transform -translate-y-1/2"></div>
            <div className="absolute bg-gray-400 w-2 h-full top-0 left-1/2 transform -translate-x-1/2"></div>
        </div>
        <h1 className="mt-10 text-gray-400">Add a new course</h1>

      </div>
    );
  }
  
  export default Add;
  