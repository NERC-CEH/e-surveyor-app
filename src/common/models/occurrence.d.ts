export type Species = {
  warehouseId: number;
  gbif: { id: number };
  images: string[];
  score: number;
  species: {
    commonNames: string[];
    scientificNameWithoutAuthor: string;
  };
};

declare const Occurrence: {
  new (obj: any): MyInterface;
  cid: string;
  _init: any;
  attrs: any;
  save: () => any;
  metadata: any;

  media: any[];
  destroy: () => any;
  getSurvey: any;
  attrs: any;
  isDisabled: () => bool;
  isIdentifying: () => bool;
  isDisabled: () => any;
  identify: () => any;

  getTaxonName?: any;
};

export default Occurrence;
