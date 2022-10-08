import { metadata } from '@quest-chains/sdk';

import { API_URL } from './constants';

export type Metadata = metadata.Metadata;

const MetadataUploader = metadata.MetadataUploader;

export const uploader = new MetadataUploader(API_URL);

export const uploadMetadata = async (metadata: Metadata): Promise<string> =>
  uploader.uploadMetadata(metadata);

export const uploadFiles = async (files: File[] | FileList): Promise<string> =>
  uploader.uploadFiles(files as File[]);
