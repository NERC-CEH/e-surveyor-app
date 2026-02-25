export type Query = {
  project: string;
  images: string[];
  organs: string[];
  includeRelatedImages: boolean;
};

export type Genus = {
  scientificNameWithoutAuthor: string;
  scientificNameAuthorship: string;
  scientificName: string;
};

export type Family = {
  scientificNameWithoutAuthor: string;
  scientificNameAuthorship: string;
  scientificName: string;
};

export type Species = {
  scientificNameWithoutAuthor: string;
  scientificNameAuthorship: string;
  genus: Genus;
  family: Family;
  commonNames: string[];
  scientificName: string;
};

export type Date = {
  timestamp: any;
  string: string;
};

export type Url = {
  o: string;
  m: string;
  s: string;
};

export type Image = {
  organ: string;
  author: string;
  license: string;
  date: Date;
  url: Url;
  citation: string;
};

export type Gbif = {
  id: string;
};

export type Result = {
  score: number;
  species: Species;
  images: Image[];
  gbif?: Gbif;
};

export type Response = {
  query: Query;
  language: string;
  preferedReferential: string;
  bestMatch: string;
  results: Result[];
  version: string;
  remainingIdentificationRequests: number;
};
