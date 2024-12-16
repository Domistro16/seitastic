import Home from "./components/Landingpage";
import Course from "./components/Course";
import Admin from "./components/Admin"
import { Route, Routes } from "react-router-dom";
import CreateCourse from "./components/adcourse";
import UserProfile from "./components/User"
import Quiz from "./components/Quiz"
import Signup from "./components/Signup"
import Auth from "./components/Googleuser";
import Courses from "./components/Courses";
import Createquiz from "./components/adquiz";
import Lessons from "./components/addLessons";
import List from "./components/Lessons";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/user" element={<UserProfile />}/>
      <Route path="/Course/quiz/:id/:lid" element={<Quiz/>} />
      <Route path='/admin' element={<Admin/>} />
      <Route path="/admin/adcourse" element={< CreateCourse/>} />
      <Route path="/admin/addquiz/:id/:lid" element={< Createquiz/>} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/Course/:id" element={<Course />}/>
      <Route path="/Sign-up" element={<Signup />} />
      <Route path="/gsign" element={<Auth />} />
      <Route path="/admin/addLesson/:id" element={<Lessons />} />
      <Route path="/admin/Lessons/:id" element={<List /> } />
    </Routes>
  );
}

export default App;
