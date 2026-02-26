import { ellipseOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import mothTraits, { SpeciesTraits } from 'common/data/moths/traits';
import DoubleExclamationIcon from './double-exclamation.svg?react';
import ExclamationIcon from './exclamation.svg?react';
import RectangleIcon from './rectangle.svg?react';
import TriangleDownIcon from './triangle-down.svg?react';
import TriangleIcon from './triangle.svg?react';

// const a = new Set();
// a.add(trait?.nationalRarity);
// console.log(a);

// index traits by TVK for fast lookup
const traitsByTvk: Record<string, SpeciesTraits> = {};
mothTraits.forEach(trait => {
  traitsByTvk[trait.tvk] = trait;
});

type Props = {
  tvk: string;
};

const icons: any = {
  'Widespread, No trend': <RectangleIcon className="fill-primary-600" />,
  Widespread: <RectangleIcon className="fill-primary-600" />,
  'Widespread, Increasing': <TriangleIcon className="fill-primary-600" />,
  'Widespread, Declining': <TriangleDownIcon className="fill-secondary-600" />,
  'Of concern': <ExclamationIcon className="fill-danger" />,
  'Regionally extinct': <DoubleExclamationIcon className="fill-danger" />,
  Threatened: <DoubleExclamationIcon className="fill-danger" />,
  'Data deficient': '',
  'Not assessed': '',
};

const NationalRarityBadge = ({ tvk }: Props) => {
  const label = traitsByTvk[tvk]?.nationalRarity;
  if (!label) return null;

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
