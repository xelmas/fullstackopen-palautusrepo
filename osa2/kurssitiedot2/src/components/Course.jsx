const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0);

  return (
    <p>
      {" "}
      <strong>total of {total} exercises</strong>
    </p>
  );
};
const Header = (props) => {
  return <h2>{props.course}</h2>;
};

const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  );
};

const Content = (props) => {
  return (
    <div>
      {props.parts.map((part) => (
        <Part key={part.id} name={part.name} exercises={part.exercises}></Part>
      ))}
    </div>
  );
};

const Course = ({ course }) => {
  const header = course.name;
  const parts = course.parts;

  return (
    <div>
      <Header course={header}></Header>
      <Content parts={parts}></Content>
      <Total parts={parts}></Total>
    </div>
  );
};

export default Course;
