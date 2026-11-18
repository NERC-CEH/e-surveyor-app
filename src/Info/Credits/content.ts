import rothamstedLogo from 'common/images/rothamsted-logo.png';
import aarhusLogo from './images/aarhus-university.svg';
import agzeroLogo from './images/agzero-plus.png';
import beetleSchemeLogo from './images/brc-ground-beetle-scheme.png';
import butterflyConservationLogo from './images/butterfly-conservation.png';
import defraLogo from './images/defra.png';
import forestResearchLogo from './images/forest-research.svg';
import iRecordLogo from './images/irecord.png';
import jnccLogo from './images/jncc.png';
import naturalEnglandLogo from './images/natural-england.png';
import pomsLogo from './images/poms.png';
import ukScapeLogo from './images/uk-scape.png';
import nercLogo from './images/ukri-nerc.png';

export type Logo = {
  name: string;
  src: string;
  url: string;
};

export const FUNDERS: Logo[] = [
  {
    name: 'Defra: Natural Capital and Ecosystem Assessment (NCEA)',
    src: defraLogo,
    url: 'https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs',
  },
  {
    name: 'UKRI Natural Environment Research Council (NERC)',
    src: nercLogo,
    url: 'https://www.ukri.org/councils/nerc/',
  },
  {
    name: 'AgZero+',
    src: agzeroLogo,
    url: 'https://agzeroplus.org.uk',
  },
  {
    name: 'UK-SCAPE (UKCEH National Capability)',
    src: ukScapeLogo,
    url: 'https://uk-scape.ceh.ac.uk',
  },
];

export const PARTNERS: Logo[] = [
  { name: 'JNCC', src: jnccLogo, url: 'https://jncc.gov.uk' },
  {
    name: 'Aarhus University',
    src: aarhusLogo,
    url: 'https://www.au.dk/en/',
  },
  {
    name: 'Natural England',
    src: naturalEnglandLogo,
    url: 'https://www.gov.uk/government/organisations/natural-england',
  },
  {
    name: 'UK Pollinator Monitoring Scheme (PoMS)',
    src: pomsLogo,
    url: 'https://ukpoms.org.uk',
  },
  {
    name: 'Forest Research',
    src: forestResearchLogo,
    url: 'https://www.forestresearch.gov.uk',
  },
  {
    name: 'Rothamsted Research',
    src: rothamstedLogo,
    url: 'https://www.rothamsted.ac.uk',
  },
];

export const VERIFIERS: Logo[] = [
  { name: 'iRecord', src: iRecordLogo, url: 'https://irecord.org.uk' },
  {
    name: 'National Moth Recording Scheme (Butterfly Conservation)',
    src: butterflyConservationLogo,
    url: 'https://butterfly-conservation.org',
  },
  {
    name: 'Ground Beetle Recording Scheme',
    src: beetleSchemeLogo,
    url: 'https://www.brc.ac.uk/scheme/ground-beetle-recording-scheme',
  },
];

export const PEOPLE = [
  {
    organisation: 'UK Centre for Ecology & Hydrology:',
    names: [
      'Alyssa Duffy',
      'Tom August',
      'Richard Pywell',
      'Michael Pocock',
      'Abigail Lowe',
      'Lucy Ridding',
      'Grace Skinner',
      'Zeke Marshall',
      'Alba Gomez Segura',
      'Ben Woodcock',
      'Biren Rathod',
    ],
  },
  { organisation: 'Rothamsted Research:', names: ['Kelly Jowett'] },
  {
    organisation: 'Flumens:',
    names: ['Karolis Kazlauskis', 'Vilius Stankaitis'],
  },
];
