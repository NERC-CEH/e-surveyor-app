export type IndiciaAISuggestion = {
  probability: number;
  taxon: string;
  taxa_taxon_list_id: string;
  taxon_group_id: string;
  record_cleaner:
    | 'pass' /** All tests performed by the service were successful. */
    | 'warn' /** A warning from the service, e.g. there are no rules for the taxon. */
    | 'fail' /** A test performed by the service failed, e.g. the location is outside the known range of the taxon. */
    | 'omit' /** Input parameters have been omitted. */
    | 'error' /** A fault communicating with the service, e.g. if the service is down or the password is incorrect. */
    | 'invalid' /** A fault in the input parameters, e.g. a number where a string is expected. */;
  external_key: string;
  organism_key: string;
  default_common_name?: string;
  identification_difficulty?: number;
};

export default interface IndiciaAIResponse<T> {
  classifier_id: string;
  classifier_version: string;
  suggestions: IndiciaAISuggestion[];
  raw: T;
}
