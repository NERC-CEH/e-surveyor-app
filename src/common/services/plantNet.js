import config from 'config';
import Log from 'helpers/log';
import { isPlatform } from '@ionic/react';
import UKSIPlants from '../data/uksi_plants.list.json';
import UKPlantNames from '../data/uksi_plants.names.json';

const { siteUrl } = config;

/**
 * Converts DataURI object to a Blob.
 *
 * @param {type} dataURI
 * @param {type} fileType
 * @returns {undefined}
 */
export function dataURItoBlob(dataURI, fileType) {
  const binary = atob(dataURI.split(',')[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {
    type: fileType,
  });
}

export function URLtoBlob(url) {
  const cb = resolve => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function onLoad() {
      resolve(xhr.response);
    };

    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  };

  return new Promise(cb);
}

export function getBlobFromURL(uri, mediaType) {
  if (!isPlatform('hybrid')) {
    const blob = dataURItoBlob(uri, mediaType);
    return Promise.resolve(blob);
  }

  return URLtoBlob(uri);
}

async function appendModelToFormData(mediaModel, formData) {
  // can provide both image/jpeg and jpeg
  const { type } = mediaModel.attrs;
  let extension = type;
  let mediaType = type;
  if (type.match(/image.*/)) {
    [, extension] = type.split('/');
  } else {
    mediaType = `image/${mediaType}`;
  }

  const url = mediaModel.getURL();

  const blob = await getBlobFromURL(url, mediaType);

  const name = mediaModel.cid;

  formData.append('images', blob, `${name}.${extension}`);
}

function filterUKSpeciesWrap(species) {
  const filterByUKSpecies = ({ species: sp }) =>
    UKSIPlants.includes(sp.scientificNameWithoutAuthor);

  return species.filter(filterByUKSpecies);
}

function changeUKCommonNamesWrap(species) {
  const changeUKCommonNames = ({ species: s }) => {
    const { scientificNameWithoutAuthor } = s;
    const speciesUKName = UKPlantNames[scientificNameWithoutAuthor];
    s.commonNames = !speciesUKName ? [] : [speciesUKName]; // eslint-disable-line
  };

  species.forEach(changeUKCommonNames);

  return species;
}

const response = res => res.json();

const result = ({ results }) => results;

const err = error => {
  Log('error', error);
  return []; // always empty list
};

// TODO: use axios
export default async function identify(image) {
  const formData = new FormData();

  formData.append('organs', 'leaf');
  await appendModelToFormData(image, formData);

  return fetch(`${siteUrl}/identify`, {
    method: 'post',
    body: formData,
  })
    .then(response)
    .then(result)
    .then(filterUKSpeciesWrap)
    .then(changeUKCommonNamesWrap)
    .catch(err);
}
