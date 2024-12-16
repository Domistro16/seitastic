import Sidebar from './Sidebar';
import Adminheader from './adminheader';
import StatsCard from './StatsCard';
import Add from './add';
import GraphCard from './GraphCard'
import { useEffect } from 'react';
import { useReadContract } from 'wagmi';
import {ADMIN_ADDRESS, USER_ADDRESS, COURSE_ADDRESS} from '../../course.json'
import adminAbi from '../../adminabi';
import userAbi from '../../userAbi'
import courseAbi from "../../abi"
import { useNavigate } from 'react-router-dom';


function Admin() {
  const navigate = useNavigate();
  const { data: admin, error } = useReadContract({
    address: `0x${ADMIN_ADDRESS}`,
    abi: adminAbi,
    functionName: "adminaddress",
  });

  const { data: users, error: rerror, isPending: isLoading } = useReadContract({
    address: `0x${USER_ADDRESS}`,
    abi: userAbi,
    functionName: "getUsers",
  });

  const { data: courses, error: err} = useReadContract({
    address: `0x${COURSE_ADDRESS}`,
    abi: courseAbi,
    functionName: "numCourses",
  });



  useEffect(() => {
    async function adnav() {
      if(admin){
        console.log(admin)
          navigate('/admin');

      }
    if(await !admin){
      return <div className="mx-auto my-auto">Are you the admin?</div>
    }
  }
    if (error && rerror && err) {
      console.log(error, "and/n", rerror, err);
    }
    adnav();
  }, [admin, error, rerror]);
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-4 bg-gray-900">
        <img
          src="/seitastic.png"
          className="h-20 animate-bounce"
          alt="Loading"
        />
      </div>
    );
  }
  return (
    <div className="flex flex-col lg:flex-row h-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-400 overflow-y-hidden">
      <Sidebar />
      <div className="flex-1">
        <Adminheader />
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mx-auto">
          <StatsCard title="Number of Users" value={users} />
          <StatsCard title="Number of Courses" value={courses} />
          <StatsCard title="Popular Course" value="3,462" />
        </div>

        <h2 className='text-xl ml-6'>Courses</h2>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Add />
            <div>
            <GraphCard title="Website View" subtitle="Last Campaign Performance" text={"lori"}/>
          </div >
        </div>
      </div>
    </div>
  );
}

export default Admin;
