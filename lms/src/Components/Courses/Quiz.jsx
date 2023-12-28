import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./quiz.css";
const Quiz = () => {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswerChange = (questionId, selectedOptionId) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOptionId,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleQuizSubmit(answers);
  };

  const handleQuizSubmit = (answers) => {
    console.log("Submitted answers:", answers);
    // Perform any necessary logic with the submitted answers
  };

  const handlePrevious = () => {
    setCurrentQuestion((prevQuestion) => prevQuestion - 1);
  };

  const handleNext = () => {
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  };

  const questions = [
    {
      id: 1,
      text: "What is the capital of France?",
      options: [
        { id: 1, text: "Paris" },
        { id: 2, text: "London" },
        { id: 3, text: "Berlin" },
      ],
    },
    {
      id: 2,
      text: "Which planet is known as the Red Planet?",
      options: [
        { id: 1, text: "Mars" },
        { id: 2, text: "Jupiter" },
        { id: 3, text: "Saturn" },
      ],
    },
    // Add more questions here...
  ];

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="slider-icons">
        <div className="slider-left">
          <FaArrowLeft className="slider-icon" onClick={handlePrevious} />
        </div>
        <div className="slider-right">
          <FaArrowRight className="slider-icon" onClick={handleNext} />
        </div>
      </div>
      <h2>Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div key={currentQuestionData.id}>
          <h3>{currentQuestionData.text}</h3>
          {currentQuestionData.options.map((option) => (
            <div key={option.id}>
              <input
                type="radio"
                id={option.id}
                name={`question-${currentQuestionData.id}`}
                value={option.id}
                checked={answers[currentQuestionData.id] === option.id}
                onChange={() =>
                  handleAnswerChange(currentQuestionData.id, option.id)
                }
              />
              <label htmlFor={option.id}>{option.text}</label>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default Quiz;
