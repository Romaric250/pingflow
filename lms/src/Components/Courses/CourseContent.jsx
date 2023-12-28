import React from "react";
import "./quiz.css";

const CourseContent = () => {
  return (
    <div className="course-content">
      <div className="course-info">
        <h2>Course Name</h2>
        <p>Author: John Doe</p>
        <p>
          Course Description: Lorem ipsum dolor sit amet, consectetur adipiscing
          elit.
        </p>
      </div>
      <hr className="divider" />
      <div className="section">
        <h3>What You Will Learn</h3>
        <ul>
          <li>Topic 1</li>
          <li>Topic 2</li>
          <li>Topic 3</li>
        </ul>
      </div>
      <hr className="divider" />
      <div className="section">
        <h3>Specific Requirements</h3>
        <ul>
          <li>Requirement 1</li>
          <li>Requirement 2</li>
          <li>Requirement 3</li>
        </ul>
      </div>
      <hr className="divider" />
      <div className="section">
        <h3>Resources</h3>
        <div className="sub-section">
          <h4>Read</h4>
          <ul>
            <li>
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.theloop.space/dashboard Resource 1
              </a>
            </li>
            <li>
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.theloop.space/dashboard
              </a>
            </li>
            <li>
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.theloop.space/dashboard
              </a>
            </li>
          </ul>
        </div>
        <div className="sub-section">
          <h4>Watch</h4>
          <div className="video-grid">
            <div className="video-container">
              <iframe
                width="460"
                height="250"
                src="https://www.youtube.com/embed/VIDEO_ID"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
            <div className="video-container">
              <iframe
                width="460"
                height="250"
                src="https://www.youtube.com/embed/VIDEO_ID"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
            <div className="video-container">
              <iframe
                width="460"
                height="250"
                src="https://www.youtube.com/embed/VIDEO_ID"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
            <div className="video-container">
              <iframe
                width="460"
                height="250"
                src="https://www.youtube.com/embed/VIDEO_ID"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
