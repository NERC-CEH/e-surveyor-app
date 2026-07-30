/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { observer } from 'mobx-react';
import Media from 'models/image';

type Props = {
  media: Media;
  onClick: any;
};

const Image = ({ media, onClick }: Props) => (
  <div className="img">
    <img src={media.getURL()} onClick={onClick} />
  </div>
);

export default observer(Image);
