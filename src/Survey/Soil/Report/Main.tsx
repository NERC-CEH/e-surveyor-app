import { Main } from '@flumens';
import Sample from 'common/models/sample';
import mockup from './report.png';

type Props = { sample: Sample };

const ReportMain = ({ sample }: Props) => {
  console.log(sample.cid);
  return (
    <Main>
      <img src={mockup} alt="" className="" />
    </Main>
  );
};

export default ReportMain;
