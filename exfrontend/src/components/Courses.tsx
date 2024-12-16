import React, { useState, useEffect, useRef } from "react";
import { useReadContract, useAccount } from "wagmi";
import courseabi from "../../abi";
import Header from "./Header";
import '../index.css'
import adminAbi from "../../adminabi";
import { useNavigate } from "react-router-dom";
import { COURSE_ADDRESS, ADMIN_ADDRESS } from "../../course.json"
import SearchBar from "./search";
import Footer from "./Footer";

function Courses() {
  const navigate = useNavigate()

  // Scroll Function
  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollAmount = Math.min(clientWidth / 2, 300); // Scroll half or max 300px
      ref.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };
  
  const { address } = useAccount();
  const account = useAccount();
  type CourseObject = {
    id: any;
    title: any;
    description: any;
    url: any;
    lessons: any;
    level: any;
    participants: any;
    isEnrolled: any;
    isfree: any;
    userProgress: any;
  };

  const [objects, setObjects] = useState<CourseObject[]>([]);
  const [searchQuery] = useState(""); // State for search query
  const [index, setIndex] = useState<number | null>(0); // Start fetching from index 0
  const [fetching, setFetching] = useState(true);

  const { data: admin } = useReadContract({
    address: `0x${ADMIN_ADDRESS}`,
    abi: adminAbi,
    functionName: "adminaddress",
  });


  const { data: course, error, isFetching, isLoading } = useReadContract({
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
      lessons,
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
      lessons,
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
    // Trigger initial fetching on mount
    if (!fetching) {
      setFetching(true);
      setIndex(0);
    }

  }, [searchQuery, objects]); // Empty dependency array ensures this runs only once when the component mounts

  function getThumbnail(url: any) {
    const regex = /\/embed\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    const id = match ? match[1] : null;

    return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  }

  const [isBeginner, setIsBeginner] = useState(false)
  const [isIntermidiate, setIsIntermediate] = useState(false);
  const [isAdvanced, setIsAdvanced] = useState(false);

  const handleBeginner = () => {
    setIsBeginner(!isBeginner);
    setIsIntermediate(false);
    setIsAdvanced(false);
  }
  const handleIntermediate = () => {
    setIsBeginner(false);
    setIsIntermediate(!isIntermidiate);
    setIsAdvanced(false);
  }
  const handleAdvanced = () => {
    setIsBeginner(false);
    setIsIntermediate(false);
    setIsAdvanced(!isAdvanced);
  }

  const beginnerScrollRef = useRef<HTMLDivElement>(null);
  const [isBOverflowing, setIsBOverflowing] = useState(false);
  const [isIOverflowing, setIsIOverflowing] = useState(false);
  const [isAOverflowing, setIsAOverflowing] = useState(false);

  const checkOverflow = () => {
    const bref = beginnerScrollRef.current;
    const iref = intermediateScrollRef.current;
    const aref = advancedScrollRef.current;
    if (bref) {
      setIsBOverflowing(bref.scrollWidth > bref.clientWidth);
    }
    else if(iref){
      setIsIOverflowing(iref.scrollWidth > iref.clientWidth)
    }
    else if(aref){
      setIsAOverflowing(aref.scrollWidth > aref.clientWidth)
    }
  };

  useEffect(() => {
    checkOverflow(); // Check initially on mount
    window.addEventListener("resize", checkOverflow); // Check on resize
    return () => window.removeEventListener("resize", checkOverflow); // Cleanup
  }, []);
