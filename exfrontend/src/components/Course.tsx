import Header from "./Header";
import Footer from "./Footer";
import { useNavigate, useParams } from "react-router-dom";
import courseabi from "../../abi";
import { useReadContract, useAccount, useWriteContract } from "wagmi";
import { useEffect, useState } from "react";
import { COURSE_ADDRESS } from "../../course.json";
import '../index.css'
import ProgressBar from "./progressBar";
import { getProgress, updateProgress} from "./auth";
import { Popular } from "./popular";
import LessonsSection from "./LessonsSummary";

function Course() {

  type tLesson = {
    id: any;
    text: string;
    url: string
    description: string;
    quizzes: any;
  };


  const { id } = useParams<{ id: string }>();
  const account = useAccount();
  const address = account?.address || "";
  const navigate = useNavigate();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isCourse, setIsCourse] = useState(false);
  const [isEnroll, setIsEnroll] = useState(false);
  const [Lesson, setLesson] = useState<tLesson[]>([])
  const [url, setUrl] = useState('')
  const [prog, setProg] = useState(0);
  

 
  const handleLesson = (i: any) => {
    setCurrentLessonIndex(i);
    if (currentLessonIndex < Lesson.length && Lesson[currentLessonIndex].url) {
      setUrl(Lesson[currentLessonIndex].url);
      setIsCourse(true);
    } else {
      alert("Video not available for this lesson.");
    }
  };
  
  useEffect(() => {
    if (!isCourse) {
      setUrl(''); // Reset URL when modal closes
    }

    setCurrentLessonIndex(0)
  }, [isCourse]);
  
  const handleNextLesson = () => {
    if(Lesson.length > currentLessonIndex + 1){
    setCurrentLessonIndex(currentLessonIndex + 1);
    }
    else{
      setCurrentLessonIndex(currentLessonIndex);
    }
  }
  const handlePrevLesson = () => {
    if(currentLessonIndex - 1 > Lesson.length){
    setCurrentLessonIndex(currentLessonIndex - 1);
    }
  }

  function getThumbnail(url: any) {
    const regex = /\/embed\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    const id = match ? match[1] : null;
    return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  }

  function splitByFirstLineBreak(input: string) {
    // Find the index of the first line break
    const lineBreakIndex = input.indexOf('\n');

    // If no line break is found, return the original string as the first part, and an empty second part
    if (lineBreakIndex === -1) {
        return { firstPart: input, secondPart: '' };
    }

    // Split the string into two parts
    const firstPart = input.substring(0, lineBreakIndex);
    const secondPart = input.substring(lineBreakIndex + 1);

    return { firstPart, secondPart };
}

  // Read contract data
  const { data: course, error, isLoading } = useReadContract({
    address: `0x${COURSE_ADDRESS}`,
    abi: courseabi,
    functionName: "getCourse",
    args: [id, address || '0x0000000000000000000000000000000000000000'],
  });

  // Write contract data
  const {
    data: hash,
    error: rerror,
    isPending: isWriting,
    writeContract,
  } = useWriteContract();

  // Navigate on error
  useEffect(() => {
    if (error && !isLoading) {
      console.error("Error loading course:", error);
      navigate("../");
    }
  }, [error, isLoading, navigate]);

  // Handle writing state
  useEffect(() => {
    if (hash) {
      setIsEnroll(true);
    }
    if (rerror) {
      console.error("Error during enrollment:", rerror);
    }

    const get = async() => {
    if(account.isDisconnected){
      try{
      const guserprogress: number = await getProgress(id);
        if(guserprogress){
          console.log('number', guserprogress);
          setProg(guserprogress);
          navigate(`/course/${id}`)
        }
  }
  catch(error){
    console.log(error);
  }
}
    }
    get()

    if(prog){
      setIsEnroll(true);
    }

  }, [hash, rerror]);

  const enroll = async () => {
    try {
      writeContract({
        address: `0x${COURSE_ADDRESS}`,
        abi: courseabi,
        functionName: "enroll",
        args: [id, address],
      });
    } catch (err) {
      console.error("Enrollment error:", err);
    }
  };

  const enrollg = async () => {
    try{
      updateProgress(Number(id), 10);
      setIsEnroll(true);
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    if (course && Array.isArray(course)) {
      const [, , , , lessons] = course;
      setLesson(lessons);
    }
    if(!isWriting){
      navigate(`/course/${id}`)
    }
  }, [course]);



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

  

  if (course && !isLoading && Array.isArray(course)) {
    const [
      id,
      title,
      description,
      curl,
      lessons,
      level,
      participants,
      isEnrolled,
      ,
      p,
    ] = course;

    const img = getThumbnail(curl);
    const {firstPart, secondPart} = splitByFirstLineBreak(description)
    console.log("p:", p);
    return (
      <div className="h-full">
        <Header />
        <section className="flex flex-col md:flex-row w-full h-auto md:h-80 rounded-lg overflow-hidden px-10 mt-3">

  <div className="flex-shrink-0 w-full md:w-1/2 h-64 md:h-full relative">
  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-70 rounded-lg items-center flex">
    </div>
    <img
      src={img}
      alt="Course Thumbnail"
      className="w-full h-full object-cover"
    />
  </div>

  <div className="flex flex-col justify-center w-full md:w-1/2 p-6 md:p-10 text-gray-800">
    <h2 className="text-3xl md:text-4xl font-bold tracking-wide leading-snug">
      {title}
    </h2>
    <p className="mt-4 text-lg md:text-xl text-gray-600 leading-relaxed">
      {firstPart}
    </p>
  </div>
</section>

        <main className="px-10 py-8">
          <div className="flex flex-col md:flex-row gap-10">
            <section className="w-full md:w-2/3">
              <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
                <InfoCard
                  title="Instructor"
                  subtitle="Seitastic"
                  imgSrc="/seitastic.png"
                />
                <InfoCard
                  title={participants.length}
                  subtitle="Students Enrolled"
                  imgSrc="/stud.png"
                />
                <InfoCard title={level} subtitle="Course Level" imgSrc="/writ.png" />
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mt-10">{secondPart}</p>
              <LessonsSection lessons={lessons} onLessonClick={handleLesson} navigate={navigate} account={account}/>
            </section>
            {!account.isDisconnected && (
            <aside className="w-full md:w-1/3">
              {!isEnrolled ? (
                <button
                  onClick={enroll}
                  disabled={isWriting}
                  className="w-full p-5 bg-red-600 hover:bg-red-800 text-white font-bold text-2xl rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                  {isWriting ? "Enrolling..." : "Enroll Now"}
                </button>
              ) : (
                <div>
                  <ProgressBar progress={p} />
                  <div className="flex gap-3 mt-4">
                    <ActionButton
                      text="Start Course"
                      onClick={() => setIsCourse(!isCourse)}
                    />
                  </div>
                </div>
              )}
              <div className="bg-white p-5 mt-8 rounded-lg">
                <CourseDetail label="Lessons" value={lessons.length} />
                <CourseDetail label="Level" value={level} />
              </div>
            </aside>
            )}

{account.isDisconnected && (
            <aside className="w-full md:w-1/3">
              {!isEnroll ? (
                <button
                  onClick={enrollg}
                  className="w-full p-5 bg-red-600 hover:bg-red-800 text-white font-bold text-2xl rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                  Start
                </button>
              ) : (
                <div>
                  <ProgressBar progress={prog} />
                  <div className="flex gap-3 mt-4">
                    <ActionButton
                      text="Take Course"
                      onClick={() => setIsCourse(!isCourse)}
                    />
                  </div>
                </div>
              )}
              <div className="bg-white p-5 mt-8 rounded-lg">
                <CourseDetail label="Lessons" value={lessons.length} />
                <CourseDetail label="Level" value={level} />
              </div>
            </aside>
            )}
          </div>
          
        <Popular />
        </main>
        {isCourse && (
          <Modal>
          <div className="flex flex-col items-center space-y-4">
            <iframe
              src={url}
              className="w-[350px] h-[400px] md:w-[700px] md:h-[415px]"
              title="YouTube Video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
            {/* Buttons */}
            <div className="flex space-x-4">
            <button
                onClick={handlePrevLesson} // Replace with your function for taking quizzes
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Previous Lesson
              </button>
              <button
                onClick={() => navigate(`/course/quiz/${id}/${currentLessonIndex}`)} // Replace with your function for taking quizzes
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Take Quiz
              </button>
              <button
                onClick={() => setIsEnroll(!isEnroll)} // Replace with your function for taking quizzes
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Close
              </button>
              <button
                onClick={handleNextLesson} // Replace with your function for the next lesson
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Next Lesson
              </button>
            </div>
          </div>
        </Modal>
        
        )}
        <Footer />
      </div>
    );
  }

  return null;
}

