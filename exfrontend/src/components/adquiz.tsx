import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import courseAbi from "../../abi"
import { useWriteContract, useReadContract } from "wagmi";
import { COURSE_ADDRESS} from "../../course.json";
import Header from "./Header";


function Createquiz(){
  const { id, lid } = useParams<{id: string; lid: string}>();
  const [formData, setFormData] = useState({
    quizText: "",
    options: [],
    correctAnswer: "",
  });

  const [isInitial, setIsInitial] = useState(false);
  const [numFields, setNumFields] = useState(0);
  const [inputs, setInputs] = useState(['']);

  // Handle number of fields for options
  const handleNumFieldsChange = (e: any) => {
    const value = parseInt(e.target.value, 10);
    setNumFields(value);
    setInputs(Array(value).fill(""));
  };

  // Handle changes in individual option input fields
  const handleInputChange = (index: any, e: any) => {
    const newInputs = [...inputs];
    newInputs[index] = e.target.value;
    setInputs(newInputs);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
      const quizText = nformData.get("quizText") as string;
      const correctAnswer = BigInt(nformData.get("correctAnswer") as string); // Convert to BigInt

  writeContract({
    address: `0x${COURSE_ADDRESS}`,
    abi: courseAbi,
    functionName: 'addQuiz',
    args: [id, lid, quizText, inputs, correctAnswer]
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
              <div id="quiz" className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-20">
          
          <h1 className="text-3xl font-bold text-gray-700 mb-6">Create a New Quiz</h1>
  
          <form onSubmit={submit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="course-title" className="block text-gray-600 font-medium mb-2">
                Quiz Question
              </label>
              <input
                type="text"
                id="Quiz-text"
                name="quizText" // Added name attribute
                placeholder="Enter the quiz question"
                value={formData.quizText}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
              />
            </div>
  
            <div>
            <label htmlFor="numFields" className="block text-gray-700 font-medium">
              Number of Options
            </label>
            <input
              type="number"
              id="numFields"
              value={numFields}
              onChange={handleNumFieldsChange}
              min="0"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            />
          </div>

          {inputs.map((input, index) => (
            <div key={index}>
              <label htmlFor={`option${index}`} className="block text-gray-700 font-medium">
                Option {index + 1}
              </label>
              <input
                type="text"
                id={`option${index}`}
                value={input}
                onChange={(e) => handleInputChange(index, e)}
                placeholder={`Enter option ${index + 1}`}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
              />
            </div>
          ))}

<div>
              <label htmlFor="Correct-answer" className="block text-gray-600 font-medium mb-2">
                Correct Answer: (If the correct answer is the first option indicate by typing 1 and so on...)
              </label>
              <input
                type="text"
                id="Correct-answer"
                name="correctAnswer" // Added name attribute
                placeholder="Enter the Correct Answer"
                value={formData.correctAnswer}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
              />
            </div>
  
            {/* Buttons */}
            <div className="flex space-x-4">
              {!isInitial && (
                <button
                  type="button"
                  className="px-6 py-3 bg-red-700 text-white rounded-lg shadow hover:bg-red-800 transition"
                  onClick={() => setIsInitial(true)}
                >
                  Create Quiz
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
                setFormData({ quizText: "", options: [], correctAnswer: "" });
                setNumFields(0);
                setInputs([]);
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

export default Createquiz;