import Log from 'helpers/log';
import Sample from 'models/sample';
import { initStoredSamples } from '@flumens';
import { modelStore } from './store';

Log('SavedSamples: initializing');
const savedSamples = initStoredSamples(modelStore, Sample);

export default savedSamples;
