import { graphql } from '@quest-chains/sdk';

import { EnvironmentError } from './errors';

if (!process.env.NEXT_PUBLIC_INFURA_ID)
  throw new EnvironmentError('NEXT_PUBLIC_INFURA_ID');

export const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;

if (!process.env.NEXT_PUBLIC_SUPPORTED_NETWORKS)
  throw new EnvironmentError('NEXT_PUBLIC_SUPPORTED_NETWORKS');

export const SUPPORTED_NETWORKS =
  process.env.NEXT_PUBLIC_SUPPORTED_NETWORKS.split(' ')
    .filter(n => !!n && !Number.isNaN(Number(n)))
    .map(n => `0x${Number(n).toString(16)}`)
    .filter(n => graphql.SUPPORTED_NETWORKS.includes(n));

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.questchains.xyz';

export const QUESTCHAINS_LANDING_URL =
  process.env.NEXT_PUBLIC_QUESTCHAINS_LANDING_URL || 'https://questchains.xyz';

export const QUESTCHAINS_URL =
  process.env.NEXT_PUBLIC_QUESTCHAINS_URL || 'https://app.questchains.xyz';

export const PLAUSIBLE_DATA_DOMAIN =
  process.env.NEXT_PUBLIC_PLAUSIBLE_DATA_DOMAIN ||
  'questchains.xyz,app.questchains.xyz';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
