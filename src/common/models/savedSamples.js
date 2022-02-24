import Sample from 'models/sample';
import { initStoredSamples } from '@flumens';
import { modelStore } from './store';

console.log('SavedSamples: initializing');
const savedSamples = initStoredSamples(modelStore, Sample);

export default savedSamples;
