import { Link } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiMessageSquare,
  FiUser,
  FiLogOut,
  FiPlusSquare,
} from "react-icons/fi";
import "./sidebar.css";

const Sidebar = ({ activeLink }) => {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <Link to="/" className={activeLink === "/" ? "active" : ""}>
            <FiHome /> Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/enrolled-courses"
            className={activeLink === "/Enrolled-courses" ? "active" : ""}
          >
            <FiBook /> Enrolled Courses
          </Link>
        </li>
        <li>
          <Link
            to="/courses"
            className={activeLink === "/courses" ? "active" : ""}
          >
            <FiBook /> Courses
          </Link>
        </li>
        <li>
          <Link
            to="/messages"
            className={activeLink === "/messages" ? "active" : ""}
          >
            <FiMessageSquare /> Messages
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className={activeLink === "/profile" ? "active" : ""}
          >
            <FiUser /> Profile
          </Link>
        </li>
        <li>
          <Link
            to="/create-course"
            className={activeLink === "/create-course" ? "active" : ""}
          >
            <FiPlusSquare /> Create Course
          </Link>
        </li>
        <li>
          <Link
            to="/logout"
            className={activeLink === "/logout" ? "active" : ""}
          >
            <FiLogOut /> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
