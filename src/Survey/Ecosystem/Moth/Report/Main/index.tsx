import { Badge, Main, locationToGrid } from '@flumens';
import Occurrence from 'common/models/occurrence';
import Sample from 'common/models/sample';
import { NewnessMap } from '../useNewnessCheck';
import HabitatCountBadge from './HabitatCountBadge';
import HostPlantBadge from './HostPlantBadge';
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
        className="flex overflow-hidden rounded-md flex-col justify-center items-start gap-2 border border-neutral-200 bg-white p-2"
        key={link}
      >
        <div className="flex gap-5">
          <div className="relative">
            <div className="list-avatar">
              <img
                src={occ.media[0].getURL()}
                alt=""
                className="w-full h-full"
              />
            </div>
            <Badge className="bg-neutral-50 font-semibold text-neutral-800 absolute -right-1.5 -bottom-1">{`${abundance}`}</Badge>
          </div>

          <div className="w-full flex flex-col justify-center">
            {commonName && <div className="font-semibold">{commonName}</div>}
            {scientificName && <div className="italic">{scientificName}</div>}
          </div>
        </div>

        <div className="flex gap-1 flex-nowrap mt-1 border border-neutral-200 p-2 w-full bg-neutral-50 rounded-md justify-between items-center">
          <div className="flex flex-col">
            <LocalRarityBadge tvk={tvk} grid={grid} />
            <NationalRarityBadge tvk={tvk} />
          </div>
          <div className="border-l border-neutral-200 h-full pl-4">
            {newness && <NewnessBadges newness={newness} />}
          </div>
        </div>
        <div className="flex gap-1 flex-wrap mt-1 border border-neutral-200 p-2 w-full bg-neutral-50 rounded-md">
          <HostPlantBadge tvk={tvk} />
          <HabitatCountBadge tvk={tvk} />
        </div>
      </div>
    );
  };

  return (
    <Main>
      <div className="list">
        <div className="flex items-center justify-between rounded-md bg-white px-4 py-2">
          <span>Number of individuals</span>
          <Badge className="text-lg">{`${sample.occurrences.length}`}</Badge>
        </div>

        <div className="flex items-center justify-between rounded-md bg-white px-4 py-2">
          <span>Number of species</span>
          <Badge className="text-lg">{`${Object.values(uniqueSpeciesObj).length}`}</Badge>
        </div>

        <h3 className="list-divider">Your species:</h3>
        <div className="list">
          {Object.entries(uniqueSpeciesObjCount)
            .sort(byAbundance)
            .map(getEntry)}
        </div>
      </div>
    </Main>
  );
};

export default ReportMain;
