export interface Species {
  class: string;
  score: number;
  indicia_taxon_id: string;
  indicia_taxon_rank: string;
}

export default interface Response {
  image: string;
  timestamp: string;
  predictions: Species[];
  models: {
    binary_model: string;
    species_model: string;
  };
}