// Sub-components
interface InfoCardProps {
  title: string;
  subtitle: string;
  imgSrc?: string; // Optional, as the check `imgSrc &&` indicates
}

const InfoCard: React.FC<InfoCardProps> = ({ title, subtitle, imgSrc }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-center">
      {imgSrc && <img src={imgSrc} alt={title} className="h-14 w-14 mx-auto mb-3 rounded-full" />}
      <p className="md:txt-xl xl:text-2xl font-bold text-red-700">{title}</p>
      <p className="text-gray-600 text-sm">{subtitle}</p>
    </div>
  );
};


interface ActionButtonProps {
  text: string;
  onClick: () => void; // Function type
}

const ActionButton: React.FC<ActionButtonProps> = ({ text, onClick }) => {
  return (
    <button
      className="p-3 bg-red-600 hover:bg-green-800 text-white font-bold text-xl rounded-lg shadow-md transition-transform transform hover:scale-105 w-full"
      onClick={onClick}
    >
      {text}
    </button>
  );
};


interface CourseDetailProps {
  label: string;
  value: string | number; // Assuming `value` could be a number or string
}

const CourseDetail: React.FC<CourseDetailProps> = ({ label, value }) => {
  return (
    <div className="py-2 border-b border-gray-300">
      <p className="text-gray-700 font-medium">{label}: {value}</p>
    </div>
  );
};


interface ModalProps {
  children: React.ReactNode; // Accepts any valid React node
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {children}
    </div>
  );
};


export default Course;
