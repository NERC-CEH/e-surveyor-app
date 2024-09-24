import { initStoredSamples } from '@flumens';
import Sample from 'models/sample';
import { modelStore } from './store';

console.log('SavedSamples: initializing');
const savedSamples = initStoredSamples(modelStore, Sample);

// eslint-disable-next-line
savedSamples.uploadAll = async () => {
  console.log('SavedSamples: uploading all.');

  const getUploadPromise = (sample: Sample) => sample.upload();
  await Promise.all(savedSamples.map(getUploadPromise));

  console.log('SavedSamples: all records were uploaded!');
};

export function getPending() {
  const byUploadStatus = (sample: Sample) =>
    !sample.metadata.syncedOn && sample.metadata.saved;

  return savedSamples.filter(byUploadStatus);
}

export function byDate(smp1: Sample, smp2: Sample) {
  const date1 = new Date(smp1.attrs.date);
  const date2 = new Date(smp2.attrs.date);
  return date2.getTime() - date1.getTime();
}

export default savedSamples;
