import { Db, MongoClient } from 'mongodb';

import { EnvironmentError } from '@/utils/errors';

if (!process.env.MONGODB_URI) {
  throw new EnvironmentError('MONGODB_URI');
}

const MONGODB_URI = process.env.MONGODB_URI;

const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true';

const MONGODB_DATABASE = IS_PRODUCTION ? 'quest-chains' : 'quest-chains-dev';

declare const global: {
  _clientPromise: Promise<Db>;
};

const options = {};

let clientPromise: Promise<Db>;

export const initIndexes = async (client: Db): Promise<Db> => {
  const usersCollection = client.collection('users');
  await usersCollection.createIndex(
    { address: 1 },
    { unique: true, partialFilterExpression: { address: { $type: 'string' } } },
  );
  await usersCollection.createIndex(
    { username: 1 },
    {
      unique: true,
      partialFilterExpression: { username: { $type: 'string' } },
    },
  );
  await usersCollection.createIndex(
    { email: 1 },
    { unique: true, partialFilterExpression: { email: { $type: 'string' } } },
  );

  const categoriesCollection = client.collection('categories');
  await categoriesCollection.createIndex({ value: 1 }, { unique: true });
  return client;
};

const createClientPromise = async (): Promise<Db> => {
  const client = new MongoClient(MONGODB_URI, options);
  return client
    .connect()
    .then((client: MongoClient) => client.db(MONGODB_DATABASE))
    .then(initIndexes);
};

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._clientPromise) {
    global._clientPromise = createClientPromise();
  }
  clientPromise = global._clientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = createClientPromise();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
