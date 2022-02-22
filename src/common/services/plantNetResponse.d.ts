export interface Query {
  project: string;
  images: string[];
  organs: string[];
  includeRelatedImages: boolean;
}

export interface Genus {
  scientificNameWithoutAuthor: string;
  scientificNameAuthorship: string;
  scientificName: string;
}

export interface Family {
  scientificNameWithoutAuthor: string;
  scientificNameAuthorship: string;
  scientificName: string;
}

export interface Species {
  scientificNameWithoutAuthor: string;
  scientificNameAuthorship: string;
  genus: Genus;
  family: Family;
  commonNames: string[];
  scientificName: string;
}

export interface Date {
  timestamp: any;
  string: string;
}

export interface Url {
  o: string;
  m: string;
  s: string;
}

export interface Image {
  organ: string;
  author: string;
  license: string;
  date: Date;
  url: Url;
  citation: string;
}

export interface Gbif {
  id: string;
}

export interface Result {
  score: number;
  species: Species;
  images: Image[];
  gbif?: Gbif;
}

export default interface Response {
  query: Query;
  language: string;
  preferedReferential: string;
  bestMatch: string;
  results: Result[];
  version: string;
  remainingIdentificationRequests: number;
}
