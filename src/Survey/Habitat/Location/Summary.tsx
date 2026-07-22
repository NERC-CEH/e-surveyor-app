import { useContext } from 'react';
import { observer } from 'mobx-react';
import { NavContext } from '@ionic/react';
import { Header, Main, Page, useToast } from 'common/flumens';
import Location from 'models/location';
import useHeaderScroll from 'helpers/useHeaderScroll';
import Footer from 'Survey/Habitat/common/Footer';
import StarsBackground from 'Survey/common/Components/StarsBackground';
import {
  activitiesAttr,
  Data,
  habitatAttr,
  siteLengthAttr,
  siteNameAttr,
  siteSizeAttr,
  siteWidthAttr,
} from './config';
import useLocation from './useLocation';

type Props = {
  label: string;
  value: string;
};

const SummaryRow = ({ label, value }: Props) => (
  <div className="border-b border-neutral-200 py-3 last:border-b-0">
    <div className="text-xs uppercase tracking-wide opacity-60">{label}</div>
    <div className="mt-1 text-sm wrap-break-word">{value}</div>
  </div>
);

const LocationSummary = () => {
  const { navigate } = useContext(NavContext);
  const toast = useToast();

  const { isScrolled, ...mainProps } = useHeaderScroll();

  const { location } = useLocation<Location<Data>>();
  if (!location) return null;

  const onConfirm = async () => {
    location.metadata.saved = true;
    await location.save();
    try {
      await location.saveRemote();
      navigate('/', 'root');
    } catch (error: unknown) {
      toast.error(error as Error);
    }
  };

  const { data } = location;
  const dataRecord = data as unknown as Record<string, unknown>;

  const latitude = Number(dataRecord.latitude);
  const longitude = Number(dataRecord.longitude);

  const siteName = data[siteNameAttr.id] || 'Not provided';

  const coordinates =
    Number.isFinite(latitude) && Number.isFinite(longitude)
      ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      : 'Not available';

  const areaValue = data[siteSizeAttr.id];
  const lengthValue = data[siteLengthAttr.id];
  const widthValue = data[siteWidthAttr.id];

  let areaOrDimensions = 'Not provided';

  if (Number.isFinite(areaValue)) {
    areaOrDimensions = `${areaValue} ha`;
  }

  if (!Number.isFinite(areaValue) && (lengthValue || widthValue)) {
    areaOrDimensions = `${lengthValue || '-'} m x ${widthValue || '-'} m`;
  }

  const selectedValues = data[activitiesAttr.id];
  const selectedList: string[] = [];

  if (Array.isArray(selectedValues)) {
    selectedList.push(...selectedValues);
  }

  if (selectedValues && !Array.isArray(selectedValues)) {
    selectedList.push(selectedValues as any);
  }

  const managementLabels = activitiesAttr.choices
    .filter(choice => selectedList.includes(choice.dataName))
    .map(choice => choice.title);

  const management = managementLabels.length
    ? managementLabels.join(', ')
    : 'None selected';

  const selectedHabitat = data[habitatAttr.id] as string | undefined;

  const habitatType =
    habitatAttr.choices.find(choice => choice.dataName === selectedHabitat)
      ?.title || 'Not selected';

  return (
    <Page id="location-summary" className="theme-habitat">
      <Header
        title="Summary"
        className={`stars-background-header ${isScrolled ? 'header-scrolled' : ''}`}
      />
      <Main {...mainProps} className="[--padding-bottom:100px]">
        <StarsBackground>Do you wish to confirm?</StarsBackground>

        <div className="mx-3 -mt-4 rounded-lg bg-white p-4 shadow-xl">
          <SummaryRow label="Site name" value={siteName} />
          <SummaryRow label="Site location coords" value={coordinates} />
          <SummaryRow
            label="Site area size or length/width"
            value={areaOrDimensions}
          />
          <SummaryRow label="Management" value={management} />
          <SummaryRow label="Selected habitat type" value={habitatType} />
        </div>
      </Main>

      <Footer onClick={onConfirm} title="Confirm" />
    </Page>
  );
};

export default observer(LocationSummary);
