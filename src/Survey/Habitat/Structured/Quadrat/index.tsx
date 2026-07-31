import { useContext } from 'react';
import { observer } from 'mobx-react';
import { Page, Header, device, captureImage, useAlert } from '@flumens';
import { NavContext } from '@ionic/react';
import appModel from 'models/app';
import Media from 'models/image';
import Sample from 'models/sample';
import getPhotoFromCustomCamera from 'helpers/CustomCamera';
import { usePromptImageSource } from 'Components/PhotoPickers/PhotoPicker';
import HeaderButton from 'Survey/common/Components/HeaderButton';
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

const QuadratController = ({ subSample }: Props) => {
  const alert = useAlert();
  const { goBack } = useContext(NavContext);

  const isDisabled = subSample.isUploaded;
  const promptImageSource = usePromptImageSource();

  const attachImages = async (photoURLs: URL[]) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const photoURL of photoURLs) {
      // eslint-disable-next-line no-await-in-loop
      const image = await Media.getImageModel(photoURL);

      const survey = subSample.getSurvey();
      const newOccurrence = survey.occ!.create!({ photo: image });

      subSample.occurrences.push(newOccurrence);

      device.isOnline && newOccurrence.identify(); // must be after adding to top sample to be able to access its location

      subSample.save();
    }
  };

  const photoSelect = async () => {
    const shouldUseCamera = await promptImageSource();
    const cancelled = shouldUseCamera === null;
    if (cancelled) return;

    if (shouldUseCamera) {
      await showFirstPhotoTip(alert);
    }

    const photoURLs = await captureImage(
      shouldUseCamera
        ? { getPhoto: getPhotoFromCustomCamera }
        : { multiple: true }
    );

    if (!photoURLs?.length) return;

    attachImages(photoURLs);
  };

  const isInvalid = !subSample.media.length;

  const onDone = async () => {
    if (isInvalid) {
      await alert({
        header: 'Photo required',
        message: 'Please attach at least one photo to the quadrat.',
        buttons: [{ text: 'OK' }],
      });
      return;
    }

    subSample.metadata.saved = true;
    subSample.save();

    goBack();
  };

  const doneButton =
    isDisabled || subSample.metadata.saved ? null : (
      <HeaderButton onClick={onDone} isInvalid={isInvalid}>
        Done
      </HeaderButton>
    );

  return (
    <Page id="transect-quadrat" className="theme-habitat">
      <Header title={subSample.getPrettyName()} rightSlot={doneButton} />
      <Main
        subSample={subSample}
        isDisabled={isDisabled}
        photoSelect={photoSelect}
      />
    </Page>
  );
};

export default observer(QuadratController);
