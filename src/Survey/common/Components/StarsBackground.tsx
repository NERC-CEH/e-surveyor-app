import background from 'common/images/branches.jpg';

type Props = {
  children?: React.ReactNode;
};

const StarsBackground = ({ children }: Props) => (
  <div
    style={{ backgroundImage: `url(${background})` }}
    className="w-full bg-cover text-white px-3 py-10 mt-[env(safe-area-inset-top)]"
  >
    <div className={children ? 'mt-10' : 'mt-3'}>{children}</div>
  </div>
);

export default StarsBackground;
