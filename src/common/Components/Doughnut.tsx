import { Doughnut as DoughnutChart } from 'react-chartjs-2';
import config from 'common/config';

const { positiveThreshold, possibleThreshold } = config;

const options = {
  cutout: '80%',
  layout: {
    padding: { top: -9 }, // for some reason the chart is moved down
  },
  tooltip: { enabled: false }, // Disable the on-canvas tooltip
  animation: { animation: false, animateRotate: false },
};

const getDoughnutData = (score: number) => {
  const scorePercent = parseInt((score * 100).toFixed(0), 10);

  const color = () => {
    if (scorePercent > positiveThreshold * 100) {
      return '#4b9a43'; // green
    }

    if (scorePercent > possibleThreshold * 100) {
      return '#ffbc5e'; // yellow
    }

    return '#ff4e46'; // red
  };

  const remainingScorePercent = 100 - scorePercent;

  return {
    datasets: [
      {
        data: [scorePercent, remainingScorePercent],
        backgroundColor: [color(), '#e2e2e2'],
        borderWidth: [0, 0],
      },
    ],
    text: `${scorePercent}%`,
  };
};

type Props = { probability: number };

const Doughnut = ({ probability }: Props) => (
  <div className="p-1.25 relative size-13 shrink-0 self-center">
    <DoughnutChart
      data={getDoughnutData(probability)}
      options={options}
      redraw
    />
    <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center text-[0.7em]">
      {getDoughnutData(probability).text}
    </div>
  </div>
);

export default Doughnut;
