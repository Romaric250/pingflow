import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavigationBar from "./Components/Header/Header";
import Sidebar from "./Components/Sidebar/Sidebar";
import Courses from "./Components/Courses/Courses";
import CreateCourse from "./Components/CreateCourse/CreateCourse";
import Dashboard from "./Components/Dashboard/Dashboard";
import Logout from "./Components/Logout/Logout";
import Profile from "./Components/Profile/Profile";
import Messages from "./Components/Messages/Messages";
import CourseDetails from "./Components/Courses/CourseDetails";
import EnrolledCourses from "./Components/EnrolledCourses/EnrolledCourses";
import "./App.css";
import coursesdata from "./Components/Courses/Courses";
import courses from "./Components/Courses/Course";

const App = () => {
  const [active, setActiveLink] = useState("/");

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <Router>
      <div className="app-container">
        <NavigationBar username="John Doe" userPhoto="user.jpg" />
        <div className="content">
          <Sidebar activeLink={active} onLinkClick={handleLinkClick} />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard activeRoute={active} />} />
              <Route
                path="/courses"
                element={<Courses activeRoute={active} />}
              />
              <Route
                path="/messages"
                element={<Messages activeRoute={active} />}
              />
              <Route
                path="/profile"
                element={<Profile activeRoute={active} />}
              />
              <Route
                path="/enrolled-courses"
                element={
                  <EnrolledCourses
                    activeRoute={active}
                    enrolledCourses={courses}
                  />
                }
              />
              <Route
                path="/create-course"
                element={<CreateCourse activeRoute={active} />}
              />

              {/* Route for displaying the course details */}
              <Route path="/course/:id" element={<CourseDetails />} />

              <Route path="/logout" element={<Logout activeRoute={active} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
