import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { COURSE_ADDRESS, ADMIN_ADDRESS } from "../../course.json";
import courseabi from "../../abi";
import adminAbi from "../../adminabi";

function SearchBar() {
  const { address } = useAccount();
  const navigate = useNavigate();
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
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [index, setIndex] = useState<number | null>(0); // Start fetching from index 0
  const [fetching, setFetching] = useState(true);
  const [filteredObjects, setFilteredObjects] = useState<CourseObject[]>([]); // Track filtered courses

  const { data: admin} = useReadContract({
    address: `0x${ADMIN_ADDRESS}`,
    abi: adminAbi,
    functionName: "adminaddress",
  });

  const { data: course, error, isFetching} = useReadContract({
    address: `0x${COURSE_ADDRESS}`,
    abi: courseabi,
    functionName: "getCourse",
    args:
      index !== null
        ? [index, address || "0x0000000000000000000000000000000000000000"]
        : undefined, // Fetch only if index is not null
  });

  useEffect(() => {
    if (index === null || isFetching || error) {
      if (error) console.error("Error fetching course:", error);
      return;
    }

    if (!course || !Array.isArray(course) || course.length === 0) {
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
    setIndex((prevIndex) => (prevIndex !== null ? prevIndex + 1 : null));
  }, [course, isFetching, error]);

  useEffect(() => {
    if (!fetching) {
      setFetching(true);
      setIndex(0);
    }

    if (searchQuery.trim() === "") {
      setFilteredObjects([]);
    } else {
      setFilteredObjects(
        objects.filter((obj) =>
          obj.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, objects]);

  function getThumbnail(url: any) {
    const regex = /\/embed\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    const id = match ? match[1] : null;

    return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  }

  return (
    <div className="w-full text-center relative flex flex-col items-center">
      <input
        type="text"
        placeholder="Search for a course..."
        className="w-11/12 md:w-3/4 p-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {searchQuery && (
        <div className="mt-2 w-11/12 md:w-3/4 z-50 bg-gray-300 p-2 md:p-4 shadow-md absolute top-full left-1/2 transform -translate-x-1/2 max-h-[350px] overflow-y-auto">
          {filteredObjects.length > 0 ? (
            <ul className="space-y-4">
              {filteredObjects.map((obj, idx) => (
                <li
                  key={idx}
                  className="bg-white shadow-lg rounded-lg flex flex-col md:flex-row items-start md:items-center p-4"
                >
                  <img
                    src={getThumbnail(obj.url)}
                    className="h-40 w-full md:h-[100px] md:w-[200px] bg-red-500 rounded-lg object-cover mb-4 md:mb-0 md:mr-4"
                    alt="Thumbnail"
                  />
                  <div className="w-full">
                    <p className="text-md font-medium">{obj.title}</p>
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-2">
                      <p
                        className="text-sm text-blue-500 cursor-pointer"
                        onClick={() => navigate(`/course/${obj.id}`)}
                      >
                        Go to course
                      </p>
                      {admin === address && (
                        <p
                          className="text-sm text-green-500 cursor-pointer"
                          onClick={() => navigate(`/admin/addquiz/${obj.id}`)}
                        >
                          Add a quiz
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">
              No courses match your search.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
