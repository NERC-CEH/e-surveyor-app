declare const Sample: {
  new (obj: any): MyInterface;

  _init: any;

  id: string | number;
  cid: string;
  cid: any;

  attrs: any;
  metadata: any;
  samples: any[];
  occurrences: any[];
  media: any[];
  remote: {
    synchronising: boolean;
  };
  error: {
    message: string;
  };
  save: () => any;
  saveRemote: () => any;
  upload: () => any;
  cleanUp: () => any;
  validateRemote: () => any;
  isUploaded: () => boolean;
  isDisabled: () => boolean;
  getSurvey: () => any;
  destroy: () => any;
  getPrettyName: () => string;
  isVolunteerSurvey: () => boolean;
  getTotalSubstrate: () => number;
  validateRemote: () => any;
  GPS: (callback?: any) => any;
  stopGPS: () => any;
  isGPSRunning: () => boolean;
  setSpecies: (arg: any) => any;
  getSpecies: () => any;
  getAISuggestions: () => any;
  getSeedmixUse: () => any;
  getUniqueSpecies: () => any;
  getSupportedSpeciesList: (species: any) => any;
  getUniqueSupportedSpecies: (species: any) => any;
};

export default Sample;
