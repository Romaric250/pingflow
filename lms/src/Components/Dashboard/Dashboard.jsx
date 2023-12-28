import Apps from "../Courses/Apps";
import Charts from "./Chart";
import "./dashboard.css";
import PieChart from "./PieChart";
import Score from "./Score";

const Dashboard = ({ activeRoute }) => {
  return (
    <div className="dashboard">
      <div className="chart__2__wrapper">
        <PieChart title="Number of Users" value={10} />
        <PieChart title="Number of Users" value={10} />
        <PieChart title="Number of Users" value={10} />
      </div>
      <div className="chart__main__wrapper">
        <div className="chart__1__wrapper">
          <Charts />

          <h2>Day Summary</h2>
        </div>
        <div className="chart__score__wrapper">
          <Score score={50} project_name="Git and Github" />
          <Score score={40} project_name="Html and Css" />
          <Score score={50} project_name="Introduction to Javascript" />
        </div>
      </div>
      <div className="projects__small__title">Current projects</div>
      <Apps />
      {/* <div className="projects__main__wrapper">
        <div className="left__project__wrapper">
          <div className="image__project__wrapper"></div>
          Introduction to Javascript
        </div>
        <div className="right__project__wrapper">
          <div className="image__project__wrapper"></div>
          Introduction to Javascript
        </div>
        <div className="left__project__wrapper">
          <div className="image__project__wrapper"></div>
          Introduction to Javascript
        </div>
        <div className="right__project__wrapper">
          <div className="image__project__wrapper"></div>
          Introduction to Javascript
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
