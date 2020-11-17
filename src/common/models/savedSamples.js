import Log from 'helpers/log';
import Sample from 'sample';
import { initStoredSamples } from '@apps';
import { modelStore } from './store';

Log('SavedSamples: initializing');
const savedSamples = initStoredSamples(modelStore, Sample);

export default savedSamples;
