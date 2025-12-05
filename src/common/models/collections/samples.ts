import { SampleCollection } from '@flumens';
import config from 'common/config';
import Sample from 'models/sample';
import Occurrence from '../occurrence';
import { samplesStore } from '../store';
import userModel from '../user';

console.log('SavedSamples: initializing');

const samples: SampleCollection<Sample> = new SampleCollection({
  store: samplesStore,
  Model: Sample,
  Occurrence,
  url: config.backend.indicia.url,
  getAccessToken: () => userModel.getAccessToken(),
}) as any;

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
  const date1 = new Date(smp1.data.date);
  const date2 = new Date(smp2.data.date);
  return date2.getTime() - date1.getTime();
}

export default samples;
