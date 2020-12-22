import { Occurrence } from '@apps';
import Media from './image';

export default class AppOccurrence extends Occurrence {
  static fromJSON(json) {
    return super.fromJSON(json, Media);
  }

  keys = () => {
    const getRemoteProps = attrs => {
      const extractRemoteIfExists = (agg, key) => ({
        ...agg,
        [key]: attrs[key].remote || attrs[key],
      });

      return Object.keys(attrs).reduce(extractRemoteIfExists, {});
    };

    return { ...Occurrence.keys, ...getRemoteProps(this.getSurvey().attrs) };
  };

  getSurvey() {
    const survey = this.parent.getSurvey();
    return survey.occ;
  }

  isDisabled() {
    if (!this.parent) {
      throw new Error('No occurrence parent to return disabled status.');
    }

    return this.parent.isDisabled();
  }

  getSubmission(...args) {
    const survey = this.getSurvey();
    if (survey.getSubmission) {
      return survey.getSubmission(this, ...args);
    }

    return super.getSubmission(...args);
  }

  getTaxonName() {
    const { taxon } = this.attrs;
    if (!taxon || !taxon.found_in_name) {
      return null;
    }

    return taxon[taxon.found_in_name];
  }

  // eslint-disable-next-line class-methods-use-this
  validateRemote() {
    return null;
  }
}
