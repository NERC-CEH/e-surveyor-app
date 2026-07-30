import { useContext } from 'react';
import { observer } from 'mobx-react';
import { NavContext } from '@ionic/react';
import { Header, Main, Page, useLoader, useToast } from 'common/flumens';
import Location from 'models/location';
import useHeaderScroll from 'helpers/useHeaderScroll';
import HeaderButton from 'Survey/common/Components/HeaderButton';
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
  const loader = useLoader();

  const { isScrolled, ...mainProps } = useHeaderScroll();

  const { location } = useLocation<Location<Data>>();
  if (!location) return null;

  const onConfirm = async () => {
    if (location.isDisabled) {
      navigate('/', 'root');
      return;
    }

    location.metadata.saved = true;
    await location.save();
    try {
      loader.show('Uploading data.');
      await location.saveRemote();
      loader.hide();
      navigate('/', 'root');
    } catch (error: unknown) {
      loader.hide();
      toast.error(error as Error);
    }
  };

  const { data } = location;

  const siteName = data[siteNameAttr.id] || 'Not provided';

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

  const headerText = location.isDisabled
    ? 'This location is disabled. You can review the information below.'
    : 'Do you wish to confirm?';

  const nextButton = (
    <HeaderButton onClick={onConfirm}>
      {!location.isDisabled ? 'Confirm' : 'Finish'}
    </HeaderButton>
  );

  return (
    <Page id="location-summary" className="theme-habitat">
      <Header
        title="Summary"
        rightSlot={nextButton}
        className={`stars-background-header ${isScrolled ? 'header-scrolled' : ''}`}
      />
      <Main {...mainProps} className="pb-ion-25">
        <StarsBackground>{headerText}</StarsBackground>

        <div className="mx-3 -mt-4 rounded-lg bg-white p-4 shadow-xl">
          <SummaryRow label="Site name" value={siteName} />
          <SummaryRow label="Site location coords" value={data.centroidSref} />
          <SummaryRow
            label="Site area size or length/width"
            value={areaOrDimensions}
          />
          <SummaryRow label="Management" value={management} />
          <SummaryRow label="Selected habitat type" value={habitatType} />
        </div>
      </Main>
    </Page>
  );
};

export default observer(LocationSummary);
