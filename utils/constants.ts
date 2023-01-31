import { graphql } from '@quest-chains/sdk';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID!;

export const SUPPORTED_NETWORKS = process.env
  .NEXT_PUBLIC_SUPPORTED_NETWORKS!.split(' ')
  .filter(n => !!n && !Number.isNaN(Number(n)))
  .map(n => `0x${Number(n).toString(16)}`)
  .filter(n => graphql.SUPPORTED_NETWORKS.includes(n));

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.questchains.xyz';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const QUESTCHAINS_URL =
  process.env.NEXT_PUBLIC_QUESTCHAINS_URL || 'https://questchains.xyz';
