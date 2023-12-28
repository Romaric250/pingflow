import React, { useState, useEffect } from "react";
import CourseItem from "./CourseItem";
import EnrolledCourses from "../EnrolledCourses/EnrolledCourses";

const Apps = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    // Load enrolled courses from local storage (if any) on initial render
    const storedEnrollment = localStorage.getItem("enrolledCourses");
    if (storedEnrollment) {
      const parsedEnrollment = JSON.parse(storedEnrollment);
      setEnrolledCourses(parsedEnrollment);
    }
  }, []);

  const handleEnroll = (course) => {
    if (isEnrolled(course)) {
      // Remove course from enrollment
      const updatedEnrollment = enrolledCourses.filter(
        (enrolledCourse) => enrolledCourse.id !== course.id
      );
      setEnrolledCourses(updatedEnrollment);
      saveEnrollment(updatedEnrollment);
    } else {
      // Add course to enrollment
      const updatedEnrollment = [...enrolledCourses, course];
      setEnrolledCourses(updatedEnrollment);
      saveEnrollment(updatedEnrollment);
    }
  };

  const isEnrolled = (course) => {
    return enrolledCourses.some(
      (enrolledCourse) => enrolledCourse.id === course.id
    );
  };

  const saveEnrollment = (enrollment) => {
    localStorage.setItem("enrolledCourses", JSON.stringify(enrollment));
  };

  return (
    <div className="app">
      <h1>Course Catalog</h1>
      <div className="course-list">
        {courses.map((course) => (
          <CourseItem
            key={course.id}
            course={course}
            enrolled={isEnrolled(course)}
            onEnroll={handleEnroll}
          />
        ))}
      </div>
      <EnrolledCourses enrolledCourses={enrolledCourses} />
    </div>
  );
};

export default Apps;
