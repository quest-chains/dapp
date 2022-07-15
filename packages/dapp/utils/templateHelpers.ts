import html2canvas from 'html2canvas';
import { RefObject } from 'react';

import BackgroundRectangle from '@/assets/nft-templates/background-rectangle.svg';
import BackgroundRound from '@/assets/nft-templates/background-round.svg';
import Gem01 from '@/assets/nft-templates/Gem-01.png';
import Gem02 from '@/assets/nft-templates/Gem-02.png';
import Gem03 from '@/assets/nft-templates/Gem-03.png';
import Gem04 from '@/assets/nft-templates/Gem-04.png';
import Gem05 from '@/assets/nft-templates/Gem-05.png';
import Gem06 from '@/assets/nft-templates/Gem-06.png';
import Gem07 from '@/assets/nft-templates/Gem-07.png';
import Star01 from '@/assets/nft-templates/Star-01.svg';
import Star02 from '@/assets/nft-templates/Star-02.svg';
import Star03 from '@/assets/nft-templates/Star-03.svg';

export const backgrounds = [BackgroundRound.src, BackgroundRectangle.src];

export const gems = [
  Gem01.src,
  Gem02.src,
  Gem03.src,
  Gem04.src,
  Gem05.src,
  Gem06.src,
  Gem07.src,
];

export const stars = [Star01.src, Star02.src, Star03.src];

export const backgroundNames = ['Circle', 'Square'];

export const gemNames = ['Jaka', 'Ines', 'Nina', 'Mojca', 'Nace', 'Eva', 'Lan'];

export const componentToPNG = async (node: RefObject<HTMLDivElement>) => {
  if (!node.current) return '';
  const canvas = await html2canvas(node.current, {
    scrollY: -window.scrollY,
    useCORS: true,
    backgroundColor: null,
    scale: 2,
  });
  const dataURI = canvas.toDataURL('image/png', 1.0);
  return dataURI;
};

export const dataURItoFile = (dataURI: string, filename: string): File => {
  const binary = window.atob(dataURI.split(',')[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }

  const mimeType = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const blob = new Blob([new Uint8Array(array)], { type: mimeType });
  const file = new File([blob], filename);
  return file;
};
