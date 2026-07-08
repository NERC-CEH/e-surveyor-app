import { observer } from 'mobx-react';
import { Page, Header, captureImage, useAlert, device } from '@flumens';
import appModel from 'models/app';
import Media from 'models/image';
import Sample from 'models/sample';
import getPhotoFromCustomCamera from 'helpers/CustomCamera';
import { usePromptImageSource } from 'Components/PhotoPickers/PhotoPicker';
import Main from './Main';

type URL = string;

type Props = {
  subSample: Sample;
};

const showFirstPhotoTip = (alert: any) => {
  if (!appModel.data.showFirstPhotoTip) return null;

  appModel.data.showFirstPhotoTip = false;

  return new Promise(resolve => {
    alert({
      skipTranslation: true,
      header: '5 tips for an AI-friendly image',
      message: (
        <ol>
          <li>
            Make sure that one part of your species (such as a flower or a leaf)
            is in the centre of the image.
          </li>
          <li>
            Try to avoid a busy background, particularly one with a lot of other
            species in it.
          </li>
          <li>
            Focus the image by tapping on the part of your species you want to
            take a photo of, and then slowly zoom in, refocusing as you go.
          </li>
          <li>
            Check that nothing is between the species and the camera, such as an
            insect or your finger.
          </li>
          <li>
            If the AI uis uncertain about hte species you can add more photos
            from different angles or of different parts of your species to help
            improve identification.
          </li>
        </ol>
      ),
      buttons: [
        {
          text: 'OK, got it',
          role: 'cancel',
          handler: resolve,
        },
      ],
    });
  });
};

const TrapController = ({ subSample }: Props) => {
  const alert = useAlert();

  const isDisabled = subSample.isUploaded;
  const promptImageSource = usePromptImageSource();

  const attachImages = async (photoURLs: URL[]) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const photoURL of photoURLs) {
      // eslint-disable-next-line no-await-in-loop
      const mediaModel = await Media.getImageModel(photoURL);

      const survey = subSample.parent!.getSurvey();
      const newOccurrence = survey.smp!.occ!.create!({ photo: mediaModel });

      subSample.occurrences.push(newOccurrence);
      subSample.save();

      device.isOnline && newOccurrence.identify();
    }
  };

  const onAddNewSpecies = async () => {
    const shouldUseCamera = await promptImageSource();
    const cancelled = shouldUseCamera === null;
    if (cancelled) return;

    if (shouldUseCamera) await showFirstPhotoTip(alert);

    const photoURLs = await captureImage(
      shouldUseCamera
        ? { getPhoto: getPhotoFromCustomCamera }
        : { multiple: true }
    );

    if (!photoURLs?.length) return;

    attachImages(photoURLs);
  };

  return (
    <Page id="transect-trap" className="theme-ecosystem">
      <Header title={subSample.getPrettyName()} />
      <Main
        subSample={subSample}
        isDisabled={isDisabled}
        onAddNewSpecies={onAddNewSpecies}
      />
    </Page>
  );
};

export default observer(TrapController);