const intermediateScrollRef = useRef<HTMLDivElement>(null);
const advancedScrollRef = useRef<HTMLDivElement>(null);

  if(isLoading){
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-4 bg-gray-900">
        <img
          src="http://localhost:5173/seitastic.png"
          className="h-20 animate-bounce"
          alt="Loading"
        />
      </div>
  }

  return (
    <div className="font-poppins text-gray-700">
      <Header />
      <div className={`my-6 p-4 bg-white mx-4 rounded-lg pb-20 h-full`}>
        <h2 className="text-4xl mt-4 text-center">COURSES</h2>

      <div className="mt-4">
        <SearchBar />
      </div>



{account.isDisconnected && (
<div className="w-full mx-auto mt-10 flex flex-col justify-center relative">
        <h2
  className="transition ease-in-out duration-300 delay-200 bg-transparent 
             hover:bg-gradient-to-b hover:from-white hover:via-gray-200 hover:to-gray-400 
             p-4 cursor-pointer text-xl w-[120px] "
>
  Free
</h2>
       <div
       ref={beginnerScrollRef}
       className="scroll-container gap-10 flex flex-row overflow-x-hidden w-full  p-4"
     >
  {objects.filter((obj) => obj.level === "Beginner").filter((obj) => obj.isfree === "true").map((obj, idx) => (
    <div>
    <div
      key={idx}
      className="bg-white shadow-lg w-200px md:w-[250px] w-[150px] rounded-lg flex-shrink-0 relative"
    >
        <div className="absolute inset-0 bg-red-500 bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg items-center flex">
            <p className="mx-auto my-auto text-center text-white cursor-pointer" onClick={() => navigate(`/course/${obj.id}`)}>Go to course</p>
            {(admin == address) && (
              <div>
              <p className="mx-auto my-auto text-center text-white cursor-pointer" onClick={() => navigate(`/admin/lessons/${obj.id}`)}>Add a Quiz</p> 
              <br /><p className="mx-auto my-auto text-center text-white cursor-pointer" onClick={() => navigate(`/admin/addLessons/${obj.id}`)}>Add a Lesson</p>
              </div>
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

  {isBOverflowing && (
    <>
    <button
        onClick={() => scroll(beginnerScrollRef, "left")}
        className="absolute text-3xl font-bold top-[50%] text-white bg-gray-800 bg-opacity-75 p-2 rounded-full"
      >
       &#10094;
      </button>

      {/* Right Button */}
      <button
        onClick={() => scroll(beginnerScrollRef, "right")}
        className="absolute right-0 text-3xl font-bold top-[50%] text-white bg-gray-800 bg-opacity-75 p-2 rounded-full"
      >
       &#10095;
      </button> 
      
      </>
  )}
      </div> 
        </div>
        )}
{!account.isDisconnected && ( 
        <div className="w-full mx-auto mt-10 flex flex-col justify-center relative">
        <h2
  className="transition ease-in-out duration-300 delay-200 bg-transparent 
             hover:bg-gradient-to-b hover:from-white hover:via-gray-200 hover:to-gray-400 
             p-4 cursor-pointer text-xl w-[120px] "
  onClick={handleBeginner}
>
  Beginner
</h2>
    {isBeginner &&(
       <div
       ref={beginnerScrollRef}
       className="scroll-container gap-10 flex flex-row overflow-x-hidden w-full  p-4"
     >
  {objects.filter((obj) => obj.level === "Beginner").map((obj, idx) => (
    <div>
    <div
      key={idx}
      className="bg-white shadow-lg w-200px md:w-[250px] w-[150px] rounded-lg flex-shrink-0 relative"
    >
        <div className="absolute inset-0 bg-red-500 bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg items-center flex">
            <p className="mx-auto my-auto text-center text-white cursor-pointer" onClick={() => navigate(`/course/${obj.id}`)}>Go to course</p>
            {(admin == address) && (
              <>
              <p className="mx-auto my-auto text-center text-white cursor-pointer" onClick={() => navigate(`/admin/lessons/${obj.id}`)}>Add a quiz</p>
              <br /><p className="mx-auto my-auto text-center text-white cursor-pointer" onClick={() => navigate(`/admin/addLesson/${obj.id}`)}>Add a Lesson</p>
              </>
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
  {isBOverflowing && (
    <>
    <button
        onClick={() => scroll(beginnerScrollRef, "left")}
        className="absolute text-3xl font-bold top-[50%] text-white bg-gray-800 bg-opacity-75 p-2 rounded-full"
      >
       &#10094;
      </button>

      {/* Right Button */}
      <button
        onClick={() => scroll(beginnerScrollRef, "right")}
        className="absolute right-0 text-3xl font-bold top-[50%] text-white bg-gray-800 bg-opacity-75 p-2 rounded-full"
      >
       &#10095;
      </button> 
      </> 
  )}
      </div> 
)}
        </div>
        )}
    {!account.isDisconnected &&
        <div className="w-full mx-auto mt-10 flex flex-col justify-center">
        <h2 className="hover:bg-gradient-to-b hover:from-white hover:via-gray-200 hover:to-gray-400 ease-in-out delay-100 transition p-4 cursor-pointer text-xl w-[160px]" onClick={handleIntermediate}>Intermediate</h2>
    {isIntermidiate && (
       <div
       ref={intermediateScrollRef}
       className="gap-10 flex flex-row overflow-x-hidden w-full p-4 relative"
       style={{
         scrollBehavior: "smooth", // Smooth scrolling
         scrollbarWidth: "none", // For Firefox
         msOverflowStyle: "none", // For IE/Edge
       }}
     >
  {objects.filter((obj) => obj.level === "Intermediate").map((obj, idx) => (
    <div>
    <div
      key={idx}
      className="bg-white shadow-lg w-[300px] rounded-t-lg flex-shrink-0 relative"
    >
       <div className="absolute inset-0 bg-red-500 bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg items-center flex">
            <p className="mx-auto my-auto text-center text-white cursor-pointer" onClick={() => navigate(`/course/${obj.id}`)}>Go to course</p>
            {(admin == address) && (
              <>
              <p className="mx-auto my-auto text-center text-white cursor-pointer" onClick={() => navigate(`/admin/lessons/${obj.id}`)}>Add a quiz</p>
              <br /><p className="mx-auto my-auto text-center text-white cursor-pointer" onClick={() => navigate(`/admin/addLesson/${obj.id}`)}>Add a Lesson</p>
              </>
            )}
        </div>
      <img
        src={getThumbnail(obj.url)}
        className="h-[150px] bg-red-500 w-full rounded-t-lg"
        alt="Thumbnail"
      />
    </div>
    <div className="pt-2">
    <p className="text-md">{obj.title}</p>
    </div>
  </div>
  ))}
{isIOverflowing && (
  <>
<button
        onClick={() => scroll(intermediateScrollRef, "left")}
        className="absolute text-3xl font-bold top-[50%] text-white bg-gray-800 bg-opacity-75 p-2 rounded-full"
      >
       &#10094;
      </button>

      {/* Right Button */}
      <button
        onClick={() => scroll(intermediateScrollRef, "right")}
        className="absolute right-0 text-3xl font-bold top-[50%] text-white bg-gray-800 bg-opacity-75 p-2 rounded-full"
      >
       &#10095;
      </button>
      </> 
)}
    </div>
)}
        </div>
        }
{!account.isDisconnected &&
        <div className="w-full mx-auto mt-10 flex flex-col justify-center">
        <h2 className="hover:bg-gradient-to-b hover:from-white hover:via-gray-200 hover:to-gray-400  ease-in-out delay-100 transition p-4 cursor-pointer text-xl w-[135px]" onClick={handleAdvanced}>Advanced</h2>
    {isAdvanced && (
       <div
       ref={advancedScrollRef}
       className="scroll-container gap-10 flex flex-row w-full p-4 relative"
       style={{
         scrollBehavior: "smooth", // Smooth scrolling
         scrollbarWidth: "none", // For Firefox
         msOverflowStyle: "none", // For IE/Edge
       }}
     >
  {objects.filter((obj) => obj.level === "Advanced").map((obj, idx) => (
    <div>
    <div
      key={idx}
      className="bg-white shadow-lg w-[300px] rounded-t-lg flex-shrink-0 relative"
    >
       <div className="absolute inset-0 bg-red-500 bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg items-center flex">
            <p className="mx-auto my-auto text-center text-white cursor-pointer" onClick={() => navigate(`/course/${obj.id}`)}>Go to course</p>
            {(admin == address) && (
              <>
              <p className="mx-auto my-auto text-center text-white cursor-pointer" onClick={() => navigate(`/admin/addquiz/${obj.id}`)}>Add a quiz</p>
              <br /><p className="mx-auto my-auto text-center text-white cursor-pointer" onClick={() => navigate(`/admin/lessons/${obj.id}`)}>Add a Lesson</p>
              </>
            )}
        </div>
      <img
        src={getThumbnail(obj.url)}
        className="h-[150px] bg-red-500 w-full rounded-t-lg"
        alt="Thumbnail"
      />
    </div>
    <div className="pt-2">
    <p className="text-md">{obj.title}</p>
    </div>
  </div>
  ))}
{isAOverflowing && (
  <>
  <button
        onClick={() => scroll(advancedScrollRef, "left")}
        className="absolute text-3xl font-bold top-[50%] text-white bg-gray-800 bg-opacity-75 p-2 rounded-full"
      >
       &#10094;
      </button>

      {/* Right Button */}
      <button
        onClick={() => scroll(advancedScrollRef, "right")}
        className="absolute right-0 text-3xl font-bold top-[50%] text-white bg-gray-800 bg-opacity-75 p-2 rounded-full"
      >
       &#10095;
      </button> 
      </>
)}
    </div>
)}
        </div>
        }
        {!fetching && objects.length === 0 && (
          <p>No courses found.</p>
        )}

      </div>
      <Footer />
    </div>
  );
}

export default Courses;
