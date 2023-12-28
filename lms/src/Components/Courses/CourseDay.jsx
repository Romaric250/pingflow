// CourseDay.jsx
import React from "react";
import { Link } from "react-router-dom";

const CourseDay = ({ courseId, day }) => {
  return (
    <div>
      <h2>Day {day.dayNumber}</h2>
      {day.completed ? (
        <p>Day completed</p>
      ) : (
        <Link to={`/course/${courseId}/day/${day.dayNumber}/quiz`}>
          Start Day
        </Link>
      )}
    </div>
  );
};

export default CourseDay;
