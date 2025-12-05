import { openOutline } from 'ionicons/icons';
import { Badge, Main } from '@flumens';
import { IonIcon } from '@ionic/react';
import Occurrence from 'common/models/occurrence';
import Sample from 'common/models/sample';

const byAbundance = ([, a1]: any, [, a2]: any) => a2 - a1;

type Props = { sample: Sample };

const ReportMain = ({ sample }: Props) => {
  const uniqueSpeciesObj: any = {};
  const uniqueSpeciesObjCount: any = {};

  sample.occurrences.forEach(occ => {
    const { scientificName } = occ.data.taxon;
    uniqueSpeciesObj[scientificName] = occ;
    if (!uniqueSpeciesObjCount[scientificName])
      uniqueSpeciesObjCount[scientificName] = 0;
    uniqueSpeciesObjCount[scientificName] += 1;
  });

  const getEntry = ([scientificNameKey, abundance]: any) => {
    const occ: Occurrence = uniqueSpeciesObj[scientificNameKey];

    const { commonName, scientificName } = occ.data.taxon;
    const link = scientificName
      ? `https://ukmoths.org.uk/species/${scientificName.replaceAll(' ', '-')}`
      : 'https://ukmoths.org.uk/top-20/';

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
