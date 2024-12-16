import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import courseabi from "../../abi";
import userabi from "../../userAbi";
import { COURSE_ADDRESS, USER_ADDRESS } from "../../course.json";
import { updateProgress } from "./auth";

function Quiz() {
  type tQuiz = {
    id: any;
    questionText: string;
    options: Array<string>;
    correctAnswer: number;
  };
  type tLesson = {
    id: any;
    lessontitle: string;
    url: string
    description: string;
    quizzes: any;
  };

  const { id, lid } = useParams<{ id: string; lid: string }>();
  const account = useAccount();
  const address = account?.address || "";
  const navigate = useNavigate();
  const [Quiz, setQuiz] = useState<tQuiz[]>([]);
  const [L, setL] = useState<tLesson>();
  const [length, setLength] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [initprog, setInitProg] = useState(0);
  const [prog, setProg] = useState(0);
  const [table, setTable] = useState<object[]>([]);
  const [compL, setCompL] = useState([0])
  const [isTrue, setIstrue] = useState(false)

  const { data: course, error, isLoading } = useReadContract({
    address: `0x${COURSE_ADDRESS}`,
    abi: courseabi,
    functionName: "getCourse",
    args: [id, address || '0x0000000000000000000000000000000000000000'],
  });

  useEffect(() => {
    if (error && !isLoading) {
      console.error("Error loading course:", error);
      navigate("../");
      return;
    }
  
    if (!error && !isLoading && course && Array.isArray(course)) {
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
        userProgress,
        completedLessons,
      ] = course;
  
      // Ensure lessons is valid and handle invalid cases
      if (Array.isArray(lessons) && Array.isArray(completedLessons)) {
        const lesson: tLesson = lessons[Number(lid)];
        setLength(lessons.length);
        setL(lesson);
        setCompL(completedLessons);
      } else {
        console.error("Invalid lessons data:", lessons);
        navigate("../");
        return;
      }
  
      // Ensure `L` logic runs only after it's set
      if (L && Array.isArray(L.quizzes)) {
        if (L.quizzes.length > 0) {
          setQuiz(L.quizzes);
          setOptions(L.quizzes[0].options);
          setInitProg(userProgress);
        } else {
          navigate(`/course/${id}`);
        }
      } else if (!L || typeof L === "undefined") {
        console.error("L is null or undefined");
      }
    }
  }, [error, isLoading, course, navigate, id, lid, L]);
  
  console.log("initial progress", initprog)
  console.log("current progress", prog);
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, item: string) => {
    event.dataTransfer.setData("text/plain", item);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
  const item = event.dataTransfer.getData("text");
  event.preventDefault();

  if (answer === item) return; // Prevent duplicate drops

  // Restore the previous answer to the options list
  if (answer) {
    setOptions((prev) => [...prev, answer]);
  }

  // Set the new answer and remove it from the options
  setAnswer(item);
  setOptions((prev) => prev.filter((opt) => opt !== item));
};

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < Quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setOptions(Quiz[currentQuestionIndex + 1].options);
      setAnswer(""); // Reset answer for next question
      setIsConfirmed(false);
    }
  };

  const {
    error: rerror,
    isPending: isWriting,
    writeContract,
} = useWriteContract();


const handleConfirm = () => {
  const index = Quiz[currentQuestionIndex].correctAnswer;
  const correctAnswerText = Quiz[currentQuestionIndex].options[index - 1];

  // Check if the dropped answer is correct
  if (answer === correctAnswerText) {
      const increment = (100) / Quiz.length; // Score percentage per question
      const updatedProgress = prog + increment // Ensure progress doesn't exceed 100%
      setProg(updatedProgress);

      const data: any = {
        question: Quiz[currentQuestionIndex].questionText,
        chosen: answer,
        Answer: correctAnswerText,
        score: increment
      }

      setTable((prev) => [...prev, data])

      console.log("compl:", compL);
      if (!compL.includes(Number(lid))){
        console.log("True")
        setIstrue(true);
      }

  }
  else{
    const data: any = {
      question: Quiz[currentQuestionIndex].questionText,
      chosen: answer,
      Answer: correctAnswerText,
      score: 0
    }

    setTable((prev) => [...prev, data])

  }
  setIsConfirmed(true);
};

