/* eslint-disable camelcase */
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import pointSurvey from 'Survey/Point/config';

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
    ) => Sample;

    occ: {
      attrs: Attrs | any;
      verify?: (attrs: any) => any;
      create: (AppOccurrence: typeof Occurrence, photo: any) => Occurrence;
      modifySubmission: (submission: any, occ: Occurrence) => any;
    };

    modifySubmission: (submission: any) => any;
  };

  verify?: (attrs: any, sample: any) => any;

  create: (sample: typeof Sample) => Sample;

  modifySubmission: (submission: any) => any;
}
