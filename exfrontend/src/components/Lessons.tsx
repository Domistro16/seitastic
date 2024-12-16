import { useEffect} from "react";
import { useReadContract, useAccount } from "wagmi";
import courseabi from "../../abi";
import Header from "./Header";
import '../index.css'
import { useNavigate, useParams } from "react-router-dom";
import { COURSE_ADDRESS,} from "../../course.json"

const List = () => {
    const { id } = useParams<{ id: string }>();
  const account = useAccount();
  const address = account?.address || "";
  const navigate = useNavigate();

  const { data: course, error, isLoading } = useReadContract({
    address: `0x${COURSE_ADDRESS}`,
    abi: courseabi,
    functionName: "getCourse",
    args: [id, address],
  });

  useEffect(() => {
    if (isLoading || error) {
      if (error) console.error("Error fetching course:", error);
      return;
    }

    console.log("Fetched course:", course);

    if (!course || !Array.isArray(course) || course.length === 0) {
      console.log('no course detected');
    }

  }, [course, isLoading, error]);

  if(course && Array.isArray(course) && !isLoading){

    const [
        id,
        ,
        ,
        ,
        lessons,
        ,
        ,
        ,
        ,
        ,
      ] = course;


    return(
    <div className="h-full">
            <Header />
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 m-8">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">To add a quiz to "{course[1]}" select any of the following lessons</h1>
            {lessons.map((lesson: any, idx: any) => (
                    <li key={idx} onClick={() => navigate(`/admin/addquiz/${id}/${idx}`)} className="text-gray-700 cursor-pointer font-semibold text-lg mb-4">{lesson.lessontitle}</li>
            ))}
        </div>
    </div>
    )
}
return null;

}

export default List;