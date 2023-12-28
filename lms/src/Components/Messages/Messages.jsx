import React, { useState } from "react";
import "./message.css";

const Messages = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipients, setRecipients] = useState([
    { id: 1, name: "Romaric Lonfonyuy" },
    { id: 2, name: "Phileomon Tebo" },
    { id: 3, name: "Josias Aurel" },
    { id: 3, name: "Zenith Noble" },
  ]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: {
        name: "Romaric",
        profileImage: "path/to/profile-image-1.jpg",
      },
      content:
        "Hello dear coders, today we look at the introdcution to javascript",
      timestamp: "2023-10-26 14:30",
    },
    {
      id: 2,
      sender: {
        name: "Phileom",
        profileImage: "path/to/profile-image-2.jpg",
      },
      content: "Hello to all, today we will look at UI/UX designing",
      timestamp: "2023-10-26 15:45",
    },
    {
      id: 3,
      sender: {
        name: "Romaric",
        profileImage: "path/to/profile-image-1.jpg",
      },
      content:
        "Hello dear coders, today we look at the introdcution to javascript",
      timestamp: "2023-10-26 14:30",
    },
    {
      id: 3,
      sender: {
        name: "Phileom",
        profileImage: "path/to/profile-image-2.jpg",
      },
      content: "Hello to all, today we will look at UI/UX designing",
      timestamp: "2023-10-26 15:45",
    },
  ]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleRecipientChange = (e) => {
    setRecipient(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && message && recipient) {
      // Logic to send the message
      console.log("Message sent!");
      // Clear the form fields
      setTitle("");
      setMessage("");
      setRecipient("");
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div className="message-page">
      <div className="messages-section">
        <h2 className="title__message">Messages</h2>
        {messages.map((message) => (
          <div key={message.id} className="message-item">
            <div className="sender-info">
              <img
                src={message.sender.profileImage}
                alt={message.sender.name}
                className="profile-image"
              />
              <span className="sender-name">{message.sender.name}</span>
            </div>
            <div className="message-content">
              <p>{message.content}</p>
              <span className="timestamp">{message.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="send-message-section">
        <h2 className="title__message">Send Message</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              value={message}
              onChange={handleMessageChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="recipient">Recipient:</label>
            <select
              id="recipient"
              value={recipient}
              onChange={handleRecipientChange}
              required
            >
              <option value="">Select recipient</option>
              {recipients.map((recipient) => (
                <option key={recipient.id} value={recipient.id}>
                  {recipient.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Messages;
