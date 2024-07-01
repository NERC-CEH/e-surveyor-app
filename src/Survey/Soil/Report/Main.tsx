import { Main } from '@flumens';
import Sample from 'common/models/sample';

type Props = { sample: Sample };

const ReportMain = ({ sample }: Props) => {
  console.log(sample.cid);
  return <Main>REPORT HERE</Main>;
};

export default ReportMain;
