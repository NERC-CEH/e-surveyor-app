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
  getURL: () => string;
};

export default imageModel;
