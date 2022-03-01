import Sample from 'models/sample';
import { initStoredSamples, device } from '@flumens';
import userModel from 'models/user';
import { modelStore } from './store';

console.log('SavedSamples: initializing');
const savedSamples = initStoredSamples(modelStore, Sample);

// eslint-disable-next-line
savedSamples.uploadAll = async (toast: any, loader: any) => {
  console.log('SavedSamples: uploading all.');

  if (!device.isOnline) {
    toast.warn('Looks like you are offline!');
    return false;
  }

  const isActivated = await userModel.checkActivation(toast, loader);
  if (!isActivated) {
    return false;
  }

  const getUploadPromise = (sample: typeof Sample) => {
    if (
      sample.remote.synchronising ||
      sample.isUploaded() ||
      sample.validateRemote()
    ) {
      return null;
    }

    return sample.saveRemote();
  };
  await Promise.all(savedSamples.map(getUploadPromise));

  console.log('SavedSamples: all records were uploaded!');
};

export default savedSamples;
