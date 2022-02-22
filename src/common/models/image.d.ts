export type Species = {
  gbif: {
    id: string;
  };
};

export declare const imageModel: {
  _init: any;
  attrs: {
    species: Species[];
  };
  parent: any;

  identification: {
    identifying: boolean;
  };
  isIdentifying: () => any;
  identify: () => any;
  getURL: () => string;
  save: () => any;
};

export default imageModel;
