import React, { useState } from "react";
import "./courses.css"; // Import CSS file for styling
import Quiz from "./Quiz";
import DailyReportModal from "./DailyReportModal";
import CourseContent from "./CourseContent";

const CourseDetails = ({ params }) => {
  // Dummy course data
  const dummyCourseData = {
    id: 1,
    name: "Dummy Course",
    description: "This is a dummy course for testing purposes.",
    image: "dummy-course.jpg",
    price: "$99",
    duration: "2 weeks",
  };

  const [currentDay, setCurrentDay] = useState(null);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showStandupForm, setShowStandupForm] = useState(false);
  const [standupFormSubmitted, setStandupFormSubmitted] = useState(false);
  const [nextDayUnlocked, setNextDayUnlocked] = useState(false);

  const handleStartCourse = () => {
    setCurrentDay(1);
  };

  const handleDayClick = (day) => {
    setCurrentDay(day);
    setShowQuizForm(true);
    setShowContent(false);
    setShowStandupForm(false);
  };

  const handleQuizSubmit = () => {
    setShowQuizForm(false);
    setShowContent(true);
  };

  const handleCompleteDay = () => {
    setShowStandupForm(true);
  };

  const handleStandupSubmit = () => {
    setShowStandupForm(false);
    setShowContent(false); // Hide the content for the current day
    setStandupFormSubmitted(true);
    setNextDayUnlocked(true);
    setTimeout(() => {
      setNextDayUnlocked(false);
      setCurrentDay(currentDay + 1);
    }, 60000); // Unlock next day after 1 minute
  };

  return (
    <div className="course__detail">
      <h1>Course Details</h1>
      {/* <div className="course__info">
        <h2>{dummyCourseData.name}</h2>
        <img src={dummyCourseData.image} alt={dummyCourseData.name} />
        <p>{dummyCourseData.description}</p>
        <p>Price: {dummyCourseData.price}</p>
        <p>Duration: {dummyCourseData.duration}</p>
      </div> */}
      <div className="course__content">
        <h2>Course Content</h2>
        <button onClick={handleStartCourse}>Start Course</button>
        {currentDay && (
          <div className="day__list">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((day) => (
              <button
                key={day}
                className={currentDay === day ? "active" : ""}
                onClick={() => handleDayClick(day)}
                disabled={standupFormSubmitted && day > currentDay}
              >
                Day {day}
              </button>
            ))}
          </div>
        )}
        {showQuizForm && (
          <div className="quiz__form quiz-container">
            <h3>Quiz for Day {currentDay}</h3>
            <Quiz />
            <button type="submit" onClick={handleQuizSubmit}>
              Submit Quiz
            </button>
          </div>
        )}
        {showContent && (
          <div className="course__data">
            <h3>Content for Day {currentDay}</h3>
            <CourseContent />
            <button id="button__complete" onClick={handleCompleteDay}>
              Complete Day
            </button>
          </div>
        )}
        {showStandupForm && (
          <div className="">
            <DailyReportModal submit={handleStandupSubmit} />
          </div>
        )}
        {standupFormSubmitted && (
          <div className="next-day">
            <p>Next day will unlock in 1 minute</p>
            {nextDayUnlocked ? (
              <button
                id="button__next-day"
                onClick={() => handleDayClick(currentDay + 1)}
              >
                Next Day
              </button>
            ) : (
              <p>Next day will be available soon!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;

// import React from "react";

// const CourseDetails = ({ match }) => {
//   const projectId = match.params.projectId;

//   // Assume you have a list of projects
//   const projects = [
//     {
//       id: 1,
//       name: "Project 1",
//       image: "project1.jpg",
//       description: "Description of Project 1",
//     },
//     {
//       id: 2,
//       name: "Project 2",
//       image: "project2.jpg",
//       description: "Description of Project 2",
//     },
//     // Add more project objects as needed
//   ];

//   // Find the project with the matching projectId
//   const project = projects.find((p) => p.id === Number(projectId));

//   if (!project) {
//     return <div>Project not found</div>;
//   }

//   return (
//     <div>
//       <h1>Project Details</h1>
//       <img src={project.image} alt={project.name} />
//       <h2>{project.name}</h2>
//       <p>
//         Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim aliquid
//         optio eaque asperiores labore reiciendis minima itaque porro in. Nisi
//         asperiores expedita explicabo corporis dolorum ipsum molestiae aliquam
//         ea animi a amet cum beatae suscipit, consequatur, quae reiciendis est
//         officiis quas illum odit voluptas velit! Id magni cupiditate quibusdam
//         facilis quidem recusandae error minus a esse quia earum perspiciatis
//         facere nemo, voluptatibus, iusto veritatis! Quibusdam quo fugiat facilis
//         ipsum vel temporibus illo fugit, voluptas esse, sed id alias
//         consequuntur quam nemo deleniti perferendis possimus nobis illum
//         reprehenderit aut. Repudiandae qui voluptatum molestias distinctio.
//         Excepturi, eligendi facilis minus quis ad aliquam delectus nobis cumque
//         similique rem. Cumque quisquam non dolorum earum eum maiores similique
//         vero soluta laborum impedit illum modi aperiam reprehenderit quae qui
//         cum, voluptatem esse ipsum quas deserunt porro repellendus architecto
//         obcaecati corrupti. Reiciendis recusandae quia esse nobis perferendis at
//         fuga molestiae. Error suscipit assumenda officia aut mollitia, debitis,
//         esse iusto ad nemo incidunt magnam recusandae libero deserunt? Culpa rem
//         laborum maxime assumenda fugiat eaque molestias, dolor aliquid hic
//         voluptate consequuntur cupiditate porro mollitia cum aut saepe itaque
//         explicabo a. Beatae voluptas voluptates vitae, deserunt id temporibus
//         recusandae nulla animi quasi praesentium, voluptatem pariatur iusto
//         facilis culpa amet veniam?
//       </p>
//       <p>{project.description}</p>
//     </div>
//   );
// };

// export default CourseDetails;
