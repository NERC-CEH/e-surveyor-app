import taxonCleaner from './clean';
import type { RemoteAttributes } from './make';

type SpeciesEntry = [
  id: number,
  name: string,
  tvk: string,
  frequency?: number | null,
  difficulty?: number | null,
];
type Genus = [id: number, name: string, tvk: string, species: SpeciesEntry[]];

function getLastGenus(optimised: Genus[], genusName: string): Genus {
  const lastGenus = optimised.at(-1);
  if (lastGenus) return lastGenus;

  const genus: Genus = [0, genusName, '', []];
  optimised.push(genus);
  return genus;
}

function addGenus(optimised: Genus[], taxa: RemoteAttributes) {
  if (optimised.at(-1)?.[1] === taxa.taxon) {
    console.warn(`Duplicate genus found: ${taxa.taxon}`);
    return;
  }

  const taxon = taxonCleaner(taxa.taxon, false);
  if (!taxon) return;

  optimised.push([taxa.id, taxon, taxa.externalKey, []]);
}

const splitTaxonName = (taxaName: string) => {
  const parts = taxaName.split(' ');
  if (parts[0] === 'X') parts[0] = `${parts.shift()} ${parts[0]}`;
  return parts;
};

function addSpecies(optimised: Genus[], taxa: RemoteAttributes) {
  const nameParts = splitTaxonName(taxa.taxon);
  const lastGenus = getLastGenus(optimised, nameParts[0]);
  const taxon = taxonCleaner(nameParts.slice(1).join(' '), false);
  if (!taxon) return;

  const species: SpeciesEntry = [taxa.id, taxon, taxa.externalKey];
  const isPreferredOrEnglish = taxa.language !== 'Latin' || taxa.preferred;
  if (isPreferredOrEnglish && taxa.frequency) species[3] = taxa.frequency;
  if (taxa.difficulty) species[4] = taxa.difficulty;

  lastGenus[3].push(species);
}

export default function optimise(speciesFlattened: RemoteAttributes[]) {
  const optimised: Genus[] = [];

  speciesFlattened.forEach(taxa => {
    if (taxa.language !== 'Latin') return;

    if (taxa.taxon.split(' ').length === 1) addGenus(optimised, taxa);
    else addSpecies(optimised, taxa);
  });

  return optimised;
}
