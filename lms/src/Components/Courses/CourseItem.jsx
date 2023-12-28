import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CourseItem = ({ course }) => {
  const [enrolled, setEnrolled] = useState(false);
  const [confirmDeenroll, setConfirmDeenroll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEnrollment = localStorage.getItem("enrolledCourses");
    if (storedEnrollment) {
      const parsedEnrollment = JSON.parse(storedEnrollment);
      if (parsedEnrollment.includes(course.id)) {
        setEnrolled(true);
      }
    }
  }, [course.id]);

  const handleEnrollClick = () => {
    if (enrolled) {
      setConfirmDeenroll(true);
    } else {
      setEnrolled(true);
      addToEnrollment(course.id);
    }
  };

  const handleConfirmDeenroll = () => {
    alert("Deleting all data...");
    setEnrolled(false);
    setConfirmDeenroll(false);
    removeFromEnrollment(course.id);
  };

  const addToEnrollment = (courseId) => {
    const storedEnrollment = localStorage.getItem("enrolledCourses");
    if (storedEnrollment) {
      const parsedEnrollment = JSON.parse(storedEnrollment);
      const updatedEnrollment = [...parsedEnrollment, courseId];
      localStorage.setItem(
        "enrolledCourses",
        JSON.stringify(updatedEnrollment)
      );
    } else {
      localStorage.setItem("enrolledCourses", JSON.stringify([courseId]));
    }
  };

  const removeFromEnrollment = (courseId) => {
    const storedEnrollment = localStorage.getItem("enrolledCourses");
    if (storedEnrollment) {
      const parsedEnrollment = JSON.parse(storedEnrollment);
      const updatedEnrollment = parsedEnrollment.filter(
        (id) => id !== courseId
      );
      localStorage.setItem(
        "enrolledCourses",
        JSON.stringify(updatedEnrollment)
      );
    }
  };

  const handleStartClick = () => {
    navigate(`/course/${course.id}`);
  };

  return (
    <div className="course-item">
      <div className="course__image">
        <img src={course.image} alt={course.name} />
      </div>

      <div className="course-description">{course.description}</div>
      {enrolled && (
        <div className="button-group">
          <button className="start-button" onClick={handleStartClick}>
            Start
          </button>
          <button className="enrolled-button" onClick={handleEnrollClick}>
            Enrolled
          </button>
        </div>
      )}
      {!enrolled && !confirmDeenroll && (
        <button className="enroll-button" onClick={handleEnrollClick}>
          Enroll
        </button>
      )}
      {!enrolled && confirmDeenroll && (
        <div className="confirm-deenroll">
          <p>Are you sure you want to de-enroll?</p>
          <button onClick={handleConfirmDeenroll}>Yes</button>
          <button onClick={() => setConfirmDeenroll(false)}>No</button>
        </div>
      )}
      {enrolled && confirmDeenroll && (
        <div className="confirm-deenroll">
          <p>All data will be deleted. Confirm de-enrollment?</p>
          <button onClick={handleConfirmDeenroll}>Confirm</button>
          <button onClick={() => setConfirmDeenroll(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default CourseItem;
