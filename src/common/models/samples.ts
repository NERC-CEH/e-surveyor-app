import { SampleCollection } from '@flumens';
import Sample from 'models/sample';
import { samplesStore } from './store';

console.log('SavedSamples: initializing');
const samples = new SampleCollection({
  store: samplesStore,
  Model: Sample,
});

export async function uploadAll() {
  console.log('SavedSamples: uploading all.');

  const getUploadPromise = (sample: Sample) => sample.syncRemote();
  await Promise.all(samples.map(getUploadPromise));

  console.log('SavedSamples: all records were uploaded!');
}

export function getPending() {
  const byUploadStatus = (sample: Sample) =>
    !sample.syncedAt && sample.metadata.saved;

  return samples.filter(byUploadStatus);
}

export function byDate(smp1: Sample, smp2: Sample) {
  const date1 = new Date(smp1.attrs.date);
  const date2 = new Date(smp2.attrs.date);
  return date2.getTime() - date1.getTime();
}

export default samples;
