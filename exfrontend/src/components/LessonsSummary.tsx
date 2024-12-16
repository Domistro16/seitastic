interface LessonsSectionProps {
    lessons: any
    onLessonClick: any
    navigate: any
    account: any
  }

const LessonsSection: React.FC<LessonsSectionProps> = ({ lessons, onLessonClick, navigate, account }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-2xl font-bold mb-4 text-gray-700">Course Content</h3>

        <div className="divide-y divide-gray-300 max-h-[500px]">
          {lessons.map((lesson: any, idx: number) => (
            <details
              key={idx}
              className="group py-4 cursor-pointer hover:bg-gray-50"
            >
              <summary className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {lesson.lessontitle}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {lesson.description}
                  </p>
                </div>
                <span className="text-gray-500 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => onLessonClick(idx)}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md"
                >
                  Watch Video
                </button>
                {!account.isDisconnected && (lessons[idx].quizzes.length > 0) && (
                <button
                  onClick={() => navigate(`/Course/quiz/${lesson.id}/${idx}`)}
                  className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-md"
                >
                  Take Quiz
                </button>)}
                {account.isDisconnected && (lessons[idx].quizzes.length > 0) && (
                <button
                  onClick={() => navigate(`/Course/quiz/${lesson.id}/${idx}`)}
                  className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-md"
                  disabled
                >
                  Take Quiz
                </button>)}
              </div>
            </details>
          ))}
        </div>

        <p className="text-gray-600 text-sm mt-10">Note: To take a quiz you must have your wallet connected</p>
      </div>
    );
  }
  export default LessonsSection