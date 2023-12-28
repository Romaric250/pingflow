import React from "react";
import { useNavigate } from "react-router-dom";
import "./enrolledcourse.css";

const EnrolledCourses = ({ enrolledCourses }) => {
  const navigate = useNavigate();

  const handleStartCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="enrolled-courses">
      <h2>Enrolled Courses</h2>
      {enrolledCourses.length === 0 ? (
        <p>No courses enrolled yet.</p>
      ) : (
        <ul>
          {enrolledCourses.map((course) => (
            <li key={course.id}>
              <div className="course-details">
                <img src={course.image} alt={course.name} />
                <div>
                  <h3>{course.name}</h3>
                  <p>{course.description}</p>
                  <button onClick={() => handleStartCourse(course.id)}>
                    Start Course
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EnrolledCourses;
