import React, { useState } from "react";
import "./quiz.css";

const DailyReportModal = ({ onFormSubmit, submit }) => {
  const [learned, setLearned] = useState("");
  const [projects, setProjects] = useState("");
  const [problems, setProblems] = useState("");
  const [modalOpen, setModalOpen] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const report = {
      learned,
      projects,
      problems,
    };
    onFormSubmit(report);
  };

  const handleClose = () => {
    setModalOpen(false);
    // Add any additional logic here to handle modal close
  };

  if (!modalOpen) {
    return null; // Don't render the modal if modalOpen is false
  }

  return (
    <div className="standup__form">
      <div className="modal">
        <h2>Daily Report</h2>
        <form className="daily-report-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="learned">What did you learn today?</label>
            <textarea
              id="learned"
              className="report-textarea"
              rows="4"
              cols="50"
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
              minLength={300}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="projects">Add project links and GitHub URLs:</label>
            <textarea
              id="projects"
              className="report-textarea"
              rows="4"
              cols="50"
              value={projects}
              onChange={(e) => setProjects(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label htmlFor="problems">
              Did you encounter any problems today?
            </label>
            <textarea
              id="problems"
              className="report-textarea"
              rows="4"
              cols="50"
              value={problems}
              onChange={(e) => setProblems(e.target.value)}
            ></textarea>
          </div>
          <div className="button-group">
            <button type="submit" onClick={submit} className="submit-button">
              Submit Report
            </button>
            <button
              type="button"
              className="close-button"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DailyReportModal;
