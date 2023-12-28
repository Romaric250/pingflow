import CourseItem from "./CourseItem";

const CourseList = ({ courses }) => {
  return (
    <div className="course-list">
      {courses.map((course) => (
        <CourseItem key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;
