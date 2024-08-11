import { useState } from "react";

const StatisticLine = (props) => {
  return (
    <tr>
      <td>
        {props.text}: {props.value}
      </td>
    </tr>
  );
};

const Statistics = (props) => {
  if (props.all === 0) {
    return <div>No feedback given</div>;
  }

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={props.good} />
        <StatisticLine text="neutral" value={props.neutral} />
        <StatisticLine text="bad" value={props.bad} />
        <StatisticLine text="all" value={props.all} />
        <StatisticLine text="average" value={props.average} />
        <StatisticLine text="positive" value={props.positive + " %"} />
      </tbody>
    </table>
  );
};

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1);
  };

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  };

  const handleBadClick = () => {
    setBad(bad + 1);
  };

  const all = good + neutral + bad;

  // good=1, neutral=0, bad=-1
  const sum = good - bad;

  // laskee arvot, jos palautteita enemmän kuin 0, muuten arvoina 0.
  const average = all === 0 ? 0 : sum / all;
  const positive = all === 0 ? 0 : (good / all) * 100;

  return (
    <div>
      <div>
        <h1>Give feedback</h1>
        <Button handleClick={handleGoodClick} text="good" />
        <Button handleClick={handleNeutralClick} text="neutral" />
        <Button handleClick={handleBadClick} text="bad" />
        <h1>Statistics</h1>
        <Statistics
          good={good}
          neutral={neutral}
          bad={bad}
          all={all}
          average={average}
          positive={positive}
        />
      </div>
    </div>
  );
};

export default App;
