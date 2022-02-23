/* eslint-disable camelcase */
import pointSurvey from 'Survey/Point/config';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';

export default {
  [pointSurvey.name]: pointSurvey,
};

interface Attrs {}

export interface Survey {
  id: number;
  name: 'transect' | 'point';
  label: string;
  icon: string;

  attrs: Attrs;

  smp: {
    attrs: Attrs;

    create: (
      AppSample: typeof Sample,
      AppOccurrence: typeof Occurrence,
      photo?: any
    ) => any;

    occ: {
      attrs: Attrs | any;
      verify?: (attrs: any) => any;
      create: (AppOccurrence: typeof Occurrence, photo: any) => any;
      modifySubmission: (submission: any) => any;
    };

    modifySubmission: (submission: any) => any;
  };

  verify?: (attrs: any, sample: any) => any;

  create: (sample: typeof Sample) => any;

  modifySubmission: (submission: any) => any;
}
