import { openOutline } from 'ionicons/icons';
import { Badge, Main, locationToGrid } from '@flumens';
import { IonIcon } from '@ionic/react';
import Occurrence from 'common/models/occurrence';
import Sample from 'common/models/sample';
import { NewnessMap } from '../useNewnessCheck';
import LocalRarityBadge from './LocalRarityBadge';
import NationalRarityBadge from './NationalRarityBadge';
import NewnessBadges from './NewnessBadges';

const byAbundance = ([, a1]: any, [, a2]: any) => a2 - a1;

/**
 * Extracts the grid square letters (e.g. "SU", "TQ") from a location.
 */
const get100kmGrid = (location?: any) => {
  if (!location) return null;

  const gridref = location.gridref || locationToGrid(location);
  if (!gridref) return null;

  // extract letter prefix (e.g. "SU" from "SU1234" or "H" from "H1234")
  const match = gridref.match(/^([A-Z]+)/i);
  return match ? match[1].toUpperCase() : null;
};

type Props = {
  sample: Sample;
  newnessMap: NewnessMap;
};

const ReportMain = ({ sample, newnessMap }: Props) => {
  const uniqueSpeciesObj: any = {};
  const uniqueSpeciesObjCount: any = {};

  sample.occurrences.forEach(occ => {
    const { scientificName } = occ.data.taxon;
    uniqueSpeciesObj[scientificName] = occ;
    if (!uniqueSpeciesObjCount[scientificName])
      uniqueSpeciesObjCount[scientificName] = 0;
    uniqueSpeciesObjCount[scientificName] += 1;
  });

  // compute grid square letters once for all species
  const grid = get100kmGrid(sample.data.location);

  const getEntry = ([scientificNameKey, abundance]: any) => {
    const occ: Occurrence = uniqueSpeciesObj[scientificNameKey];

    const { commonName, scientificName, tvk } = occ.data.taxon;
    const link = scientificName
      ? `https://ukmoths.org.uk/species/${scientificName.replaceAll(' ', '-')}`
      : 'https://ukmoths.org.uk/top-20/';

    // look up newness status for this species
    const newness = tvk ? newnessMap[tvk] : undefined;

    return (
      <div
        className="flex justify-between gap-5 border-b-[0.5px] border-solid border-neutral-200 bg-white p-2"
        key={link}
      >
        <div className="relative">
          <div className="list-avatar">
            <img src={occ.media[0]!.getURL()} alt="" />
          </div>
          <Badge
            className="bg-primary-50 absolute -right-1.5 -bottom-1"
            color="primary"
          >{`${abundance}`}</Badge>
        </div>
        <a
          href={link}
          className="flex w-full items-center justify-between gap-2"
          role="button"
        >
          <div>
            {commonName && <div className="font-semibold">{commonName}</div>}
            {scientificName && <div className="italic">{scientificName}</div>}

            <div className="flex gap-1 flex-wrap">
              {newness && <NewnessBadges newness={newness} />}
              <LocalRarityBadge tvk={tvk} grid={grid} />
              <NationalRarityBadge tvk={tvk} />
            </div>
          </div>
          <IonIcon src={openOutline} />
        </a>
      </div>
    );
  };

  return (
    <Main>
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center justify-between rounded-md bg-white px-4 py-2">
          <span>Number of individuals</span>
          <Badge className="text-lg">{`${sample.occurrences.length}`}</Badge>
        </div>

        <h3 className="list-title">Your species</h3>
        <div className="overflow-hidden rounded-md bg-white">
          <div className="list-divider">
            <div>Species</div>
            <div>{Object.values(uniqueSpeciesObj).length}</div>
          </div>

          {Object.entries(uniqueSpeciesObjCount)
            .sort(byAbundance)
            .map(getEntry)}
        </div>
      </div>
    </Main>
  );
};

export default ReportMain;
