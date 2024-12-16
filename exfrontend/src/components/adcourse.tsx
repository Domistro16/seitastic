import { useEffect, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import adminAbi from "../../adminabi";
import courseAbi from "../../abi"
import { useNavigate } from "react-router-dom";
import {ADMIN_ADDRESS} from "../../course.json"
import { COURSE_ADDRESS } from "../../course.json"
import Header from "./Header"

function CreateCourse() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    level: "",
    isfree: false,
  });
  const navigate = useNavigate();
  const [isInitial, setIsInitial] = useState(false);
  const levels = ['Beginner', 'Intermediate', 'Expert'];
  const bools = ["true", "false"];

  const { data: admin,  isPending } = useReadContract({
    address: `0x${ADMIN_ADDRESS}`,
    abi: adminAbi,
    functionName: "adminaddress",
  });


  const {data: hash, error: rerror, isPending: isLoading, writeContract} = useWriteContract();

  async function submit(e: any){
    e.preventDefault();
    const nformData = new FormData(e.target);

    try{
  writeContract({
    address: `0x${COURSE_ADDRESS}`,
    abi: courseAbi,
    functionName: 'addCourse',
    args: [nformData.get('title'), nformData.get('description'), nformData.get('level'), nformData.get('url'), nformData.get('isFree')]
  })
}
catch(error){
  console.error(error)
}
  }
  const img = getThumbnail(formData.url);

  useEffect(() => {
    async function adnav() {
      if(admin){
        console.log(admin)
          navigate('/admin/adcourse');

      }
    if(await !admin){
      return <div className="mx-auto my-auto">Are you the admin?</div>
    }
  }
    if (rerror) {
      console.log(rerror);
    }

    if(hash){
      console.log(hash)
    }
    adnav();
  }, [admin, rerror, hash]);

  if (isPending) {
    return <div className="fixed inset-0 flex items-center justify-center bg-opacity-25 bg-gray-900">
    <img
      src="http://localhost:5173/seitastic.png"
      className="h-20 animate-bounce"
      alt="Loading"
    />
  </div>
  }
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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  function getThumbnail(url: any) {
    const regex = /\/embed\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    const id = match ? match[1] : null;

    return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  }

  return (
    <div className="h-full">
      <Header />
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 m-8">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">Create a New Course</h1>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label htmlFor="course-title" className="block text-gray-600 font-medium mb-2">
              Course Title
            </label>
            <input
              type="text"
              id="course-title"
              name="title"
              placeholder="Enter the course title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-600 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Provide a brief description of the course"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            ></textarea>
          </div>

          <div>
            <label htmlFor="url" className="block text-gray-600 font-medium mb-2">
              Course URL
            </label>
            <input
              type="text"
              id="url"
              name="url"
              placeholder="Enter course URL"
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

          
<div>
<label htmlFor="level-select" className="block text-gray-600 font-medium mb-2">Choose a level:</label>
      <select
        id="course-select"
        name="level"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
        onChange={handleChange}
      >
        <option value="" disabled>Select a course</option>
        {levels.map((level, index) => (
          <option key={index} value={level}>
            {level}
          </option>
        ))}
      </select>
          </div>
          <div>
            <label htmlFor="free-select" className="block text-gray-600 font-medium mb-2">Is the course free?</label>
              <select
                id="isFree"
                name="isFree"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                onChange={handleChange}
              >
                <option value="" disabled>Select a course</option>
                {bools.map((bool, index) => (
                  <option key={index} value={bool}>
                    {bool}
                  </option>
                ))}
              </select>
          </div>

          <div className="flex space-x-4">
            {!isInitial && (
              <button
                type="button"
                className="px-6 py-3 bg-red-700 text-white rounded-lg shadow hover:bg-red-800 transition"
                onClick={() => setIsInitial(true)}
              >
                Create Course
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
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCourse;
