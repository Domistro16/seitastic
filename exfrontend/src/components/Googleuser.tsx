// src/Auth.js
import { useState, useEffect } from 'react'
import {  logoutUser,  addUser } from './auth'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import { COURSE_ADDRESS } from '../../course.json'
import Footer from './Footer'
import { useAccount, useReadContract } from 'wagmi'
import courseabi from '../../abi'

const Auth = () => {
  const navigate = useNavigate();
    const { address } = useAccount();
    type CourseObject = {
      id: any;
      title: any;
      description: any;
      url: any;
      quizzes: any;
      level: any;
      participants: any;
      isEnrolled: any;
      isfree: any;
      userProgress: any;
    };
  
    const [objects, setObjects] = useState<CourseObject[]>([]);
    const [index, setIndex] = useState<number | null>(0); // Start fetching from index 0
    const [fetching, setFetching] = useState(true);
  
    const { data: course, error, isFetching} = useReadContract({
      address: `0x${COURSE_ADDRESS}`,
      abi: courseabi,
      functionName: "getCourse",
      args: index !== null ? [index, address || '0x0000000000000000000000000000000000000000'] : undefined, // Fetch only if index is not null
    });
  
    useEffect(() => {
      if (index === null || isFetching || error) {
        if (error) console.error("Error fetching course:", error);
        return;
      }
  
      console.log("Fetched course:", course);
  
      if (!course || !Array.isArray(course) || course.length === 0) {
        // Stop fetching if no more courses are available
        setFetching(false);
        setIndex(null);
        return;
      }
  
      const [
        id,
        title,
        description,
        url,
        quizzes,
        level,
        participants,
        isEnrolled,
        isfree,
        userProgress,
      ] = course;
  
      const newCourse: CourseObject = {
        id,
        title,
        description,
        url,
        quizzes,
        level,
        participants,
        isEnrolled,
        isfree,
        userProgress,
      };
  
      setObjects((prevObjects) => [...prevObjects, newCourse]);
      setIndex((prevIndex) => (prevIndex !== null ? prevIndex + 1 : null)); // Increment index to fetch next course
    }, [course, isFetching, error]);
  
    useEffect(() => {
      if (!fetching) {
        setFetching(true);
        setIndex(0);
      }
    }, [objects]); 
    
  const nav = async () => {
    logoutUser();
    navigate('..')
  }
  useEffect(() => {
    const checkUser = async () => {
      try {
        addUser();
      } catch (error) {
        navigate('/sign-up')
      }
    }

    checkUser()
  }, [])



  return (
        <div className="h-full ">
        <Header />
        <div className="h-[180px] flex bg-red-700 w-full p-8 items-center">
            <h1 className="text-4xl text-gray-100">Desmond Egwurube</h1>
        </div>
        <div className=" mt-10 p-6 flex justify-center ">
        <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-bold">Available Courses</h3>
        
        <ul className="">
        {objects.filter((a) => a.isfree === "true").map((a, index) => (

        <li key={index} className="text-gray-500 mt-5 list-style-number">
            {a.title}
         </li>   
       
        ))}
        </ul>
      </div>

      
        </div>
        <div className='flex justify-center'>
        <button className="px-5 py-2 m-5 bg-gray-700 text-gray-300 rounded-xl" onClick={nav}>Logout</button>
        </div>
        <Footer />
    </div>
  )
}

export default Auth

