export type IndiciaAISuggestion = {
  probability: number;
  taxon: string;
  taxa_taxon_list_id: string;
  taxon_group_id: string;
  record_cleaner: 'omit' | 'pass' | 'fail' | 'invalid';
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
