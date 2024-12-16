import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import courseAbi from "../../abi"
import { useWriteContract, useReadContract } from "wagmi";
import { COURSE_ADDRESS} from "../../course.json";
import Header from "./Header";

const Lessons = () => {
    const { id } = useParams<{id: string}>();
    const [isInitial, setIsInitial] = useState(false);
    const [formData, setFormData] = useState({
        text: "",
        description: "",
        url: "",
      })

      function getThumbnail(url: any) {
        const regex = /\/embed\/([a-zA-Z0-9_-]+)/;
        const match = url.match(regex);
        const id = match ? match[1] : null;
    
        return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
      }
      const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
      const img = getThumbnail(formData.url);
      const{data: counter} = useReadContract({
        address: `0x${COURSE_ADDRESS}`,
        abi: courseAbi,
        functionName: 'numCourses',
      })
    
    
    const {data: hash, error: rerror, isPending: isLoading, writeContract} = useWriteContract();

  async function submit(e: any){
    e.preventDefault();
    try{
      // Use form data and inputs
      const nformData = new FormData(e.target);
      const text = nformData.get("text") as string;
      const description = nformData.get("description") as string; 
      const url = nformData.get("url") as string;

  writeContract({
    address: `0x${COURSE_ADDRESS}`,
    abi: courseAbi,
    functionName: 'addLesson',
    args: [id, text, url, description]
  })
}
catch(error){
  console.error(error)
}
  }

  useEffect(() => {
    if(hash){
      console.log('hash:', hash)
    }
    if(counter){
      console.log('counter:', counter)
    }
    if(rerror){
      console.log('error:', rerror)
    }
  }, [hash, rerror])
  if(isLoading){
    return(
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-25 bg-gray-900">
        <img
          src="http://localhost:5173/seitastic.png"
          className="h-20 animate-bounce"
          alt="Loading"
        />
      </div>
    )
  }
    

    return(
        <>
        <Header />
        <div id="Lesson" className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-20">
            
          <h1 className="text-3xl font-bold text-gray-700 mb-6">Create a New Lesson</h1>
  
          <form onSubmit={submit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="lesson-title" className="block text-gray-600 font-medium mb-2">
                Lesson Title
              </label>
              <input
                type="text"
                id="text"
                name="text" // Added name attribute
                placeholder="Enter the Lesson's Title"
                value={formData.text}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
              />
            </div>

            <div>
              <label htmlFor="lesson-description" className="block text-gray-600 font-medium mb-2">
                Lesson Description
              </label>
              <textarea
              id="description"
              name="description"
              placeholder="Provide a brief description of the Lesson"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            ></textarea>
            </div>

            <div>
              <label htmlFor="lesson-url" className="block text-gray-600 font-medium mb-2">
                Lesson's url
              </label>
              <input
                type="text"
                id="url"
                name="url" // Added name attribute
                placeholder="Enter the Lesson's Url"
                value={formData.url}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
              />
            </div>
  
            {isInitial && (
            <div>
              <label htmlFor="image" className="block text-gray-600 font-medium mb-2">
                Course Preview
              </label>
              <img src={img} alt="Thumbnail" className="rounded-lg shadow-md" />
            </div>
          )}


            {/* Buttons */}
            <div className="flex space-x-4">
              {!isInitial && (
                <button
                  type="button"
                  className="px-6 py-3 bg-red-700 text-white rounded-lg shadow hover:bg-red-800 transition"
                  onClick={() => setIsInitial(true)}
                >
                  Add Lesson
                </button>
              )}
              {isInitial && (
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-700 text-white rounded-lg shadow hover:bg-red-800 transition"
                >
                  Confirm
                </button>
              )}
              <button
              type="reset"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
              onClick={() => {
                setFormData({ text: "", description: "", url: "" });
              }}
            >
              Reset
            </button>
            </div>
          </form>
        </div>
        </>
    )
}

export default Lessons