const handlefinal = () => {
  // Determine if progress needs to be updated
  console.log('final progress', prog)
  if (!isTrue) {
    const inc = (100 - 10) / length;

    const upd = initprog + inc;

    if(!account.isDisconnected){
      try {
          writeContract({
              address: `0x${USER_ADDRESS}`,
              abi: userabi,
              functionName: "updateCourseProgress",
              args: [Number(id), Number(lid), upd], // Use the updated progress
          });
      } catch (error) {
          console.error("Error updating progress:", error);
      }
    }
  
    else if(account.isDisconnected){
      try{
        updateProgress(Number(id || ''), prog);
      }
      catch(error){

      }
    }
  }
   else {
      console.log("Progress not updated as course already passed");
  }

  setIsSubmitted(true);
};

  

  useEffect(() => {
    if(rerror){
      console.log(rerror)
    }
  }

  )

  if(isLoading){
    return(
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-4 bg-gray-100">
        <img
          src="http://localhost:5173/seitastic.png"
          className="h-20 animate-bounce"
          alt="Loading"
        />
      </div>
    )
  }

  if(isWriting){
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-4 bg-gray-100">
        <img
          src="http://localhost:5173/seitastic.png"
          className="h-20 animate-bounce"
          alt="Loading"
        />
      </div>
  }

  if (!error && !isLoading && Quiz.length > 0) {
    return (
      <div className="h-screen bg-gray-800 flex items-center justify-center w-full">
        {!isSubmitted && (
        <div className="mx-auto shadow-xl p-10 border-gray-400 border-1 border rounded-lg">
          <h1 className="text-gray-100 text-2xl p-5">Question:</h1>
          {Quiz[currentQuestionIndex] && (
            <h1 className="text-gray-100 text-3xl p-5">
              {Quiz[currentQuestionIndex].questionText}
            </h1>
          )}

          {/* Answer Drop Zone */}
          <div
            id="dropZone"
            className="p-10 border-dashed border-2 border-gray-500 rounded-lg text-gray-100 text-xl flex justify-center items-center mb-10 h-16"
          >
            <div
              className="px-4 py-2 flex justify-center border border-1 border-gray-400 rounded-lg text-gray-100 cursor-pointer bg-gray-700"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {answer || "Drop here"}
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-col md:flex-row gap-6 mx-auto justify-center p-10">
            {options.map((option, index) => (
              <div
                key={index}
                className="px-4 py-2 flex justify-center border border-1 border-gray-400 rounded-lg text-gray-100 cursor-pointer bg-gray-700"
                draggable
                onDragStart={(e) => handleDragStart(e, option)}
              >
                {option}
              </div>
            ))}
          </div>
          <div className="flex gap-6">
          {answer && (
            <button
              onClick={handleConfirm}
              className="mt-10 px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Confirm
            </button>
          )}
          {isConfirmed && currentQuestionIndex < Quiz.length - 1 && (
            <button
              onClick={handleNextQuestion}
              className="mt-5 px-6 bg-blue-600 text-white rounded-lg"
            >
              Next
            </button>
          )}

        {isConfirmed && currentQuestionIndex == Quiz.length - 1 && (
            <button
              onClick={handlefinal}
              className="mt-5 px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Submit
            </button>
          )}
          </div>
        </div>
        )}

{isSubmitted && (
  <div className="mx-auto shadow-xl p-6 md:p-10 border border-gray-400 rounded-lg max-w-full md:max-w-4xl bg-gray-800">
  <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">Quiz Summary</h2>
  <div className="overflow-x-auto">
    <table className="table-auto border-collapse border border-gray-500 w-full text-gray-100">
      <thead>
        <tr>
          <th className="border border-gray-400 px-4 py-2 text-left text-sm md:text-base">Question</th>
          <th className="border border-gray-400 px-4 py-2 text-left text-sm md:text-base">Your Answer</th>
          <th className="border border-gray-400 px-4 py-2 text-left text-sm md:text-base">Correct Answer</th>
          <th className="border border-gray-400 px-4 py-2 text-left text-sm md:text-base">Score</th>
        </tr>
      </thead>
      <tbody>
        {table.map((entry: any, index: number) => (
          <tr key={index}>
            <td className="border border-gray-400 px-4 py-2 text-sm md:text-base">{entry.question}</td>
            <td className="border border-gray-400 px-4 py-2 text-sm md:text-base">{entry.chosen}</td>
            <td className="border border-gray-400 px-4 py-2 text-sm md:text-base">{entry.Answer}</td>
            <td className="border border-gray-400 px-4 py-2 text-sm md:text-base">{entry.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 mt-6">
    <button
      onClick={() => { navigate(`/course/${id}`); }}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
    >
      Go back to Course
    </button>
    <button
      onClick={() => { navigate(`/courses`); }}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
    >
      Return back to courses
    </button>
  </div>
</div>

)}

      </div>
    );
  }

  return null;
}

export default Quiz;
