import React, { useState } from "react";
import CategoryBar from "./CategoryBar";
import CourseList from "./CourseList";
import EnrollmentConfirmation from "./EnrollmentConfirmation";
import courses from "./Course";
const CoursesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [enrolledCourse, setEnrolledCourse] = useState("");

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleEnroll = (courseName) => {
    setEnrolledCourse(courseName);
  };

  const courses = [
    {
      id: 1,
      name: "Frontend Development",
      category: "Frontend",
      image: "https://example.com/frontend.jpg",
      description: "Learn the fundamentals of frontend web development.",
    },
    {
      id: 2,
      name: "Backend Development",
      category: "Backend",
      image: "https://example.com/backend.jpg",
      description: "Master the skills required for backend web development.",
    },
    {
      id: 3,
      name: "Python Programming",
      category: "Python",
      image: "https://example.com/python.jpg",
      description: "Explore the power of Python programming language.",
    },
    {
      id: 4,
      name: "Design Thinking",
      category: "Design Thinking",
      image: "https://example.com/design-thinking.jpg",
      description: "Learn a human-centered approach to problem-solving.",
    },
    {
      id: 5,
      name: "Educational Technology",
      category: "Educational",
      image: "https://example.com/educational.jpg",
      description: "Discover the use of technology in education.",
    },
    {
      id: 6,
      name: "Robotics Engineering",
      category: "Robotics",
      image: "https://example.com/robotics.jpg",
      description: "Build and program robots for various applications.",
    },
  ];

  const categories = Array.from(
    new Set(courses.map((course) => course.category))
  );

  const filteredCourses =
    selectedCategory === ""
      ? courses
      : courses.filter((course) => course.category === selectedCategory);

  return (
    <div className="courses-page">
      <h1>Courses</h1>
      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
      />
      <CourseList courses={filteredCourses} handleEnroll={handleEnroll} />
      {enrolledCourse && (
        <EnrollmentConfirmation enrolledCourse={enrolledCourse} />
      )}
    </div>
  );
};

export default CoursesPage;
