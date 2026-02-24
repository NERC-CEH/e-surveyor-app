import fs from 'fs';
import mothRarity from '../cacheRemote/moth_local_rarity.json';

type TVK = string;
type Grid = string;
enum Rarity {
  Common = 1,
  Uncommon = 2,
}

const getData = async () => {
  const result: Record<TVK, Record<Grid, Rarity>> = {};

  mothRarity.forEach(({ tvk, sq100Km, localRarity }) => {
    result[tvk] = result[tvk] || {};
    result[tvk][sq100Km] = localRarity === 'Common' ? 1 : 2;
  });

  fs.writeFileSync('./local_rarity.json', JSON.stringify(result));

  console.log('All done! 🚀');
};

getData();
