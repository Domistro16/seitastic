import { useNavigate } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();
    return (
      <div className="hidden lg:block w-1/5 bg-gray-800 text-white h-screen flex sticky flex-col">
        <h1 className="text-2xl font-bold p-4">Seitastic Admin</h1>
        <nav className="flex flex-col p-4 space-y-4">
          <a href="#" className="flex items-center p-2 bg-gray-700 rounded text-gray-300 hover:bg-gray-600">
            Dashboard
          </a>
          <a href="#" className="flex items-center p-2 rounded text-gray-300 hover:bg-gray-600" >Home</a>
          <a href="#" className="flex items-center p-2 rounded text-gray-300 hover:bg-gray-600" onClick={() => navigate('/admin/adcourse')}>Courses</a>
          <a href="#" className="flex items-center p-2 rounded text-gray-300 hover:bg-gray-600">Blog</a>
        </nav>
      </div>
    );
  }
  
  export default Sidebar;
  