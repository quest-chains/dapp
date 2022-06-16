import Ajv from 'ajv';
import schema from './schema.json';
import { Metadata } from './metadata';

const ajv = new Ajv({ allowUnionTypes: true });
const validate = ajv.compile(schema);

export const validateSchema = (metadata: Metadata): boolean =>
  validate(metadata);
