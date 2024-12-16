import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useReadContract } from "wagmi";
import courseabi from "../../abi";
import adminAbi from "../../adminabi";
import { COURSE_ADDRESS, ADMIN_ADDRESS } from "../../course.json"

export const Popular = () => {
    const navigate = useNavigate()

    // Scroll Function
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

  const { data: admin} = useReadContract({
    address: `0x${ADMIN_ADDRESS}`,
    abi: adminAbi,
    functionName: "adminaddress",
  });


  const { data: course, error, isFetching } = useReadContract({
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

  function getThumbnail(url: any) {
    const regex = /\/embed\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    const id = match ? match[1] : null;

    return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  }

  const scrollRef = useRef<HTMLDivElement>(null);




  return(
    <div className="bg-gradient-to-b from-gray-200 via-gray-200 to-gray-400 w-full p-4 mt-10 ">
        <h1 className="font-semibold text-2xl font-poppins">Top courses</h1>
        <p className="text-lg text-gray-500">to try out</p>
        <div
       ref={scrollRef}
       className="scroll-container gap-10 flex flex-row overflow-x-auto w-full  p-4"
     >
  {objects.sort((a, b) => a.participants.length - b.participants.length).filter((obj) => obj.isfree === "true").slice(0 , 5).map((obj, idx) => (
    <div>
    <div
      key={idx}
      className="bg-white shadow-lg w-200px md:w-[250px] w-[150px] rounded-lg flex-shrink-0 relative"
    >
        <div className="absolute inset-0 bg-red-500 bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg items-center flex">
            <p className="mx-auto my-auto text-center text-white cursor-pointer" onClick={() => navigate(`/course/${obj.id}`)}>Go to course</p>
            {(admin == address) && (
              <p className="mx-auto my-auto text-center text-white cursor-pointer" onClick={() => navigate(`/admin/addquiz/${obj.id}`)}>Add a quiz</p>
            )

  }
        </div>
      <img
        src={getThumbnail(obj.url)}
        className="md:h-[150px] h-[75px] bg-red-500 w-full rounded-lg"
        alt="Thumbnail"
      />
    </div>
    <div className="pt-2">
    
    <p className="text-md">{obj.title}</p>
    </div>
  </div>
  ))}
    </div>
    </div>
  )
}
interface uprps{
  balance:any
}
export const Usercourses: React.FC<uprps> = ({balance}) => {

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

    return(
        <div className="grid grid-cols-1 md:grid-cols-3 mt-10 p-6 gap-6 ">       
        <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-bold text-gray-700">Courses Enrolled: {balance}</h3>
        
        <ul className="">
        {objects.filter((a) => a.isEnrolled === true ).slice(0, 5).map((a, index) => (

        <li key={index} className="text-gray-500 mt-5 list-style-number" onClick={() => {navigate(`/course/${a.id}`)}}>
            {a.title}
         </li>   
       
        ))}
        </ul>
      </div>
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-bold text-gray-700">Courses Completed</h3>
        
        <ul className="">
        {objects.filter((a) => a.userProgress === 100 ).slice(0, 5).map((a, index) => (

        <li key={index} className="text-gray-500 mt-5 list-style-number" >
            {a.title}
         </li>   
       
        ))}
        </ul>
      </div>
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-bold text-gray-700">Highest Grades</h3>
        
        <ul className="">
        {objects.sort((a, b) => a.userProgress - b.userProgress).filter((a) => a.isEnrolled === true ).slice(0, 5).map((a, index) => (

        <li key={index} className="text-gray-500 mt-5 list-style-number" onClick={() => {navigate(`/course${a.id}`)}}>
            {a.title}
         </li>   
       
        ))}
        </ul>
      </div>
      </div>
    )
}