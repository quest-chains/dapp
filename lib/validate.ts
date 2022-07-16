import Ajv from 'ajv';

import { Metadata } from './metadata';
import schema from './schema.json';

const ajv = new Ajv({ allowUnionTypes: true });
const validate = ajv.compile(schema);

export const validateSchema = (metadata: Metadata): boolean =>
  validate(metadata);
