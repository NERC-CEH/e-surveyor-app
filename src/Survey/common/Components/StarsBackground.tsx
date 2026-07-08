import background from 'common/images/branches.jpg';

type Props = {
  children?: React.ReactNode;
};

const StarsBackground = ({ children }: Props) => (
  <div
    style={{ backgroundImage: `url(${background})` }}
    className="w-full bg-cover text-white p-10"
  >
    <div className="mt-10">{children}</div>
  </div>
);

export default StarsBackground;
