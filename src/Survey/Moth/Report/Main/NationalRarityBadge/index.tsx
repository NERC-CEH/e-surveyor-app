import { ellipseOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import mothTraits, { SpeciesTraits } from 'common/data/moths/traits';
import CircleIcon from './circle.svg?react';
import DoubleExclamationIcon from './double-exclamation.svg?react';
import ExclamationIcon from './exclamation.svg?react';
import RectangleIcon from './rectangle.svg?react';
import TriangleDownIcon from './triangle-down.svg?react';
import TriangleIcon from './triangle.svg?react';

// const a = new Set();

// index traits by TVK for fast lookup
const traitsByTvk: Record<string, SpeciesTraits> = {};
mothTraits.forEach(trait => {
  traitsByTvk[trait.tvk] = trait;

  // a.add(trait?.nationalRarity);
  // console.log(a);
});

type Props = {
  tvk: string;
};

const icons: any = {
  Increasing: <TriangleIcon className="fill-primary-600" />,
  Widespread: <CircleIcon className="fill-primary-600" />,
  'No trend': <RectangleIcon className="fill-primary-600" />,
  Decreasing: <TriangleDownIcon className="fill-secondary-600" />,
  'Near Threatened': <ExclamationIcon className="fill-danger" />,
  'Regionally extinct': <DoubleExclamationIcon className="fill-danger" />,
  Threatened: <DoubleExclamationIcon className="fill-danger" />,
} as const;

const NationalRarityBadge = ({ tvk }: Props) => {
  const label = traitsByTvk[tvk]?.nationalRarity || 'Not assessed';

  const icon = icons[label] || (
    <IonIcon icon={ellipseOutline} className="w-2 m-2" />
  );

  return (
    <div className="inline-flex items-center gap-1 text-sm w-full">
      <span className="min-w-18 font-medium">GB:</span> {icon} {label}
    </div>
  );
};

export default NationalRarityBadge;
